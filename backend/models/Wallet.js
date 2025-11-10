const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  total_deposited: {
    type: Number,
    default: 0
  },
  total_withdrawn: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'SAR'
  }
}, {
  timestamps: true
});

// تحديث رصيد المحفظة
walletSchema.methods.updateBalance = async function(amount, type) {
  if (type === 'deposit') {
    this.balance += amount;
    this.total_deposited += amount;
  } else if (type === 'withdraw') {
    if (this.balance < amount) {
      throw new Error('الرصيد غير كافي');
    }
    this.balance -= amount;
    this.total_withdrawn += amount;
  } else if (type === 'payment') {
    if (this.balance < amount) {
      throw new Error('الرصيد غير كافي');
    }
    this.balance -= amount;
  }
  
  await this.save();
  return this.balance;
};

module.exports = mongoose.model('Wallet', walletSchema);
