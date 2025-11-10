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
              
              {/* صفحات إضافية */}
              <Route path="/about" element={
                <div className="min-h-screen bg-white py-12">
                  <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">عن المتجر</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      منصة متخصصة في شحن العملات الرقمية للألعاب واشتراكات التطبيقات. 
                      نقدم خدمات سريعة وآمنة مع أفضل الأسعار في السوق.
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
