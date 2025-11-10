import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const AdminReports = () => {
  const { user } = useContext(AuthContext)
  const [reports, setReports] = useState({})
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    fetchReports()
  }, [dateRange, reportType])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/admin/reports', {
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
          type: reportType
        }
      })
      
      if (response.data.success) {
        setReports(response.data.reports)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const ReportCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>
    </div>
  )

  const SalesChart = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">مبيعات آخر 7 أيام</h3>
      <div className="flex items-end justify-between h-40 gap-2">
        {reports.salesChart?.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="bg-blue-500 rounded-t w-full max-w-12 transition-all hover:bg-blue-600"
              style={{ height: `${(day.amount / (reports.maxSales || 1)) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2">{day.day}</div>
            <div className="text-xs font-bold">{day.amount} ريال</div>
          </div>
        ))}
      </div>
    </div>
  )

  const TopProducts = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">المنتجات الأكثر مبيعاً</h3>
      <div className="space-y-3">
        {reports.topProducts?.map((product, index) => (
          <div key={product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold ml-2">
                {index + 1}
              </span>
              <span>{product.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">{product.sales} مبيعات</div>
              <div className="text-sm text-gray-600">{product.revenue} ريال</div>
            </div>
          </div>
        ))}
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
        <div className="bg-gradient-to-l from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">التقارير والإحصائيات 📊</h1>
              <p className="text-indigo-100">تحليلات شاملة لأداء المتجر وإحصائيات المبيعات</p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="input-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع التقرير</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input-primary"
              >
                <option value="overview">نظرة عامة</option>
                <option value="sales">المبيعات</option>
                <option value="users">المستخدمين</option>
                <option value="products">المنتجات</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ReportCard 
            title="إجمالي المبيعات" 
            value={`${reports.totalSales || 0} ريال`} 
            change={reports.salesGrowth}
            icon="💰" 
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <ReportCard 
            title="عدد الطلبات" 
            value={reports.totalOrders || 0} 
            change={reports.ordersGrowth}
            icon="📦" 
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <ReportCard 
            title="عملاء جدد" 
            value={reports.newUsers || 0} 
            change={reports.usersGrowth}
            icon="👥" 
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <ReportCard 
            title="متوسط قيمة الطلب" 
            value={`${reports.avgOrderValue || 0} ريال`} 
            change={reports.avgOrderGrowth}
            icon="📊" 
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesChart />
          <TopProducts />
        </div>

        {/* Detailed Reports */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">آخر النشاطات</h3>
            <div className="space-y-3">
              {reports.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                    {activity.type === 'order' ? '📦' : '👤'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{activity.message}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">مقاييس الأداء</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">معدل التحويل</span>
                  <span className="text-sm font-bold text-blue-600">{reports.conversionRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${reports.conversionRate || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">رضا العملاء</span>
                  <span className="text-sm font-bold text-green-600">{reports.customerSatisfaction || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${reports.customerSatisfaction || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">نسبة الإكمال</span>
                  <span className="text-sm font-bold text-purple-600">{reports.completionRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${reports.completionRate || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تصدير التقارير</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center">
              <span className="ml-2">📥</span>
              تصدير كـ Excel
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center">
              <span className="ml-2">📥</span>
              تصدير كـ PDF
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
              <span className="ml-2">📧</span>
              إرسال بالبريد
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReports
