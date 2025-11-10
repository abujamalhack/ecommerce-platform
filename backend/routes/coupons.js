const express = require('express');
const Coupon = require('../models/Coupon');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// التحقق من صحة الكوبون
router.post('/validate', auth, async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'كود الخصم غير صحيح'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'كود الخصم منتهي الصلاحية أو غير نشط'
      });
    }

    const discountResult = coupon.applyDiscount(amount);

    res.json({
      success: true,
      message: 'كود الخصم صالح',
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount: discountResult.discount,
        final_amount: discountResult.final_amount
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// إنشاء كوبون جديد (للمدير فقط)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const coupon = new Coupon({
      ...req.body,
      created_by: req.user._id
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'تم إنشاء كود الخصم بنجاح',
      coupon
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'كود الخصم موجود مسبقاً'
      });
    }
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء كود الخصم'
    });
  }
});

// الحصول على جميع الكوبونات (للمدير فقط)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('created_by', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      coupons
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب أكواد الخصم'
    });
  }
});

// تحديث كوبون
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'كود الخصم غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث كود الخصم بنجاح',
      coupon
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث كود الخصم'
    });
  }
});

// حذف كوبون
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'كود الخصم غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف كود الخصم بنجاح'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف كود الخصم'
    });
  }
});

module.exports = router;
