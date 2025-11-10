const express = require('express');
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
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث البيانات'
    });
  }
});

module.exports = router;
