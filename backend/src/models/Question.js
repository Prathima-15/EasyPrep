const { mongoose } = require('../config/mongodb');

const questionSchema = new mongoose.Schema({
  // Company reference
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  // Student who submitted (MySQL user ID)
  studentId: {
    type: Number,
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
  studentDepartment: {
    type: String,
    required: true
  },
  // Question details
  category: {
    type: String,
    required: true,
    enum: ['Technical / DSA', 'System Design', 'Behavioral', 'Database', 'Other']
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  tags: [{
    type: String,
    trim: true
  }],
  answer: {
    type: String,
    default: ''
  },
  // Engagement metrics
  upvotes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  frequency: {
    type: Number,
    default: 1 // How many times this question was asked
  },
  // Review status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: String // reviewer email
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
questionSchema.index({ companyId: 1, status: 1, category: 1 });
questionSchema.index({ studentId: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ category: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
