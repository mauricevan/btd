// Mock data voor notificaties
let notifications = [
  {
    id: 1,
    type: 'task_completed',
    title: 'Taak afgerond',
    message: 'Jan Jansen heeft de taak "Website onderhoud" als afgerond gemarkeerd',
    taskId: 1,
    userId: 2,
    userName: 'Jan Jansen',
    taskTitle: 'Website onderhoud',
    isRead: false,
    createdAt: new Date().toISOString(),
    priority: 'medium'
  },
  {
    id: 2,
    type: 'task_completed',
    title: 'Taak afgerond',
    message: 'Piet Pietersen heeft de taak "Database backup" als afgerond gemarkeerd',
    taskId: 3,
    userId: 3,
    userName: 'Piet Pietersen',
    taskTitle: 'Database backup',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dag geleden
    priority: 'medium'
  }
];

// Simuleer API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  // Haal alle notificaties op
  async getNotifications() {
    await delay(200);
    return [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Haal ongelezen notificaties op
  async getUnreadNotifications() {
    await delay(200);
    return notifications.filter(n => !n.isRead);
  },

  // Markeer notificatie als gelezen
  async markAsRead(id) {
    await delay(100);
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return notification;
  },

  // Markeer alle notificaties als gelezen
  async markAllAsRead() {
    await delay(100);
    notifications.forEach(n => n.isRead = true);
    return true;
  },

  // Voeg nieuwe notificatie toe
  async addNotification(notificationData) {
    await delay(200);
    const newNotification = {
      id: Math.max(...notifications.map(n => n.id)) + 1,
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNotification); // Voeg toe aan begin van array
    return newNotification;
  },

  // Verwijder notificatie
  async deleteNotification(id) {
    await delay(100);
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
      return true;
    }
    return false;
  },

  // Verwijder alle notificaties
  async clearAllNotifications() {
    await delay(100);
    notifications = [];
    return true;
  },

  // Tel ongelezen notificaties
  async getUnreadCount() {
    await delay(50);
    return notifications.filter(n => !n.isRead).length;
  },

  // Maak taak voltooid notificatie
  async createTaskCompletedNotification(task, user) {
    const notificationData = {
      type: 'task_completed',
      title: 'Taak afgerond',
      message: `${user.name} heeft de taak "${task.title}" als afgerond gemarkeerd`,
      taskId: task.id,
      userId: user.id,
      userName: user.name,
      taskTitle: task.title,
      priority: 'medium'
    };
    
    return await this.addNotification(notificationData);
  }
}; 