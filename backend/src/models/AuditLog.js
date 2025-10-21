const { mongoose } = require('../config/mongodb');

const auditLogSchema = new mongoose.Schema({
  // User who performed the action (MySQL user ID)
  userId: {
    type: Number,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'moderator', 'admin'],
    required: true
  },
  // Action details
  action: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'approve', 'reject', 'upload'],
    required: true
  },
  // Entity affected
  entityType: {
    type: String,
    enum: ['user', 'company', 'question', 'eligibleStudent', 'savedQuestion'],
    required: true
  },
  entityId: {
    type: String
  },
  entityName: {
    type: String
  },
  // Additional details
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  // Request information
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  // Status
  status: {
    type: String,
    enum: ['success', 'failed', 'warning'],
    default: 'success'
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ actionType: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
