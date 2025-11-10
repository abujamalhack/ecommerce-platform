import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const Wallet = () => {
  const { user } = useContext(AuthContext)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState('')
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/wallet/balance'),
        axios.get('http://localhost:5000/api/wallet/transactions?limit=10')
      ])

      if (balanceRes.data.success) {
        setBalance(balanceRes.data.balance)
      }

      if (transactionsRes.data.success) {
        setTransactions(transactionsRes.data.transactions)
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount < 10) {
      alert('الحد الأدنى للشحن 10 ريال')
      return
    }

    setProcessing(true)

    try {
      const response = await axios.post('http://localhost:5000/api/wallet/deposit', {
        amount: parseFloat(depositAmount),
        payment_method: 'credit_card'
      })

      if (response.data.success) {
        setBalance(response.data.new_balance)
        setDepositAmount('')
        setShowDepositModal(false)
        await fetchWalletData() // تحديث البيانات
        alert('تم شحن الرصيد بنجاح!')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء الشحن')
    } finally {
      setProcessing(false)
    }
  }

  const TransactionItem = ({ transaction }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-800">{transaction.description}</h4>
          <p className="text-gray-600 text-sm">
            {new Date(transaction.createdAt).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${
            transaction.type === 'deposit' || transaction.type === 'refund' || transaction.type === 'bonus' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {transaction.type === 'deposit' || transaction.type === 'refund' || transaction.type === 'bonus' ? '+' : '-'}
            {transaction.amount} ريال
          </span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {transaction.status === 'completed' ? 'مكتمل' :
             transaction.status === 'pending' ? 'قيد الانتظار' : 'فاشل'}
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">المحفظة الإلكترونية</h1>
          <p className="text-blue-100">إدارة رصيدك وإجراء المعاملات المالية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">💳</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">الرصيد المتاح</h2>
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {balance} <span className="text-2xl text-gray-600">ريال</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center"
                >
                  <span className="ml-2">➕</span>
                  شحن الرصيد
                </button>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center">
                  <span className="ml-2">📊</span>
                  كشف الحساب
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">إجمالي الإيداعات</span>
                  <span className="font-bold text-green-600">+{balance} ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">آخر معاملة</span>
                  <span className="font-bold text-blue-600">
                    {transactions[0] ? new Date(transactions[0].createdAt).toLocaleDateString('ar-SA') : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">عدد المعاملات</span>
                  <span className="font-bold text-purple-600">{transactions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">سجل المعاملات</h2>
              </div>
              <div className="p-6">
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map(transaction => (
                      <TransactionItem key={transaction._id} transaction={transaction} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💸</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد معاملات</h3>
                    <p className="text-gray-600">لم تقم بأي معاملات مالية حتى الآن</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">شحن الرصيد</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المبلغ (ريال سعودي)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="أدخل المبلغ..."
                className="input-primary"
                min="10"
                max="5000"
              />
              <p className="text-sm text-gray-500 mt-1">الحد الأدنى: 10 ريال - الحد الأقصى: 5000 ريال</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-2">طرق الدفع المتاحة:</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="payment" defaultChecked className="ml-2" />
                  💳 بطاقة ائتمانية
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payment" className="ml-2" />
                  📱 محفظة إلكترونية
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payment" className="ml-2" />
                  🏦 تحويل بنكي
                </label>
              </div>
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeposit}
                disabled={processing || !depositAmount}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                {processing ? 'جاري المعالجة...' : 'تأكيد الشحن'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallet
