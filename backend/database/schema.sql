-- EasyPrep MySQL Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS easyprep_db;
USE easyprep_db;

-- Users table (students, coordinators, admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'moderator', 'admin') NOT NULL DEFAULT 'student',
  verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  job_description_url VARCHAR(500),
  attachment_url VARCHAR(500),
  eligible_students_file_url VARCHAR(500),
  status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
  created_by INT NOT NULL,
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_department (department),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eligible students table (parsed from Excel uploads)
CREATE TABLE IF NOT EXISTS eligible_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  register_number VARCHAR(50) NOT NULL,
  student_name VARCHAR(255),
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_company (company_id, register_number),
  INDEX idx_register_number (register_number),
  INDEX idx_company_id (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  student_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  topic VARCHAR(100),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_company_id (company_id),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  status ENUM('success', 'failed', 'warning') DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved questions table (for student bookmarks)
CREATE TABLE IF NOT EXISTS saved_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_question (user_id, question_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Department mappings table (for coordinator access control)
CREATE TABLE IF NOT EXISTS department_mappings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  coordinator_department VARCHAR(50) NOT NULL,
  student_department VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_mapping (coordinator_department, student_department),
  INDEX idx_coordinator_dept (coordinator_department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default department mappings
INSERT INTO department_mappings (coordinator_department, student_department) VALUES
('IT', 'IT'),
('IT', 'ADS'),
('CSE', 'CSE'),
('CSE', 'CSD'),
('CSE', 'AIML'),
('ECE', 'ECE'),
('EEE', 'EEE'),
('MECH', 'MECH'),
('CIVIL', 'CIVIL'),
('BME', 'BME'),
('FT', 'FT'),
('MCT', 'MCT'),
('Placement', 'IT'),
('Placement', 'CSE'),
('Placement', 'ECE'),
('Placement', 'EEE'),
('Placement', 'MECH'),
('Placement', 'CIVIL'),
('Placement', 'BME'),
('Placement', 'FT'),
('Placement', 'MCT'),
('Placement', 'ADS'),
('Placement', 'CSD'),
('Placement', 'AIML');
