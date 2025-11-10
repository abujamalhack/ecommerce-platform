const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// جميع الروتس هنا تتطلب صلاحيات مدير
router.use(auth);
router.use(adminAuth);

// 📊 الإحصائيات العامة
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      pendingOrders
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user product'),
      Order.countDocuments({ status: 'pending' })
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenue,
        pendingOrders,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإحصائيات'
    });
  }
});

// 👥 إدارة المستخدمين
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const filter = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين'
    });
  }
});

// 🎮 إدارة المنتجات
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, category = '' } = req.query;

    const filter = category ? { category } : {};

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات'
    });
  }
});

// ➕ إضافة منتج جديد
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'تم إضافة المنتج بنجاح',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المنتج'
    });
  }
});

// ✏️ تحديث منتج
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث المنتج بنجاح',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المنتج'
    });
  }
});

// 🗑️ حذف منتج
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المنتج بنجاح'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المنتج'
    });
  }
});

// 📦 إدارة الطلبات
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .populate('user', 'username email')
      .populate('product')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
});

// ✏️ تحديث حالة الطلب
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, delivery_data } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, delivery_data },
      { new: true }
    ).populate('user product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الطلب'
    });
  }
});

// 💰 إدارة المعاملات
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 10, type = '' } = req.query;

    const filter = type ? { type } : {};

    const transactions = await Transaction.find(filter)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المعاملات'
    });
  }
});

// 🔄 تحديث حالة المعاملة
router.put('/transactions/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'المعاملة غير موجودة'
      });
    }

    // إذا كانت معاملة سحب وتم الموافقة عليها، خصم المبلغ من المحفظة
    if (status === 'completed' && transaction.type === 'withdrawal') {
      const Wallet = require('../models/Wallet');
      const wallet = await Wallet.findOne({ user: transaction.user });
      if (wallet) {
        await wallet.updateBalance(transaction.amount, 'withdraw');
      }
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة المعاملة بنجاح',
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المعاملة'
    });
  }
});

module.exports = router;
