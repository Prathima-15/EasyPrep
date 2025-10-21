const { mongoose } = require('../config/mongodb');

const savedQuestionSchema = new mongoose.Schema({
  // User who saved the question (MySQL user ID)
  userId: {
    type: Number,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  // Question reference
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  // Optional notes
  notes: {
    type: String,
    default: ''
  },
  // Tags for organization
  customTags: [{
    type: String,
    trim: true
  }],
  // Practice status
  status: {
    type: String,
    enum: ['to-practice', 'practicing', 'completed'],
    default: 'to-practice'
  }
}, {
  timestamps: true
});

// Ensure a user can't save the same question twice
savedQuestionSchema.index({ userId: 1, questionId: 1 }, { unique: true });
savedQuestionSchema.index({ userId: 1, status: 1 });
savedQuestionSchema.index({ createdAt: -1 });

const SavedQuestion = mongoose.model('SavedQuestion', savedQuestionSchema);

module.exports = SavedQuestion;
