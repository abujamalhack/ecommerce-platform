import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/my-orders'),
        axios.get(`http://localhost:5000/api/users/stats/${user.id}`)
      ])

      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders.slice(0, 5))
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }) => (
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
    </div>
  )

  const OrderItem = ({ order }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-800">{order.product?.name}</h4>
          <p className="text-gray-600 text-sm">رقم الطلب: {order.order_number}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {order.status === 'completed' ? 'مكتمل' :
           order.status === 'pending' ? 'قيد الانتظار' : 'قيد المعالجة'}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600 text-sm">
          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
        </div>
        <div className="text-lg font-bold text-blue-600">
          {order.total_amount} <span className="text-sm text-gray-500">ريال</span>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="bg-gradient-to-l from-blue-600 to-purple-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">مرحباً بعودتك، {user?.username}! 👋</h1>
              <p className="text-blue-100 text-lg">هنا يمكنك متابعة طلباتك وإدارة حسابك</p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="الرصيد المتاح" 
            value={`${user?.wallet_balance || 0} ريال`} 
            icon="💳" 
            color="bg-gradient-to-r from-green-500 to-green-600" 
          />
          <StatCard 
            title="الطلبات الكلية" 
            value={stats.totalOrders || 0} 
            icon="📦" 
            color="bg-gradient-to-r from-blue-500 to-blue-600" 
          />
          <StatCard 
            title="طلبات مكتملة" 
            value={stats.completedOrders || 0} 
            icon="✅" 
            color="bg-gradient-to-r from-green-500 to-green-600" 
          />
          <StatCard 
            title="المبلغ المنفق" 
            value={`${stats.totalSpent || 0} ريال`} 
            icon="💰" 
            color="bg-gradient-to-r from-purple-500 to-purple-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">آخر الطلبات</h2>
                <Link to="/orders" className="text-blue-600 hover:text-blue-700 font-medium">
                  عرض الكل
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <OrderItem key={order._id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد طلبات بعد</h3>
                    <p className="text-gray-600 mb-4">ابدأ التسوق لاكتشاف منتجاتنا المميزة</p>
                    <Link to="/products" className="btn-primary">
                      متجر المنتجات
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Link to="/products" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center">
                  <span className="ml-2">🛒</span>
                  متجر المنتجات
                </Link>
                <Link to="/wallet" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center">
                  <span className="ml-2">💳</span>
                  شحن المحفظة
                </Link>
                <Link to="/profile" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center">
                  <span className="ml-2">👤</span>
                  الملف الشخصي
                </Link>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-l from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center ml-4">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">الدعم الفني</h3>
                  <p className="text-orange-100 text-sm">
                    نحن هنا لمساعدتك على مدار الساعة
                  </p>
                </div>
              </div>
              <button className="w-full bg-white text-orange-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                تواصل مع الدعم
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
