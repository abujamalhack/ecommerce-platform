import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const Orders = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/orders/my-orders')
      
      if (response.data.success) {
        let filteredOrders = response.data.orders
        
        if (filter !== 'all') {
          filteredOrders = response.data.orders.filter(order => order.status === filter)
        }
        
        setOrders(filteredOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'مكتمل'
      case 'pending': return 'قيد الانتظار'
      case 'processing': return 'قيد المعالجة'
      case 'failed': return 'فاشل'
      default: return status
    }
  }

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{order.product?.name}</h3>
          <p className="text-gray-600 text-sm mt-1">رقم الطلب: {order.order_number}</p>
          <p className="text-gray-600 text-sm">اللعبة: {order.product?.game_name}</p>
          <p className="text-gray-600 text-sm">ID: {order.game_id}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <div className="text-xl font-bold text-blue-600 mt-2">
            {order.total_amount} <span className="text-sm text-gray-500">ريال</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-gray-600 text-sm">
          {new Date(order.createdAt).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div className="flex space-x-2 space-x-reverse">
          {order.status === 'pending' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              متابعة الدفع
            </button>
          )}
          <Link 
            to={`/order/${order._id}`}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            التفاصيل
          </Link>
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
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">طلباتي</h1>
              <p className="text-blue-100">تابع حالة طلباتك وتاريخ المعاملات</p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              قيد الانتظار
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'processing' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              قيد المعالجة
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              مكتمل
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد طلبات</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filter === 'all' 
                  ? 'لم تقم بأي طلبات حتى الآن. ابدأ التسوق لاكتشاف منتجاتنا المميزة!' 
                  : `لا توجد طلبات بحالة "${getStatusText(filter)}"`}
              </p>
              <Link to="/products" className="btn-primary text-lg px-8 py-3">
                متجر المنتجات
              </Link>
            </div>
          )}
        </div>

        {/* Statistics */}
        {orders.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إحصائيات الطلبات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                <div className="text-gray-600">إجمالي الطلبات</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-gray-600">طلبات مكتملة</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
                <div className="text-gray-600">قيد الانتظار</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {orders.reduce((total, order) => total + order.total_amount, 0)}
                </div>
                <div className="text-gray-600">ريال إجمالي الإنفاق</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
