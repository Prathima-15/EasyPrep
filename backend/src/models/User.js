const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { name, email, username, department, password, role = 'student', isPasswordHashed = false } = userData;
    
    try {
      // Only hash password if not already hashed
      const hashedPassword = isPasswordHashed ? password : await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, username, department, password, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, username, department, hashedPassword, role]
      );
      
      return { id: result.insertId, ...userData, password: undefined };
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, username, department, role, verified, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Validate password
  static async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  // Update OTP
  static async updateOTP(userId, otp, expiryMinutes = 10) {
    try {
      const expiryTime = new Date(Date.now() + expiryMinutes * 60000);
      
      await pool.execute(
        'UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?',
        [otp, expiryTime, userId]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  static async verifyOTP(userId, otp) {
    try {
      const [rows] = await pool.execute(
        'SELECT otp, otp_expiry FROM users WHERE id = ?',
        [userId]
      );
      
      if (!rows[0]) return false;
      
      const { otp: storedOTP, otp_expiry } = rows[0];
      
      // Check if OTP matches and hasn't expired
      if (storedOTP === otp && new Date() < new Date(otp_expiry)) {
        // Mark user as verified and clear OTP
        await pool.execute(
          'UPDATE users SET verified = TRUE, otp = NULL, otp_expiry = NULL WHERE id = ?',
          [userId]
        );
        return true;
      }
      
      return false;
    } catch (error) {
      throw error;
    }
  }

  // Mark user as verified
  static async markAsVerified(userId) {
    try {
      await pool.execute(
        'UPDATE users SET verified = TRUE, otp = NULL, otp_expiry = NULL WHERE id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all users with optional filters
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT id, name, email, username, department, role, verified, created_at FROM users WHERE 1=1';
      const params = [];

      if (filters.role) {
        query += ' AND role = ?';
        params.push(filters.role);
      }

      if (filters.department) {
        query += ' AND department = ?';
        params.push(filters.department);
      }

      if (filters.verified !== undefined) {
        query += ' AND verified = ?';
        params.push(filters.verified);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get users by multiple departments (for coordinator access)
  static async getByDepartments(departments) {
    try {
      const placeholders = departments.map(() => '?').join(',');
      const [rows] = await pool.execute(
        `SELECT id, name, email, username, department, role, verified, created_at 
         FROM users 
         WHERE department IN (${placeholders}) AND role = 'student'
         ORDER BY created_at DESC`,
        departments
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(userId, updates) {
    try {
      const allowedFields = ['name', 'email', 'department'];
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (fields.length === 0) return false;

      values.push(userId);

      await pool.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(userId) {
    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get manageable departments for coordinator
  static async getManageableDepartments(coordinatorDept) {
    try {
      const [rows] = await pool.execute(
        'SELECT student_department FROM department_mappings WHERE coordinator_department = ?',
        [coordinatorDept]
      );
      return rows.map(row => row.student_department);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
