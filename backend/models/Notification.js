const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'order', 'payment'],
    default: 'info'
  },
  related_model: {
    type: String,
    enum: ['order', 'payment', 'user', 'system', 'wallet']
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  is_read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// فهرس للأداء
notificationSchema.index({ user: 1, is_read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // حذف تلقائي بعد 90 يوم

module.exports = mongoose.model('Notification', notificationSchema);
