const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create a new student
  static async createStudent(data) {
    const { name, email, registerNumber, department, password, cgpa, yearOfStudy } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      `INSERT INTO students (name, email, register_number, department, password, cgpa, year_of_study)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, registerNumber, department, hashedPassword, cgpa, yearOfStudy]
    );
    
    return result.insertId;
  }

  // Create a new coordinator
  static async createCoordinator(data) {
    const { name, email, department, designation, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      `INSERT INTO coordinators (name, email, department, designation, password)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, department, designation || 'Coordinator', hashedPassword]
    );
    
    return result.insertId;
  }

  // Create a new admin
  static async createAdmin(data) {
    const { name, email, department, designation, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      `INSERT INTO admins (name, email, department, designation, password)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, department || 'Placement', designation || 'Placement Officer', hashedPassword]
    );
    
    return result.insertId;
  }

  // Find user by email (checks all three tables)
  static async findByEmail(email) {
    // Check students
    const [students] = await db.query(
      'SELECT id, name, email, register_number as username, department, password, verified, otp, otp_expiry, created_at FROM students WHERE email = ?',
      [email]
    );
    
    if (students.length > 0) {
      return { ...students[0], role: 'student', userType: 'student' };
    }

    // Check coordinators
    const [coordinators] = await db.query(
      'SELECT id, name, email, email as username, department, designation, password, verified, otp, otp_expiry, created_at FROM coordinators WHERE email = ?',
      [email]
    );
    
    if (coordinators.length > 0) {
      return { ...coordinators[0], role: 'moderator', userType: 'coordinator' };
    }

    // Check admins
    const [admins] = await db.query(
      'SELECT id, name, email, email as username, department, designation, password, verified, otp, otp_expiry, created_at FROM admins WHERE email = ?',
      [email]
    );
    
    if (admins.length > 0) {
      return { ...admins[0], role: 'admin', userType: 'admin' };
    }

    return null;
  }

  // Find student by register number
  static async findStudentByRegisterNumber(registerNumber) {
    const [rows] = await db.query(
      'SELECT id, name, email, register_number as username, department, password, verified, otp, otp_expiry, created_at FROM students WHERE register_number = ?',
      [registerNumber]
    );
    
    if (rows.length > 0) {
      return { ...rows[0], role: 'student', userType: 'student' };
    }
    
    return null;
  }

  // Find user by username (register number for students, email for staff)
  static async findByUsername(username) {
    // Try as register number first (students)
    const student = await this.findStudentByRegisterNumber(username);
    if (student) return student;

    // Try as email (coordinators/admins)
    return await this.findByEmail(username);
  }

  // Validate password
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update OTP for user
  static async updateOTP(userType, email, otp, expiryTime) {
    const table = userType === 'student' ? 'students' : 
                  userType === 'coordinator' ? 'coordinators' : 'admins';
    
    await db.query(
      `UPDATE ${table} SET otp = ?, otp_expiry = ? WHERE email = ?`,
      [otp, expiryTime, email]
    );
  }

  // Verify OTP and mark user as verified
  static async verifyOTP(userType, email, otp) {
    const table = userType === 'student' ? 'students' : 
                  userType === 'coordinator' ? 'coordinators' : 'admins';
    
    const [rows] = await db.query(
      `SELECT id, otp, otp_expiry FROM ${table} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    const user = rows[0];
    
    // Check if OTP matches
    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otp_expiry)) {
      throw new Error('OTP expired');
    }

    // Mark as verified and clear OTP
    await db.query(
      `UPDATE ${table} SET verified = TRUE, otp = NULL, otp_expiry = NULL WHERE email = ?`,
      [email]
    );

    return true;
  }

  // Get manageable departments for a coordinator
  static async getManageableDepartments(department) {
    const [rows] = await db.query(
      'SELECT manageable_departments FROM department_mappings WHERE department = ?',
      [department]
    );

    if (rows.length === 0) {
      return [department]; // Default to own department
    }

    return rows[0].manageable_departments.split(',');
  }

  // Get user by ID and type
  static async getUserById(userType, id) {
    const table = userType === 'student' ? 'students' : 
                  userType === 'coordinator' ? 'coordinators' : 'admins';
    
    const selectFields = userType === 'student' 
      ? 'id, name, email, register_number as username, department, cgpa, year_of_study, verified, created_at'
      : 'id, name, email, department, designation, verified, created_at';
    
    const [rows] = await db.query(
      `SELECT ${selectFields} FROM ${table} WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const role = userType === 'student' ? 'student' : userType === 'coordinator' ? 'moderator' : 'admin';
    return { ...rows[0], role, userType };
  }
}

module.exports = UserModel;
