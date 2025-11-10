import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminStats()
    }
  }, [user])

  const fetchAdminStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats')
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color, link }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>
      {link && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link to={link} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            عرض الكل →
          </Link>
        </div>
      )}
    </div>
  )

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مسموح بالوصول</h1>
          <p className="text-gray-600">ليس لديك صلاحيات للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-l from-purple-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">لوحة التحكم الإدارية</h1>
              <p className="text-purple-100">إدارة المتجر بالكامل من مكان واحد</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 space-x-reverse overflow-x-auto">
            {[
              { id: 'overview', name: 'نظرة عامة', icon: '📊' },
              { id: 'users', name: 'المستخدمين', icon: '👥' },
              { id: 'products', name: 'المنتجات', icon: '🎮' },
              { id: 'orders', name: 'الطلبات', icon: '📦' },
              { id: 'transactions', name: 'المعاملات', icon: '💰' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="ml-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="إجمالي المستخدمين" 
                value={stats.totalUsers || 0} 
                icon="👥" 
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                link="/admin/users"
              />
              <StatCard 
                title="المنتجات" 
                value={stats.totalProducts || 0} 
                icon="🎮" 
                color="bg-gradient-to-r from-green-500 to-green-600"
                link="/admin/products"
              />
              <StatCard 
                title="الطلبات" 
                value={stats.totalOrders || 0} 
                icon="📦" 
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                link="/admin/orders"
              />
              <StatCard 
                title="إجمالي الإيرادات" 
                value={`${stats.totalRevenue || 0} ريال`} 
                icon="💰" 
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </div>

            {/* Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">آخر الطلبات</h2>
                </div>
                <div className="p-6">
                  {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentOrders.map(order => (
                        <div key={order._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-800">{order.product?.name}</p>
                            <p className="text-sm text-gray-600">{order.user?.username}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{order.total_amount} ريال</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد طلبات حديثة
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
                  <div className="space-y-3">
                    <Link to="/admin/products/new" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center">
                      <span className="ml-2">➕</span>
                      إضافة منتج جديد
                    </Link>
                    <Link to="/admin/orders" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center">
                      <span className="ml-2">📦</span>
                      إدارة الطلبات
                    </Link>
                    <Link to="/admin/users" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center">
                      <span className="ml-2">👥</span>
                      إدارة المستخدمين
                    </Link>
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">إجراءات تحتاج الانتباه</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700">طلبات في انتظار المعالجة</span>
                      <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                        {stats.pendingOrders || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">إدارة المستخدمين</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                قائمة المستخدمين ستظهر هنا
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">إدارة المنتجات</h2>
                <Link to="/admin/products/new" className="btn-primary">
                  ➕ إضافة منتج
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                قائمة المنتجات ستظهر هنا
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">إدارة الطلبات</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                قائمة الطلبات ستظهر هنا
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">إدارة المعاملات</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                قائمة المعاملات ستظهر هنا
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
