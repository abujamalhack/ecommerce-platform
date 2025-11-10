hereconst jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'الوصول مرفوض. لا يوجد token' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token غير صالح' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'الحساب معطل' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token غير صالح' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'الوصول مرفوض. تحتاج صلاحيات مدير' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'خطأ في السيرفر' 
    });
  }
};

const moderatorAuth = async (req, res, next) => {
  try {
    if (!['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'الوصول مرفوض. تحتاج صلاحيات مشرف أو مدير' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'خطأ في السيرفر' 
    });
  }
};

module.exports = { auth, adminAuth, moderatorAuth };
