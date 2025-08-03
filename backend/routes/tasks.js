const express = require('express');
const { prisma } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all tasks (admin only)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        notifications: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tasks for current user (including general tasks)
router.get('/my-tasks', authenticateToken, async (req, res) => {
  try {
    // Get both user-specific tasks and general tasks
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          // User's tasks
          { userId: req.user.id },
          // General tasks (userId is null)
          { userId: null }
        ],
        // Exclude completed tasks
        status: {
          not: 'afgerond'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Fetched tasks for user:', {
      userId: req.user.id,
      taskCount: tasks.length,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        userId: t.userId
      }))
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tasks by user ID (admin only)
router.get('/user/:userId', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await prisma.task.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new task (admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    console.log('Creating task with data:', req.body);
    const { title, description, userId, pdfName, pdfUrl } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create task with default status if not provided
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: 'open',
        userId: userId ? parseInt(userId) : null,
        pdfName: pdfName || null,
        pdfUrl: pdfUrl || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Task created successfully:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const taskId = parseInt(id);

    console.log('Updating task:', {
      taskId,
      updates,
      user: req.user
    });

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access (admin or task owner, of algemene taak claimen)
    const isAdmin = req.user.role === 'admin';
    const isOwner = task.userId === req.user.id;
    const isGeneralTask = task.userId === null;
    const isAssigningGeneralTask = isGeneralTask && updates.userId && parseInt(updates.userId) > 0;

    if (!isAdmin && !isOwner && !isAssigningGeneralTask) {
      console.log('Access denied:', {
        userId: req.user.id,
        taskUserId: task.userId,
        userRole: req.user.role,
        attemptedAssign: updates.userId
      });
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle userId updates
    let userId = updates.userId;
    if (userId === 0 || userId === '0') {
      userId = null;
    } else if (userId) {
      userId = parseInt(userId);
    }

    // If task is being marked as completed
    if (updates.status === 'afgerond' && task.status !== 'afgerond') {
      updates.completedAt = new Date();
      
      // Create notification for admin
      if (req.user.role !== 'admin') {
        await prisma.notification.create({
          data: {
            message: `Task "${task.title}" marked as completed by ${req.user.name}`,
            userId: 1, // Admin user ID
            taskId: taskId
          }
        });
      }
    }

    // Prepare update data
    const updateData = {
      ...updates,
      userId,
      updatedAt: new Date()
    };

    console.log('Updating task with data:', updateData);

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Task updated successfully:', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
});

// Delete task (admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    // Delete associated notifications first
    await prisma.notification.deleteMany({
      where: { taskId }
    });

    // Then delete the task
    await prisma.task.delete({
      where: { id: taskId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 