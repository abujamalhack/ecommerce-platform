const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// إنشاء طلب جديد
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, quantity, game_id, payment_method } = req.body;

    // التحقق من وجود المنتج
    const product = await Product.findById(product_id);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير متوفر'
      });
    }

    // حساب المبلغ الإجمالي
    const total_amount = product.price * quantity;

    // إنشاء الطلب
    const order = new Order({
      user: req.user._id,
      product: product_id,
      quantity,
      total_amount,
      game_id,
      payment_method
    });

    await order.save();
    await order.populate('product');

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});

// الحصول على طلبات المستخدم
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});

// الحصول على طلب محدد
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // التحقق من أن المستخدم هو صاحب الطلب أو مدير
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مسموح بالوصول لهذا الطلب'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});

module.exports = router;
