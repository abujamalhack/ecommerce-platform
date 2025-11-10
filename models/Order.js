const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  total_amount: {
    type: Number,
    required: true
  },
  game_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  delivery_data: {
    type: String // بيانات التسليم النهائية
  },
  payment_method: String,
  transaction_id: String
}, {
  timestamps: true
});

// إنشاء رقم طلب تلقائي
orderSchema.pre('save', async function(next) {
  if (!this.order_number) {
    const count = await mongoose.model('Order').countDocuments();
    this.order_number = `ORD${Date.now()}${count}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
