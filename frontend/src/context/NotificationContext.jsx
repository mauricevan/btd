import React, { createContext, useContext, useState, useEffect } from "react";
import { notificationService } from "../services/notifications";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { id: currentUserId, role } = useAuth() || {};
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [currentUserId]);

  async function fetchNotifications() {
    try {
      setLoading(true);
      let data;
      
      if (role === 'admin') {
        data = await notificationService.getNotifications();
      } else {
        data = await notificationService.getMyNotifications();
      }
      
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUnreadCount() {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }

  async function markAsRead(id) {
    try {
      const updatedNotification = await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? updatedNotification : notification
      ));
      await fetchUnreadCount();
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async function markAllAsRead() {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async function deleteNotification(id) {
    try {
      const success = await notificationService.deleteNotification(id);
      if (success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        await fetchUnreadCount();
      }
      return success;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async function createNotification(notificationData) {
    try {
      const newNotification = await notificationService.createNotification(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      await fetchUnreadCount();
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async function createTaskCompletedNotification(task) {
    try {
      const notificationData = {
        userId: task.userId,
        type: 'task_completed',
        title: 'Taak voltooid',
        message: `Taak "${task.title}" is voltooid door ${task.user?.name || 'gebruiker'}`
      };
      
      return await createNotification(notificationData);
    } catch (error) {
      console.error('Error creating task completed notification:', error);
    }
  }

  async function refreshNotifications() {
    await fetchNotifications();
    await fetchUnreadCount();
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    createTaskCompletedNotification,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 