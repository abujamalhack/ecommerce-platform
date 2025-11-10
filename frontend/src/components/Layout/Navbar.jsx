import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import NotificationService from '../../services/notificationService'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      // جلب الإشعارات أول مرة
      NotificationService.fetchNotifications();
      
      // الاشتراك في تحديثات الإشعارات
      const unsubscribe = NotificationService.subscribe(() => {
        setNotifications([...NotificationService.notifications]);
        setUnreadCount(NotificationService.unreadCount);
      });

      return unsubscribe;
    }
  }, [user])

  const handleMarkAsRead = async (notificationId) => {
    await NotificationService.markAsRead(notificationId);
  }

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    setShowNotifications(false);
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

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ش</span>
            </div>
            <span className="text-xl font-bold text-gray-800">شحناتي</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
              الرئيسية
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition">
              المنتجات
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition">
              عن المتجر
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {user ? (
              <>
                {/* جرس الإشعارات */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition"
                  >
                    <span className="text-xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* قائمة الإشعارات */}
                  {showNotifications && (
                    <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">الإشعارات</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-blue-600 text-sm hover:text-blue-700"
                          >
                            تعيين الكل كمقروء
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 10).map(notification => (
                            <div 
                              key={notification._id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notification.is_read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              <div className="flex items-start space-x-3 space-x-reverse">
                                <span className="text-lg">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 text-sm">
                                    {notification.title}
                                  </h4>
                                  <p className="text-gray-600 text-xs mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-gray-400 text-xs mt-2">
                                    {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <div className="text-4xl mb-2">🔔</div>
                            <p>لا توجد إشعارات</p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-gray-200">
                        <Link 
                          to="/notifications"
                          className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          عرض جميع الإشعارات
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* رابط الإدارة للمدير فقط */}
                {user.role === 'admin' && (
                  <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    لوحة التحكم
                  </Link>
                )}
                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  لوحتي
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  تسجيل خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
                  تسجيل دخول
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
