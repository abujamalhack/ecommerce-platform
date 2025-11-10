const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware الأمان
app.use(helmet());
app.use(cors());
app.use(express.json());

// منع الهجمات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد 100 طلب
});
app.use(limiter);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));

// ✅ إضافة الروتس الجديدة
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/users', require('./routes/users'));

// ✅ إضافة رويتس الإدارة
app.use('/api/admin', require('./routes/admin'));

// ✅ تحديث نموذج المستخدم ليشمل رصيد المحفظة
const User = require('./models/User');

// Route للصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'مرحباً بك في منصة شحن العملات الرقمية! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      wallet: '/api/wallet',
      users: '/api/users',
      admin: '/api/admin'
    }
  });
});

// Route للتحقق من صحة السيرفر
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'السيرفر يعمل بشكل طبيعي ✅',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// معالجة الأخطاء 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'الصفحة غير موجودة'
  });
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error('🔥 خطأ في السيرفر:', err);
  
  res.status(500).json({
    success: false,
    message: 'حدث خطأ داخلي في السيرفر',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على البورت ${PORT}`);
  console.log(`📊 لوحة التحكم: http://localhost:${PORT}`);
  console.log(`👑 لوحة الإدارة: http://localhost:${PORT}/api/admin`);
  console.log(`🔗 البيئة: ${process.env.NODE_ENV || 'development'}`);
});
