import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const AdminOrders = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [currentPage, selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        params: {
          page: currentPage,
          limit: 10,
          status: selectedStatus
        }
      })
      
      if (response.data.success) {
        setOrders(response.data.orders)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, {
        status: newStatus
      })
      if (response.data.success) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order:', error)
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
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{order.product?.name}</h3>
          <p className="text-gray-600 text-sm">اللاعب: {order.user?.username}</p>
          <p className="text-gray-600 text-sm">البريد: {order.user?.email}</p>
          <p className="text-gray-600 text-sm">ID اللعبة: {order.game_id}</p>
          <p className="text-gray-600 text-sm">رقم الطلب: {order.order_number}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
            <select 
              value={order.status} 
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="completed">مكتمل</option>
              <option value="failed">فاشل</option>
            </select>
          </div>
          <div className="text-xl font-bold text-blue-600">
            {order.total_amount} <span className="text-sm text-gray-500">ريال</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
      
      {order.delivery_data && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-800 text-sm">
            <strong>بيانات التسليم:</strong> {order.delivery_data}
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          طريقة الدفع: <span className="font-bold">{order.payment_method || 'غير محدد'}</span>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            تفاصيل
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-l from-orange-600 to-red-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة الطلبات 📦</h1>
              <p className="text-orange-100">متابعة وإدارة جميع طلبات المستخدمين</p>
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
              onClick={() => setSelectedStatus('')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedStatus === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              قيد الانتظار
            </button>
            <button
              onClick={() => setSelectedStatus('processing')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedStatus === 'processing' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              قيد المعالجة
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedStatus === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              مكتمل
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2 space-x-reverse">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
