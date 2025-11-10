const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['games', 'apps', 'gift_cards'],
    required: true
  },
  game_name: {
    type: String,
    required: true
  },
  game_id: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'SAR'
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  auto_delivery: {
    type: Boolean,
    default: false
  },
  delivery_time: {
    type: String,
    default: 'فوري'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
