const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { uploadCompanyFiles } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { generateExcelTemplate } = require('../utils/excelParser');

// Download Excel template
router.get('/template', (req, res) => {
  try {
    const buffer = generateExcelTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=eligible_students_template.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate template'
    });
  }
});

// Create company (with file uploads)
router.post('/', uploadCompanyFiles, companyController.createCompany);

// Get all companies
router.get('/', companyController.getCompanies);

// Get company by ID
router.get('/:id', companyController.getCompanyById);

// Get eligible students for a company
router.get('/:id/eligible-students', companyController.getEligibleStudents);

// Update company (with file uploads)
router.put('/:id', uploadCompanyFiles, companyController.updateCompany);

// Delete company
router.delete('/:id', companyController.deleteCompany);

module.exports = router;
