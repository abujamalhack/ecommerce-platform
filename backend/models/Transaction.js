const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'payment', 'refund', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balance_before: {
    type: Number,
    required: true
  },
  balance_after: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  reference_id: String,
  payment_method: String,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// إنشاء رقم معاملة تلقائي
transactionSchema.pre('save', async function(next) {
  if (!this.reference_id) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.reference_id = `TXN${Date.now()}${count}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
