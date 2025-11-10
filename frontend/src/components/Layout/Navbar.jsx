import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ش</span>
            </div>
            <span className="text-xl font-bold text-gray-800">شحناتي</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
              الرئيسية
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-600 transition">
              المنتجات
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition">
              عن المتجر
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {user ? (
              <>
                {/* ✅ إضافة رابط الإدارة للمدير فقط */}
                {user.role === 'admin' && (
                  <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    لوحة التحكم
                  </Link>
                )}
                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  لوحتي
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  تسجيل خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
                  تسجيل دخول
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
