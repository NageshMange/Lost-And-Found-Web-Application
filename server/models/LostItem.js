const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  foundLocation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  collectionLocation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  imagePath: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'accessories', 'books', 'bags', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['active', 'collected', 'archived'],
    default: 'active'
  },
  collectedBy: {
    type: String,
    trim: true,
    maxlength: 100
  },
  collectedAt: {
    type: Date
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qrCode: {
    type: String
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Index for better query performance
lostItemSchema.index({ status: 1, createdAt: -1 });
lostItemSchema.index({ category: 1, status: 1 });
lostItemSchema.index({ createdAt: -1 });

// Auto-archive items older than 1 month
lostItemSchema.pre('save', function(next) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  if (this.status === 'active' && this.createdAt < oneMonthAgo) {
    this.status = 'archived';
  }
  
  next();
});

module.exports = mongoose.model('LostItem', lostItemSchema);








