const { mongoose } = require('../config/mongodb');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String, // Path to logo file
    default: ''
  },
  // File paths
  eligibleStudentsFile: {
    type: String, // Path to Excel file
    required: true
  },
  attachmentFile: {
    type: String, // Path to PDF/Image file (optional)
    default: ''
  },
  // Eligible students data parsed from Excel (optional for now)
  eligibleStudents: [{
    registerNumber: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    cgpa: {
      type: Number,
      default: 0
    },
    skills: {
      type: String,
      default: ''
    }
  }],
  totalEligibleStudents: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  // Additional fields
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
  recruitmentYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  visitDate: {
    type: Date
  },
  // Metadata
  createdBy: {
    type: String, // user email or username
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
companySchema.index({ status: 1, createdAt: -1 });
companySchema.index({ 'eligibleStudents.registerNumber': 1 });
companySchema.index({ createdBy: 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
