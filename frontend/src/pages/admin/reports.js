const express = require('express');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');
const { auth, adminAuth } = require('../../middleware/auth');
const router = express.Router();

router.get('/reports', auth, adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, type = 'overview' } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // الإحصائيات الأساسية
    const totalSales = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total_amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    // مقارنة مع الفترة السابقة
    const prevStart = new Date(start);
    const prevEnd = new Date(end);
    prevStart.setMonth(prevStart.getMonth() - 1);
    prevEnd.setMonth(prevEnd.getMonth() - 1);

    const prevSales = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: prevStart, $lte: prevEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total_amount' }
        }
      }
    ]);

    // مخطط المبيعات لآخر 7 أيام
    const salesChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const daySales = await Order.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: dayStart, $lte: dayEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total_amount' }
          }
        }
      ]);

      salesChart.push({
        day: date.toLocaleDateString('ar-SA', { weekday: 'short' }),
        amount: daySales.length > 0 ? daySales[0].total : 0
      });
    }

    // المنتجات الأكثر مبيعاً
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$product',
          sales: { $sum: 1 },
          revenue: { $sum: '$total_amount' }
        }
      },
      {
        $sort: { sales: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      }
    ]);

    const reports = {
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      totalOrders: totalSales.length > 0 ? totalSales[0].count : 0,
      newUsers,
      avgOrderValue: totalSales.length > 0 ? (totalSales[0].total / totalSales[0].count).toFixed(2) : 0,
      salesGrowth: prevSales.length > 0 ? 
        Math.round(((totalSales[0]?.total - prevSales[0]?.total) / prevSales[0]?.total) * 100) : 0,
      salesChart,
      topProducts: topProducts.map(item => ({
        _id: item._id,
        name: item.product.name,
        sales: item.sales,
        revenue: item.revenue
      })),
      maxSales: Math.max(...salesChart.map(item => item.amount)),
      conversionRate: 45, // محاكاة
      customerSatisfaction: 92, // محاكاة
      completionRate: 88, // محاكاة
      recentActivity: [
        {
          type: 'order',
          message: 'طلب جديد من محمد أحمد',
          time: 'منذ 5 دقائق'
        },
        {
          type: 'user',
          message: 'مستخدم جديد مسجل',
          time: 'منذ 15 دقيقة'
        },
        {
          type: 'order',
          message: 'طلب مكتمل لـ أحمد علي',
          time: 'منذ ساعة'
        }
      ]
    };

    res.json({
      success: true,
      reports
    });

  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب التقارير'
    });
  }
});

module.exports = router;
