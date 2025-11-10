const express = require('express');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const router = express.Router();

// الحصول على إشعارات المستخدم
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;

    let filter = { user: req.user._id };
    if (unread_only === 'true') {
      filter.is_read = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      user: req.user._id, 
      is_read: false 
    });

    res.json({
      success: true,
      notifications,
      unread_count: unreadCount,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإشعارات'
    });
  }
});

// تعيين إشعار كمقروء
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'الإشعار غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تعيين الإشعار كمقروء',
      notification
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الإشعار'
    });
  }
});

// تعيين جميع الإشعارات كمقروءة
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, is_read: false },
      { is_read: true }
    );

    res.json({
      success: true,
      message: 'تم تعيين جميع الإشعارات كمقروءة'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الإشعارات'
    });
  }
});

// حذف إشعار
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'الإشعار غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الإشعار بنجاح'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الإشعار'
    });
  }
});

// خدمة إنشاء إشعار (للاستخدام الداخلي)
const createNotification = async (userId, title, message, type = 'info', relatedData = {}) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      ...relatedData
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = { router, createNotification };
