const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// الحصول على إحصائيات المستخدم
router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // التحقق من أن المستخدم يطلب إحصائياته فقط
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مسموح بالوصول لهذه البيانات'
      });
    }

    const totalOrders = await Order.countDocuments({ user: userId });
    const completedOrders = await Order.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });
    const pendingOrders = await Order.countDocuments({ 
      user: userId, 
      status: 'pending' 
    });

    const totalSpentResult = await Order.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);

    const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalSpent
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});

// تحديث بيانات المستخدم
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, phone, email } = req.body;

    // التحقق من أن البريد الإلكتروني غير مستخدم من قبل مستخدم آخر
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مستخدم من قبل'
        });
      }
    }

    // التحقق من أن اسم المستخدم غير مستخدم من قبل مستخدم آخر
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'اسم المستخدم مستخدم من قبل'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, phone, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث البيانات'
    });
  }
});

// الحصول على بيانات المستخدم
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيانات'
    });
  }
});

module.exports = router;
