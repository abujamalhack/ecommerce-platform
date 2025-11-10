const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// إعدادات CORS آمنة
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// منع الهجمات بمعدل محدود
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// تطبيقات الأمان
const securityMiddleware = (app) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // CORS
  app.use(cors(corsOptions));

  // Rate limiting for different routes
  app.use('/api/auth', createRateLimit(15 * 60 * 1000, 5, 'محاولات تسجيل دخول كثيرة، يرجى المحاولة لاحقاً'));
  app.use('/api/orders', createRateLimit(15 * 60 * 1000, 20, 'طلبات كثيرة، يرجى المحاولة لاحقاً'));
  app.use('/api/payments', createRateLimit(15 * 60 * 1000, 10, 'محاولات دفع كثيرة، يرجى المحاولة لاحقاً'));
  app.use(createRateLimit(15 * 60 * 1000, 100, 'طلبات كثيرة، يرجى المحاولة لاحقاً'));

  // Data sanitization
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
};

module.exports = securityMiddleware;
