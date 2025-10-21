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
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  topic: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Question type/category
  category: {
    type: String,
    enum: ['Technical', 'Aptitude', 'HR', 'Coding', 'Other'],
    default: 'Technical'
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
  },
  // Metadata
  savedCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ companyId: 1 });
questionSchema.index({ studentId: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ companyName: 'text', title: 'text', description: 'text', tags: 'text' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
