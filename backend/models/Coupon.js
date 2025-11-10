const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discount_value: {
    type: Number,
    required: true,
    min: 0
  },
  minimum_amount: {
    type: Number,
    default: 0
  },
  maximum_discount: {
    type: Number
  },
  usage_limit: {
    type: Number,
    default: 1
  },
  used_count: {
    type: Number,
    default: 0
  },
  valid_from: {
    type: Date,
    default: Date.now
  },
  valid_until: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  applicable_categories: [{
    type: String,
    enum: ['games', 'apps', 'gift_cards', 'all']
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// التحقق من صلاحية الكوبون
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.is_active &&
    this.used_count < this.usage_limit &&
    this.valid_from <= now &&
    this.valid_until >= now
  );
};

// تطبيق الخصم
couponSchema.methods.applyDiscount = function(amount) {
  if (!this.isValid()) {
    throw new Error('الكوبون غير صالح');
  }

  if (amount < this.minimum_amount) {
    throw new Error(`الحد الأدنى للطلب هو ${this.minimum_amount} ريال`);
  }

  let discount = 0;

  if (this.discount_type === 'percentage') {
    discount = (amount * this.discount_value) / 100;
    if (this.maximum_discount && discount > this.maximum_discount) {
      discount = this.maximum_discount;
    }
  } else {
    discount = this.discount_value;
  }

  // التأكد من أن الخصم لا يتجاوز المبلغ
  discount = Math.min(discount, amount);

  return {
    discount,
    final_amount: amount - discount
  };
};

module.exports = mongoose.model('Coupon', couponSchema);
