const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// الحصول على جميع المنتجات
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    let filter = { status: 'active' };
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { game_name: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

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
      message: 'خطأ في السيرفر'
    });
  }
});

// الحصول على منتج بواسطة ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});

// إضافة منتج جديد (للمدير فقط)
router.post('/', auth, adminAuth, async (req, res) => {
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
      message: 'خطأ في السيرفر'
    });
  }
});

module.exports = router;
