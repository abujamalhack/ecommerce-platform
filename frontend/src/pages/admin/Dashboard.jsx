import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

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
    <Link to={link} className="block">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
        </div>
      </div>
    </Link>
  )

  const RecentOrderItem = ({ order }) => (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-white hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800">{order.product?.name}</h4>
          <p className="text-gray-600 text-sm">{order.user?.username}</p>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {order.status === 'completed' ? 'مكتمل' :
             order.status === 'pending' ? 'قيد الانتظار' : 'قيد المعالجة'}
          </span>
          <div className="text-lg font-bold text-blue-600 mt-1">
            {order.total_amount} <span className="text-sm text-gray-500">ريال</span>
          </div>
        </div>
      </div>
    </div>
  )

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
              <h1 className="text-3xl font-bold mb-2">لوحة التحكم الإدارية 👑</h1>
              <p className="text-purple-100">مرحباً بك، {user?.username}! هنا يمكنك إدارة المنصة بالكامل</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="إجمالي المستخدمين" 
            value={stats.totalUsers} 
            icon="👥" 
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            link="/admin/users"
          />
          <StatCard 
            title="المنتجات" 
            value={stats.totalProducts} 
            icon="🎮" 
            color="bg-gradient-to-r from-green-500 to-green-600"
            link="/admin/products"
          />
          <StatCard 
            title="الطلبات" 
            value={stats.totalOrders} 
            icon="📦" 
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            link="/admin/orders"
          />
          <StatCard 
            title="إجمالي الإيرادات" 
            value={`${stats.totalRevenue} ريال`} 
            icon="💰" 
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            link="/admin/orders"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">آخر الطلبات</h2>
              <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium">
                عرض الكل
              </Link>
            </div>
            <div className="p-6 space-y-4">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(order => (
                  <RecentOrderItem key={order._id} order={order} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  لا توجد طلبات حديثة
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/admin/products/new" className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center">
                  <span className="ml-2">➕</span>
                  إضافة منتج جديد
                </Link>
                <Link to="/admin/users" className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center">
                  <span className="ml-2">👥</span>
                  إدارة المستخدمين
                </Link>
                <Link to="/admin/orders" className="bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center">
                  <span className="ml-2">📦</span>
                  متابعة الطلبات
                </Link>
                {/* ✅ الزر المضاف */}
                <Link to="/admin/reports" className="bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center">
                  <span className="ml-2">📊</span>
                  التقارير والإحصائيات
                </Link>
                <Link to="/admin/coupons" className="bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center">
                  <span className="ml-2">🎫</span>
                  إدارة الكوبونات
                </Link>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">إجراءات تحتاج انتباه</h3>
              <div className="space-y-3">
                {stats.pendingOrders > 0 && (
                  <Link to="/admin/orders?status=pending" className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                    <div className="flex items-center">
                      <span className="text-yellow-600 ml-2">⚠️</span>
                      <span>طلبات في انتظار المعالجة</span>
                    </div>
                    <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm">
                      {stats.pendingOrders}
                    </span>
                  </Link>
                )}
                <Link to="/admin/transactions?status=pending" className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <div className="flex items-center">
                    <span className="text-blue-600 ml-2">💸</span>
                    <span>طلبات سحب رصيد</span>
                  </div>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                    0
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
