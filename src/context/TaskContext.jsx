import React, { createContext, useContext, useState, useEffect } from "react";
import { getUsers } from "../services/auth";
import { taskService } from "../services/tasks";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { id: currentUserId, role } = useAuth() || {};
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { createTaskCompletedNotification } = useNotifications();

  // Fetch users and tasks when auth state changes
  useEffect(() => {
    const initializeData = async () => {
      if (currentUserId) {
        await Promise.all([
          fetchUsers(),
          fetchTasks()
        ]);
      } else {
        setTasks([]);
        setUsers([]);
      }
    };

    initializeData();
  }, [currentUserId, role]);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Invalid users data format:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  }

  async function fetchTasks() {
    try {
      setLoading(true);
      let data;
      
      // Always use getMyTasks for regular users
      // Only use getTasks for admin role
      if (role === 'admin') {
        console.log('Fetching all tasks (admin)');
        data = await taskService.getTasks();
      } else {
        console.log('Fetching my tasks (user)');
        data = await taskService.getMyTasks();
      }
      
      if (Array.isArray(data)) {
        // Ensure consistent userId format
        const normalizedTasks = data.map(task => ({
          ...task,
          userId: task.userId === 0 ? null : task.userId
        }));
        console.log('Setting tasks:', normalizedTasks);
        setTasks(normalizedTasks);
      } else {
        console.error('Invalid tasks data format:', data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(taskData) {
    try {
      // Normalize userId
      const userId = taskData.userId === "0" || taskData.userId === 0 ? null : 
                    taskData.userId ? Number(taskData.userId) : null;

      const newTask = await taskService.createTask({
        ...taskData,
        userId
      });

      if (newTask) {
        setTasks(prev => [
          {
            ...newTask,
            userId: newTask.userId === 0 ? null : newTask.userId
          },
          ...prev
        ]);
        return newTask;
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  async function updateTask(id, updates) {
    try {
      // Normalize userId if it's being updated
      const updatedData = {
        ...updates
      };

      if ('userId' in updates) {
        updatedData.userId = updates.userId === "0" || updates.userId === 0 ? null :
                            updates.userId ? Number(updates.userId) : null;
      }

      const updatedTask = await taskService.updateTask(id, updatedData);

      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? {
            ...updatedTask,
            userId: updatedTask.userId === 0 ? null : updatedTask.userId
          } : task
        ));
        
        // Refresh tasks if the update might affect visibility
        if ('userId' in updates || 'status' in updates) {
          await fetchTasks();
        }
        
        return updatedTask;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async function completeTask(id, feedback) {
    try {
      const completedTask = await taskService.completeTask(id, feedback);
      
      if (completedTask) {
        // Update tasks list
        setTasks(prev => prev.map(task => 
          task.id === id ? {
            ...completedTask,
            userId: completedTask.userId === 0 ? null : completedTask.userId
          } : task
        ));

        // Create notification for admin
        if (createTaskCompletedNotification) {
          await createTaskCompletedNotification(completedTask);
        }

        // Refresh tasks since completion affects visibility
        await fetchTasks();

        return completedTask;
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  async function deleteTask(id) {
    try {
      const success = await taskService.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  async function forwardTask(taskId, userId) {
    try {
      // Normalize userId
      const normalizedUserId = userId === "0" || userId === 0 ? null :
                              userId ? Number(userId) : null;

      const result = await updateTask(taskId, { userId: normalizedUserId });
      
      // Refresh tasks since forwarding affects visibility
      await fetchTasks();
      
      return result;
    } catch (error) {
      console.error('Error forwarding task:', error);
      throw error;
    }
  }

  async function refreshTasks() {
    await fetchTasks();
  }

  const value = {
    tasks,
    users,
    loading,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    refreshTasks,
    forwardTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 