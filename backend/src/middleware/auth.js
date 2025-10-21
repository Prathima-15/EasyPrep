const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email first.' 
      });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed.' 
    });
  }
};

// Role-based middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Check if coordinator can manage department
const canManageDepartment = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next(); // Admins can manage all departments
    }

    if (req.user.role !== 'moderator') {
      return res.status(403).json({
        success: false,
        message: 'Only coordinators and admins can manage departments.'
      });
    }

    const targetDepartment = req.body.department || req.query.department;
    
    if (!targetDepartment) {
      return next(); // No specific department to check
    }

    const manageableDepts = await User.getManageableDepartments(req.user.department);

    if (!manageableDepts.includes(targetDepartment)) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to manage ${targetDepartment} department.`
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking department permissions.'
    });
  }
};

module.exports = { 
  authMiddleware, 
  requireRole, 
  canManageDepartment 
};
