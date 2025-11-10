import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const AdminCoupons = () => {
  const { user } = useContext(AuthContext)
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_amount: '',
    maximum_discount: '',
    usage_limit: '',
    valid_until: '',
    applicable_categories: ['all']
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/coupons')
      if (response.data.success) {
        setCoupons(response.data.coupons)
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/coupons', newCoupon)
      if (response.data.success) {
        setShowCreateModal(false)
        setNewCoupon({
          code: '',
          description: '',
          discount_type: 'percentage',
          discount_value: '',
          minimum_amount: '',
          maximum_discount: '',
          usage_limit: '',
          valid_until: '',
          applicable_categories: ['all']
        })
        fetchCoupons()
      }
    } catch (error) {
      console.error('Error creating coupon:', error)
      alert(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الكوبون')
    }
  }

  const getStatus = (coupon) => {
    const now = new Date()
    const validUntil = new Date(coupon.valid_until)
    
    if (!coupon.is_active) return { text: 'غير نشط', color: 'bg-red-100 text-red-800' }
    if (coupon.used_count >= coupon.usage_limit) return { text: 'منتهي', color: 'bg-red-100 text-red-800' }
    if (validUntil < now) return { text: 'منتهي', color: 'bg-red-100 text-red-800' }
    if (validUntil > now) return { text: 'نشط', color: 'bg-green-100 text-green-800' }
    return { text: 'غير معروف', color: 'bg-gray-100 text-gray-800' }
  }

  const CouponCard = ({ coupon }) => {
    const status = getStatus(coupon)
    
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-800">{coupon.code}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{coupon.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                الخصم: {coupon.discount_value}
                {coupon.discount_type === 'percentage' ? '%' : ' ريال'}
              </span>
              {coupon.minimum_amount > 0 && (
                <span>الحد الأدنى: {coupon.minimum_amount} ريال</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {coupon.used_count} / {coupon.usage_limit}
            </div>
            <div className="text-sm text-gray-500">مستخدم / الحد الأقصى</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            الصلاحية: {new Date(coupon.valid_until).toLocaleDateString('ar-SA')}
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              تعديل
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">
              حذف
            </button>
          </div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-l from-pink-600 to-red-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة أكواد الخصم 🎫</h1>
              <p className="text-pink-100">أنشئ وادر أكواد الخصم والعروض الترويجية</p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">أكواد الخصم</h2>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              ➕ إنشاء كود خصم
            </button>
          </div>
        </div>

        {/* Coupons List */}
        <div className="space-y-6">
          {coupons.map(coupon => (
            <CouponCard key={coupon._id} coupon={coupon} />
          ))}

          {coupons.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="text-6xl mb-6">🎫</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد أكواد خصم</h3>
              <p className="text-gray-600 mb-8">ابدأ بإنشاء أول كود خصم لجذب المزيد من العملاء</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                إنشاء أول كود خصم
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إنشاء كود خصم جديد</h3>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">كود الخصم *</label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="input-primary"
                    required
                    placeholder="مثال: WELCOME10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وصف الكوبون *</label>
                  <input
                    type="text"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                    className="input-primary"
                    required
                    placeholder="مثال: خصم ترحيبي للعملاء الجدد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم *</label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={(e) => setNewCoupon({...newCoupon, discount_type: e.target.value})}
                    className="input-primary"
                    required
                  >
                    <option value="percentage">نسبة مئوية %</option>
                    <option value="fixed">مبلغ ثابت</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قيمة الخصم * {newCoupon.discount_type === 'percentage' ? '(%)' : '(ريال)'}
                  </label>
                  <input
                    type="number"
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({...newCoupon, discount_value: e.target.value})}
                    className="input-primary"
                    required
                    min="1"
                    max={newCoupon.discount_type === 'percentage' ? '100' : '1000'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأدنى للطلب (ريال)</label>
                  <input
                    type="number"
                    value={newCoupon.minimum_amount}
                    onChange={(e) => setNewCoupon({...newCoupon, minimum_amount: e.target.value})}
                    className="input-primary"
                    min="0"
                    placeholder="0 - بدون حد أدنى"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للخصم (ريال)</label>
                  <input
                    type="number"
                    value={newCoupon.maximum_discount}
                    onChange={(e) => setNewCoupon({...newCoupon, maximum_discount: e.target.value})}
                    className="input-primary"
                    min="0"
                    placeholder="للخصم النسبي فقط"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عدد مرات الاستخدام *</label>
                  <input
                    type="number"
                    value={newCoupon.usage_limit}
                    onChange={(e) => setNewCoupon({...newCoupon, usage_limit: e.target.value})}
                    className="input-primary"
                    required
                    min="1"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">صلاحية حتى *</label>
                  <input
                    type="datetime-local"
                    value={newCoupon.valid_until}
                    onChange={(e) => setNewCoupon({...newCoupon, valid_until: e.target.value})}
                    className="input-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  إنشاء الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoupons
