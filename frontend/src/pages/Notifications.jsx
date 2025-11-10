import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import NotificationService from '../services/notificationService'

const Notifications = () => {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) {
      loadNotifications()
      
      // الاشتراك في تحديثات الإشعارات
      const unsubscribe = NotificationService.subscribe(() => {
        setNotifications([...NotificationService.notifications])
      })

      return unsubscribe
    }
  }, [user])

  const loadNotifications = async () => {
    setLoading(true)
    await NotificationService.fetchNotifications()
    setLoading(false)
  }

  const handleMarkAsRead = async (notificationId) => {
    await NotificationService.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead()
  }

  const handleDeleteNotification = async (notificationId) => {
    await NotificationService.deleteNotification(notificationId)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'order': return '📦';
      case 'payment': return '💳';
      default: return 'ℹ️';
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'success': return 'نجاح';
      case 'warning': return 'تحذير';
      case 'error': return 'خطأ';
      case 'order': return 'طلب';
      case 'payment': return 'دفع';
      default: return 'معلومة';
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.is_read
    return notification.type === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">الإشعارات 🔔</h1>
              <p className="text-blue-100">تابع آخر التحديثات والأنشطة في حسابك</p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'unread' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                غير المقروء
              </button>
              <button
                onClick={() => setFilter('order')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'order' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                الطلبات
              </button>
              <button
                onClick={() => setFilter('payment')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'payment' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                المدفوعات
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                تعيين الكل كمقروء
              </button>
              <button
                onClick={loadNotifications}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                تحديث
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                  !notification.is_read 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 space-x-reverse flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      notification.type === 'success' ? 'bg-green-100 text-green-600' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'error' ? 'bg-red-100 text-red-600' :
                      notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'payment' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.type === 'success' ? 'bg-green-100 text-green-800' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          notification.type === 'error' ? 'bg-red-100 text-red-800' :
                          notification.type === 'order' ? 'bg-blue-100 text-blue-800' :
                          notification.type === 'payment' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getTypeText(notification.type)}
                        </span>
                        {!notification.is_read && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            جديد
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {new Date(notification.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        تعيين كمقروء
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="text-6xl mb-6">🔔</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد إشعارات</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'لم تتلق أي إشعارات حتى الآن.' 
                  : `لا توجد إشعارات في فئة "${filter}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
