const express = require('express');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const router = express.Router();

// الحصول على رصيد المحفظة
router.get('/balance', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      wallet = new Wallet({ user: req.user._id });
      await wallet.save();
    }

    res.json({
      success: true,
      balance: wallet.balance,
      total_deposited: wallet.total_deposited,
      total_withdrawn: wallet.total_withdrawn,
      currency: wallet.currency
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});

// شحن الرصيد
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, payment_method } = req.body;

    if (amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'الحد الأدنى للشحن 10 ريال'
      });
    }

    if (amount > 5000) {
      return res.status(400).json({
        success: false,
        message: 'الحد الأقصى للشحن 5000 ريال'
      });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user._id });
    }

    const balance_before = wallet.balance;

    // محاكاة عملية الدفع
    const paymentResult = await simulatePayment(amount, payment_method);

    if (paymentResult.success) {
      // تحديث الرصيد
      const newBalance = await wallet.updateBalance(amount, 'deposit');

      // تسجيل المعاملة
      const transaction = new Transaction({
        user: req.user._id,
        type: 'deposit',
        amount: amount,
        balance_before: balance_before,
        balance_after: newBalance,
        description: `شحن رصيد بمبلغ ${amount} ريال عبر ${payment_method}`,
        status: 'completed',
        reference_id: paymentResult.transaction_id,
        payment_method: payment_method
      });

      await transaction.save();

      // تحديث رصيد المستخدم في context المصادقة
      req.user.wallet_balance = newBalance;

      res.json({
        success: true,
        message: 'تم شحن الرصيد بنجاح',
        new_balance: newBalance,
        transaction: transaction
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.message
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في عملية الشحن: ' + error.message
    });
  }
});

// سحب الرصيد
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, bank_details } = req.body;

    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'الرصيد غير كافي'
      });
    }

    if (amount < 50) {
      return res.status(400).json({
        success: false,
        message: 'الحد الأدنى للسحب 50 ريال'
      });
    }

    const balance_before = wallet.balance;

    // تسجيل طلب السحب
    const transaction = new Transaction({
      user: req.user._id,
      type: 'withdrawal',
      amount: amount,
      balance_before: balance_before,
      balance_after: balance_before - amount,
      description: `طلب سحب رصيد بمبلغ ${amount} ريال`,
      status: 'pending', // يحتاج موافقة إدارية
      payment_method: 'bank_transfer',
      metadata: { bank_details }
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'تم تقديم طلب السحب بنجاح وسيتم معالجته خلال 24 ساعة',
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في عملية السحب: ' + error.message
    });
  }
});

// الحصول على سجل المعاملات
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;

    let filter = { user: req.user._id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
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
      message: 'خطأ في السيرفر'
    });
  }
});

// الدفع من المحفظة
router.post('/payment', auth, async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'الرصيد غير كافي'
      });
    }

    const balance_before = wallet.balance;
    const newBalance = await wallet.updateBalance(amount, 'payment');

    // تسجيل معاملة الدفع
    const transaction = new Transaction({
      user: req.user._id,
      type: 'payment',
      amount: amount,
      balance_before: balance_before,
      balance_after: newBalance,
      description: `دفع مقابل الطلب ${order_id}`,
      status: 'completed',
      order: order_id
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'تم الدفع بنجاح',
      new_balance: newBalance,
      transaction
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في عملية الدفع: ' + error.message
    });
  }
});

// محاكاة عملية الدفع
const simulatePayment = async (amount, paymentMethod) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // محاكاة نجاح الدفع بنسبة 98%
      if (Math.random() < 0.98) {
        resolve({
          success: true,
          transaction_id: 'DEP_' + Date.now() + Math.random().toString(36).substr(2, 9)
        });
      } else {
        resolve({
          success: false,
          message: 'فشل في عملية الدفع، يرجى المحاولة لاحقاً'
        });
      }
    }, 2000);
  });
};

module.exports = router;
