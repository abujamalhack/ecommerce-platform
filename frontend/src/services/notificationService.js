import axios from 'axios';

class NotificationService {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.listeners = [];
  }

  // الاشتراك في تحديثات الإشعارات
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // إشعار جميع المتابعين
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // جلب الإشعارات
  async fetchNotifications() {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications');
      if (response.data.success) {
        this.notifications = response.data.notifications;
        this.unreadCount = response.data.unread_count;
        this.notifyListeners();
        return this.notifications;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
    return [];
  }

  // تعيين إشعار كمقروء
  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        await this.fetchNotifications(); // تحديث القائمة
        return true;
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    return false;
  }

  // تعيين الكل كمقروء
  async markAllAsRead() {
    try {
      const response = await axios.put('http://localhost:5000/api/notifications/read-all');
      if (response.data.success) {
        await this.fetchNotifications();
        return true;
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
    return false;
  }

  // حذف إشعار
  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`);
      if (response.data.success) {
        await this.fetchNotifications();
        return true;
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
    return false;
  }

  // إضافة إشعار محلي (للتنبيهات الفورية)
  addLocalNotification(title, message, type = 'info') {
    const notification = {
      _id: 'local_' + Date.now(),
      title,
      message,
      type,
      is_read: false,
      createdAt: new Date(),
      isLocal: true
    };

    this.notifications.unshift(notification);
    this.unreadCount++;
    this.notifyListeners();

    // حذف تلقائي بعد 5 ثواني (للإشعارات المحلية فقط)
    if (type === 'info') {
      setTimeout(() => {
        this.removeLocalNotification(notification._id);
      }, 5000);
    }
  }

  // إزالة إشعار محلي
  removeLocalNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n._id !== notificationId);
    this.unreadCount = this.notifications.filter(n => !n.is_read).length;
    this.notifyListeners();
  }
}

export default new NotificationService();
