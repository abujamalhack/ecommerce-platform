import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Products from './pages/Products'
import Dashboard from './pages/user/Dashboard'

// ✅ إضافة المسارات الجديدة
import Wallet from './pages/user/Wallet'
import Orders from './pages/user/Orders'

// ✅ إضافة مسارات الإدارة
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminCoupons from './pages/admin/Coupons'

// ✅ أضف الاستيراد
import AdminReports from './pages/admin/Reports'

// ✅ في ملف App.jsx، أضف هذا الاستيراد:
import Notifications from './pages/Notifications'

// ✅ استبدل صفحة About الحالية بالاستيراد الجديد
import About from './pages/About'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* الصفحات الرئيسية */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              
              {/* ✅ إضافة في الـ Routes */}
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/orders" element={<Orders />} />
              
              {/* صفحات المستخدم */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* ✅ صفحات الإدارة */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              
              {/* ✅ أضف في الـ Routes */}
              <Route path="/admin/reports" element={<AdminReports />} />
              
              {/* ✅ وفي الـ Routes، أضف: */}
              <Route path="/notifications" element={<Notifications />} />
              
              {/* ✅ استبدل صفحة About */}
              <Route path="/about" element={<About />} />
              
              {/* صفحات إضافية */}
              <Route path="/contact" element={
                <div className="min-h-screen bg-white py-12">
                  <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">اتصل بنا</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      نحن هنا لمساعدتك! تواصل معنا عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي.
                    </p>
                  </div>
                </div>
              } />
              
              {/* صفحة 404 */}
              <Route path="*" element={
                <div className="min-h-screen bg-white flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-6">الصفحة غير موجودة</p>
                    <a href="/" className="btn-primary">
                      العودة للرئيسية
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
