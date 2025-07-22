import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Laad notificaties alleen voor admins
  useEffect(() => {
    if (role === 'admin') {
      loadNotifications();
      loadUnreadCount();
    }
  }, [role]);

  // Auto-refresh elke 30 seconden voor admins
  useEffect(() => {
    if (role !== 'admin') return;

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // 30 seconden

    return () => clearInterval(interval);
  }, [role]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      await loadUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      await loadUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const newNotification = await notificationService.addNotification(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      await loadUnreadCount();
      return newNotification;
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const createTaskCompletedNotification = async (task, user) => {
    try {
      const notification = await notificationService.createTaskCompletedNotification(task, user);
      setNotifications(prev => [notification, ...prev]);
      await loadUnreadCount();
      return notification;
    } catch (error) {
      console.error('Error creating task completed notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    createTaskCompletedNotification
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