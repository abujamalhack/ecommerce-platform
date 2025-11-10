import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  const features = [
    {
      icon: '⚡',
      title: 'شحن فوري',
      description: 'توصيل فوري خلال ثواني من تأكيد الطلب'
    },
    {
      icon: '🔒',
      title: 'آمن 100%',
      description: 'بياناتك محمية بأحدث تقنيات التشفير'
    },
    {
      icon: '💎',
      title: 'أسعار تنافسية',
      description: 'أفضل الأسعار في السوق مع عروض مستمرة'
    },
    {
      icon: '🎮',
      title: 'جميع الألعاب',
      description: 'دعم لأشهر الألعاب والتطبيقات العالمية'
    },
    {
      icon: '💬',
      title: 'دعم فني',
      description: 'فريق دعم متاح 24/7 لمساعدتك'
    },
    {
      icon: '🔄',
      title: 'ضمان الاسترجاع',
      description: 'ضمان استرجاع الأموال في حال وجود مشكلة'
    }
  ]

  const team = [
    {
      name: 'أحمد محمد',
      role: 'المؤسس والرئيس التنفيذي',
      image: '👨‍💼'
    },
    {
      name: 'فاطمة أحمد',
      role: 'مديرة الدعم الفني',
      image: '👩‍💻'
    },
    {
      name: 'خالد عبدالله',
      role: 'مطور المنصة',
      image: '👨‍💻'
    },
    {
      name: 'سارة علي',
      role: 'مسؤولة التسويق',
      image: '👩‍🎨'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">منصة شحناتي 🚀</h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            منصة رائدة في شحن العملات الرقمية واشتراكات التطبيقات، 
            نقدم خدمات سريعة وآمنة منذ عام 2020
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link 
              to="/products" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              ابدأ التسوق
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">قصتنا 📖</h2>
              <p className="text-gray-600 text-lg mb-6">
                بدأنا رحلتنا في عام 2020 بمهمة واضحة: جعل شحن العملات الرقمية 
                وشراء الاشتراكات تجربة سلسة وآمنة للجميع.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                اليوم، نحن نفتخر بخدمة آلاف العملاء الراضين وتقديم أفضل الخدمات 
                بأعلى معايير الجودة والأمان.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50,000+</div>
                  <div className="text-gray-600">عميل راضي</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">200,000+</div>
                  <div className="text-gray-600">طلب مكتمل</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-gray-600">دعم فني</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">99.9%</div>
                  <div className="text-gray-600">رضا العملاء</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">رؤيتنا</h3>
              <p className="text-gray-600">
                أن نكون المنصة الأولى في الشرق الأوسط لشحن العملات الرقمية 
                واشتراكات التطبيقات، مع الحفاظ على أعلى معايير الجودة والأمان.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">لماذا تختار شحناتي؟ ✨</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">فريقنا 👥</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{member.image}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-l from-green-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟ 🚀</h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف العملاء الراضين وابدأ رحلتك معنا اليوم
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              إنشاء حساب
            </Link>
            <Link 
              to="/products" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
