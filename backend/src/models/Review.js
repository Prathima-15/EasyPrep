const { mongoose } = require('../config/mongodb');

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  companyName: {
    type: String,
    required: true
  },
  // Student info
  studentId: {
    type: Number, // MySQL user ID
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  // Review details
  role: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  pros: [{
    type: String,
    trim: true
  }],
  cons: [{
    type: String,
    trim: true
  }],
  interviewTopics: [{
    type: String,
    trim: true
  }],
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // Auto-approve for now
  },
  reviewedBy: {
    type: String
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ companyId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ studentId: 1 });
reviewSchema.index({ status: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
