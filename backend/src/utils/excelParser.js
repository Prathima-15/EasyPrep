const XLSX = require('xlsx');

/**
 * Parse Excel file and extract student data
 * Expected columns: Register Number, Name, Email, Department, CGPA, Skills (optional)
 * @param {string} filePath - Path to the Excel file
 * @returns {Promise<Array>} Array of student objects
 */
async function parseExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    if (!rawData || rawData.length === 0) {
      throw new Error('Excel file is empty or invalid');
    }

    // Parse and validate data
    const students = [];
    
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      
      // Handle different possible column names (case-insensitive)
      const registerNumber = 
        row['Register Number'] || 
        row['RegisterNumber'] || 
        row['register number'] || 
        row['Student ID'] ||
        row['StudentID'] ||
        row['ID'] ||
        '';
      
      const name = 
        row['Name'] || 
        row['name'] || 
        row['Student Name'] ||
        row['StudentName'] ||
        '';
      
      const email = 
        row['Email'] || 
        row['email'] || 
        row['E-mail'] ||
        row['Email Address'] ||
        '';
      
      const department = 
        row['Department'] || 
        row['department'] || 
        row['Dept'] ||
        row['Branch'] ||
        '';
      
      const cgpa = 
        parseFloat(row['CGPA'] || row['cgpa'] || row['GPA'] || row['gpa'] || 0);
      
      const skills = 
        row['Skills'] || 
        row['skills'] || 
        row['Skill Set'] ||
        '';

      // Validate required fields
      if (!registerNumber || !name || !email || !department) {
        console.warn(`Row ${i + 1}: Missing required fields, skipping...`);
        continue;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.warn(`Row ${i + 1}: Invalid email format (${email}), skipping...`);
        continue;
      }

      students.push({
        registerNumber: registerNumber.toString().trim(),
        name: name.toString().trim(),
        email: email.toString().trim().toLowerCase(),
        department: department.toString().trim(),
        cgpa: isNaN(cgpa) ? 0 : cgpa,
        skills: skills.toString().trim()
      });
    }

    if (students.length === 0) {
      throw new Error('No valid student data found in Excel file. Please check the format.');
    }

    return students;
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Generate Excel template for eligible students
 * @returns {Buffer} Excel file buffer
 */
function generateExcelTemplate() {
  const templateData = [
    {
      'Register Number': 'CS2021001',
      'Name': 'John Doe',
      'Email': 'john.doe@example.com',
      'Department': 'CSE',
      'CGPA': 8.5,
      'Skills': 'React, Node.js, MongoDB'
    },
    {
      'Register Number': 'IT2021002',
      'Name': 'Jane Smith',
      'Email': 'jane.smith@example.com',
      'Department': 'IT',
      'CGPA': 9.0,
      'Skills': 'Python, Django, PostgreSQL'
    }
  ];

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eligible Students');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, // Register Number
    { wch: 20 }, // Name
    { wch: 30 }, // Email
    { wch: 15 }, // Department
    { wch: 8 },  // CGPA
    { wch: 30 }  // Skills
  ];

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

module.exports = {
  parseExcelFile,
  generateExcelTemplate
};
