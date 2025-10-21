const { mongoose } = require('../config/mongodb');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  // Eligible students list (uploaded via Excel)
  eligibleStudents: [{
    registerNumber: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    cgpa: {
      type: Number,
      default: 0
    }
  }],
  // Recruitment details
  recruitmentYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  recruitmentStatus: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  visitDate: {
    type: Date
  },
  // Metadata
  createdBy: {
    type: String, // user email
    required: true
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
companySchema.index({ name: 1 });
companySchema.index({ recruitmentYear: -1, recruitmentStatus: 1 });
companySchema.index({ 'eligibleStudents.registerNumber': 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
