const express = require('express');
const { prisma } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create work order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      postalCode,
      city,
      description,
      date,
      items,
      notes,
      totals
    } = req.body;

    // Validate required fields
    if (!customerName || !phone || !description) {
      return res.status(400).json({ 
        error: 'Klantnaam, telefoonnummer en omschrijving zijn verplicht' 
      });
    }

    // Create work order
    const workOrder = await prisma.workOrder.create({
      data: {
        customerName,
        phone,
        email: email || null,
        address: address || null,
        postalCode: postalCode || null,
        city: city || null,
        description,
        date: new Date(date),
        notes: notes || null,
        subtotal: totals.subtotal,
        vatAmount: totals.vatAmount,
        total: totals.total,
        createdBy: req.user.id,
        status: 'open'
      }
    });

    // Create work order items
    if (items && items.length > 0) {
      await Promise.all(
        items.map(item =>
          prisma.workOrderItem.create({
            data: {
              workOrderId: workOrder.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              vatPercentage: item.vatPercentage
            }
          })
        )
      );
    }

    // Create task from work order
    const taskDescription = `Klant: ${customerName}
Telefoon: ${phone}
${email ? `E-mail: ${email}` : ''}
${address ? `Adres: ${address}, ${postalCode} ${city}` : ''}

Werk: ${description}

Artikelen:
${items.map(item => 
  `- ${item.name}: ${item.quantity}x €${item.price.toFixed(2)} (${item.vatPercentage}% BTW)`
).join('\n')}

Totaal: €${totals.total.toFixed(2)}

${notes ? `Opmerkingen: ${notes}` : ''}`;

    const task = await prisma.task.create({
      data: {
        title: `Werkorder: ${customerName}`,
        description: taskDescription,
        status: 'open',
        userId: req.user.id,
        workOrderId: workOrder.id
      }
    });

    res.status(201).json({
      workOrder,
      task,
      message: 'Werkorder succesvol aangemaakt en toegevoegd aan taken'
    });

  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all work orders (admin only)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        items: true,
        task: true,
        createdByUser: {
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

    res.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get work order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: true,
        task: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found' });
    }

    // Check if user has access (admin or creator)
    if (req.user.role !== 'admin' && workOrder.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(workOrder);
  } catch (error) {
    console.error('Error fetching work order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update work order status
router.patch('/:id/status', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const workOrder = await prisma.workOrder.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    res.json(workOrder);
  } catch (error) {
    console.error('Error updating work order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 