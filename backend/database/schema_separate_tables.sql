-- EasyPrep MySQL Database Schema (Updated with Separate Tables)

-- Create database
CREATE DATABASE IF NOT EXISTS easyprep_db;
USE easyprep_db;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  register_number VARCHAR(100) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  cgpa DECIMAL(3,2) DEFAULT NULL,
  year_of_study INT DEFAULT NULL,
  verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_register_number (register_number),
  INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coordinators table (Department coordinators/moderators)
CREATE TABLE IF NOT EXISTS coordinators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL,
  designation VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admins table (Placement department staff)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL DEFAULT 'Placement',
  designation VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  industry VARCHAR(100),
  location VARCHAR(255),
  job_description_url VARCHAR(500),
  attachment_url VARCHAR(500),
  eligible_students_file_url VARCHAR(500),
  recruitment_year INT DEFAULT YEAR(CURDATE()),
  recruitment_status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  visit_date DATE,
  status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
  created_by_type ENUM('coordinator', 'admin') NOT NULL,
  created_by_id INT NOT NULL,
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_recruitment_status (recruitment_status),
  INDEX idx_department (department),
  INDEX idx_recruitment_year (recruitment_year),
  INDEX idx_created_by (created_by_type, created_by_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eligible students table (parsed from Excel uploads)
CREATE TABLE IF NOT EXISTS eligible_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  register_number VARCHAR(50) NOT NULL,
  student_name VARCHAR(255),
  department VARCHAR(50),
  email VARCHAR(255),
  cgpa DECIMAL(3,2),
  is_eligible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_company (company_id, register_number),
  INDEX idx_register_number (register_number),
  INDEX idx_company_id (company_id),
  INDEX idx_department (department)
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
  question_type ENUM('Technical', 'Aptitude', 'HR', 'Coding', 'Other') DEFAULT 'Technical',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approved_by_type ENUM('coordinator', 'admin') DEFAULT NULL,
  approved_by_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_company_id (company_id),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_difficulty (difficulty),
  INDEX idx_question_type (question_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved questions table (for student bookmarks)
CREATE TABLE IF NOT EXISTS saved_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  question_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_question (student_id, question_id),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_type ENUM('student', 'coordinator', 'admin') NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  status ENUM('success', 'failed', 'warning') DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_type, user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Department mappings table (for access control)
CREATE TABLE IF NOT EXISTS department_mappings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50) NOT NULL UNIQUE,
  manageable_departments TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert department mappings
INSERT INTO department_mappings (department, manageable_departments) VALUES
('IT', 'IT,ADS'),
('CSE', 'CSE,CSD,AIML'),
('ECE', 'ECE'),
('CIVIL', 'CIVIL'),
('EEE', 'EEE'),
('MECH', 'MECH'),
('MCT', 'MCT'),
('BME', 'BME'),
('FT', 'FT'),
('Placement', 'IT,CSE,ECE,CIVIL,EEE,MECH,MCT,BME,FT,ADS,CSD,AIML')
ON DUPLICATE KEY UPDATE manageable_departments = VALUES(manageable_departments);
