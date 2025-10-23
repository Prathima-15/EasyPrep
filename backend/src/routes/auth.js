const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/email');
const { generateOTP } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

// Temporary storage for pending signups (before OTP verification)
// In production, use Redis or a database table
const pendingSignups = new Map();

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('department').notEmpty().withMessage('Department is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const otpValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

// Student Signup
router.post('/signup/student', signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, username, department, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already taken' 
      });
    }

    // Validate student departments
    const validDepartments = ['IT', 'CSE', 'EEE', 'CIVIL', 'FT', 'BME', 'ECE', 'MECH', 'MCT', 'ADS', 'CSD', 'AIML'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid department' 
      });
    }

    // Generate OTP and temporary user ID
    const otp = generateOTP();
    const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user data temporarily (NOT in database yet)
    pendingSignups.set(tempUserId, {
      name,
      email,
      username,
      department,
      password: hashedPassword,
      role: 'student',
      otp,
      otpExpiry,
      createdAt: Date.now()
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    console.log('✅ Student signup OTP sent:', { 
      tempUserId, 
      email, 
      otp, // For debugging - remove in production
      expiresAt: new Date(otpExpiry).toISOString() 
    });

    // Clean up old pending signups (older than 15 minutes)
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    for (const [key, value] of pendingSignups.entries()) {
      if (value.createdAt < fifteenMinutesAgo) {
        pendingSignups.delete(key);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        userId: tempUserId, // Send temporary ID to frontend
        email: email
      }
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Staff Signup (Auto-assigns role based on department)
router.post('/signup/staff', signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, username, department, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already taken' 
      });
    }

    // Validate staff departments
    const validDepartments = ['IT', 'CSE', 'ECE', 'CIVIL', 'EEE', 'MECH', 'MCT', 'BME', 'FT', 'Placement'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid department' 
      });
    }

    // Auto-assign role based on department
    const role = department === 'Placement' ? 'admin' : 'moderator';

    // Generate OTP and temporary user ID
    const otp = generateOTP();
    const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user data temporarily (NOT in database yet)
    pendingSignups.set(tempUserId, {
      name,
      email,
      username,
      department,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
      createdAt: Date.now()
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    console.log('✅ Staff signup OTP sent:', { 
      tempUserId, 
      email, 
      role,
      otp, // For debugging - remove in production
      expiresAt: new Date(otpExpiry).toISOString() 
    });

    // Clean up old pending signups
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    for (const [key, value] of pendingSignups.entries()) {
      if (value.createdAt < fifteenMinutesAgo) {
        pendingSignups.delete(key);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        userId: tempUserId, // Send temporary ID
        email: email,
        department: department,
        role: role
      }
    });
  } catch (error) {
    console.error('Staff signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Coordinator Signup
router.post('/signup/coordinator', signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, username, department, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already taken' 
      });
    }

    // Validate coordinator departments
    const validDepartments = ['IT', 'CSE', 'ECE', 'CIVIL', 'EEE', 'MECH', 'MCT', 'BME', 'FT', 'Placement'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid department' 
      });
    }

    // Create user with moderator role
    const user = await User.create({ 
      name, 
      email, 
      username, 
      department, 
      password, 
      role: 'moderator' 
    });

    // Generate and send OTP
    const otp = generateOTP();
    await User.updateOTP(user.id, otp);
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        userId: user.id,
        email: user.email,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Coordinator signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Admin Signup
router.post('/signup/admin', signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, username, department, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already taken' 
      });
    }

    // Validate admin departments
    const validDepartments = ['IT', 'CSE', 'ECE', 'CIVIL', 'EEE', 'MECH', 'MCT', 'BME', 'FT', 'Placement'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid department' 
      });
    }

    // Create user with admin role
    const user = await User.create({ 
      name, 
      email, 
      username, 
      department, 
      password, 
      role: 'admin' 
    });

    // Generate and send OTP
    const otp = generateOTP();
    await User.updateOTP(user.id, otp);
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        userId: user.id,
        email: user.email,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Verify OTP
router.post('/verify-otp', otpValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userId, otp } = req.body;

    // Trim and normalize OTP
    const normalizedOTP = String(otp).trim();

    // Check if this is a temporary user (pending signup)
    if (userId.startsWith('temp_')) {
      const pendingUser = pendingSignups.get(userId);
      
      if (!pendingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or expired signup session. Please sign up again.' 
        });
      }

      // Check OTP validity - compare as strings
      if (String(pendingUser.otp).trim() !== normalizedOTP) {
        console.log('❌ OTP Mismatch:', {
          received: normalizedOTP,
          expected: String(pendingUser.otp).trim(),
          userId: userId
        });
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid OTP' 
        });
      }

      if (Date.now() > pendingUser.otpExpiry) {
        pendingSignups.delete(userId);
        console.log('❌ OTP Expired for userId:', userId);
        return res.status(400).json({ 
          success: false, 
          message: 'OTP expired. Please sign up again.' 
        });
      }

      // OTP is valid! Now create the user in database
      console.log('✅ OTP Verified for:', pendingUser.email);
      try {
        const newUser = await User.create({
          name: pendingUser.name,
          email: pendingUser.email,
          username: pendingUser.username,
          department: pendingUser.department,
          password: pendingUser.password, // Already hashed
          role: pendingUser.role,
          isPasswordHashed: true // Tell create() not to hash again
        });

        // Mark as verified immediately
        await User.markAsVerified(newUser.id);

        // Remove from pending storage
        pendingSignups.delete(userId);

        return res.json({
          success: true,
          message: 'Email verified successfully. Account created!',
          data: {
            userId: newUser.id
          }
        });
      } catch (dbError) {
        console.error('Database error during user creation:', dbError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create account. Please try again.' 
        });
      }
    } else {
      // Legacy support for old OTP verification (if any users exist in DB)
      const isValid = await User.verifyOTP(userId, otp);

      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or expired OTP' 
        });
      }

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed. Please try again.' 
    });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Validate password
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Check if verified
    if (!user.verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email first',
        requiresVerification: true,
        userId: user.id
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          department: user.department,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if this is a temporary user (pending signup)
    if (userId.startsWith('temp_')) {
      const pendingUser = pendingSignups.get(userId);
      
      if (!pendingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or expired signup session. Please sign up again.' 
        });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Update OTP in pending storage
      pendingUser.otp = otp;
      pendingUser.otpExpiry = otpExpiry;
      pendingSignups.set(userId, pendingUser);

      // Send new OTP email
      await sendOTPEmail(pendingUser.email, otp, pendingUser.name);

      return res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } else {
      // Legacy support for users already in database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      if (user.verified) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already verified' 
        });
      }

      // Generate and send new OTP
      const otp = generateOTP();
      await User.updateOTP(userId, otp);
      await sendOTPEmail(user.email, otp, user.name);

      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to resend OTP' 
    });
  }
});

module.exports = router;
