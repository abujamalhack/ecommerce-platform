const express = require('express');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// معالجة الدفع
router.post('/process', auth, async (req, res) => {
  try {
    const { order_id, payment_data } = req.body;

    const order = await Order.findById(order_id)
      .populate('product')
      .populate('user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // محاكاة عملية الدفع (سيتم استبدالها ببوابة دفع حقيقية)
    const paymentResult = await simulatePayment(order, payment_data);

    if (paymentResult.success) {
      // تحديث حالة الطلب
      order.payment_status = 'paid';
      order.transaction_id = paymentResult.transaction_id;
      await order.save();

      // إذا كان المنتج شحن تلقائي
      if (order.product.auto_delivery) {
        await processAutoDelivery(order);
      }

      res.json({
        success: true,
        message: 'تم الدفع بنجاح',
        order
      });
    } else {
      order.payment_status = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: paymentResult.message
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في عملية الدفع'
    });
  }
});

// محاكاة عملية الدفع
const simulatePayment = async (order, paymentData) => {
  // في البيئة الحقيقية، هنا يتم الاتصال ببوابة الدفع
  return new Promise((resolve) => {
    setTimeout(() => {
      // محاكاة نجاح الدفع بنسبة 95%
      if (Math.random() < 0.95) {
        resolve({
          success: true,
          transaction_id: 'TXN_' + Date.now() + Math.random().toString(36).substr(2, 9)
        });
      } else {
        resolve({
          success: false,
          message: 'فشل في عملية الدفع'
        });
      }
    }, 2000);
  });
};

// معالجة الشحن التلقائي
const processAutoDelivery = async (order) => {
  try {
    // محاكاة عملية الشحن التلقائي
    // في البيئة الحقيقية، هنا يتم الاتصال بAPI الشحن
    
    setTimeout(async () => {
      order.status = 'completed';
      order.delivery_data = `تم الشحن بنجاح للاعب: ${order.game_id}`;
      await order.save();
    }, 3000);

  } catch (error) {
    console.error('Auto delivery error:', error);
  }
};

module.exports = router;
