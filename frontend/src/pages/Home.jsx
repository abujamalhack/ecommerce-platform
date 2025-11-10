import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const categories = [
    {
      name: 'ألعاب',
      description: 'شحن عملات وعروض جميع الألعاب',
      icon: '🎮',
      count: '150+ منتج'
    },
    {
      name: 'تطبيقات',
      description: 'اشتراكات التطبيقات والخدمات',
      icon: '📱',
      count: '80+ منتج'
    },
    {
      name: 'بطاقات هدايا',
      description: 'رصيد متاجر التطبيقات',
      icon: '🎁',
      count: '50+ منتج'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            شحن عملات الألعاب واشتراكات التطبيقات
          </h1>
          <p className="text-xl mb-8 opacity-90">
            أسرع طريقة لشحن عملات الألعاب وشراء الاشتراكات بأفضل الأسعار
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link 
              to="/products" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              ابدأ التسوق
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              تعرف علينا
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            فئات المنتجات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <span className="text-blue-600 font-semibold">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-3xl text-blue-600 mb-3">⚡</div>
              <h3 className="font-bold text-gray-800 mb-2">شحن فوري</h3>
              <p className="text-gray-600">توصيل فوري خلال ثواني</p>
            </div>
            <div className="p-6">
              <div className="text-3xl text-green-600 mb-3">🔒</div>
              <h3 className="font-bold text-gray-800 mb-2">آمن 100%</h3>
              <p className="text-gray-600">دفع آمن وبيانات محمية</p>
            </div>
            <div className="p-6">
              <div className="text-3xl text-purple-600 mb-3">🎯</div>
              <h3 className="font-bold text-gray-800 mb-2">أسعار تنافسية</h3>
              <p className="text-gray-600">أفضل الأسعار في السوق</p>
            </div>
            <div className="p-6">
              <div className="text-3xl text-orange-600 mb-3">💬</div>
              <h3 className="font-bold text-gray-800 mb-2">دعم فني</h3>
              <p className="text-gray-600">دعم فني متواصل 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
