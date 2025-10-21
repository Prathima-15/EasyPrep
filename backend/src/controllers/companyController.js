const Company = require('../models/Company');
const { parseExcelFile } = require('../utils/excelParser');
const path = require('path');
const fs = require('fs').promises;

// Create new company
exports.createCompany = async (req, res) => {
  try {
    const { name, jobDescription, role, createdBy } = req.body;

    // Validate required fields
    if (!name || !jobDescription || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company name, job description, and role are required'
      });
    }

    // Validate file uploads
    if (!req.files || !req.files.eligibleStudentsFile) {
      return res.status(400).json({
        success: false,
        message: 'Eligible students Excel file is required'
      });
    }

    const eligibleStudentsFile = req.files.eligibleStudentsFile[0];
    const attachmentFile = req.files.attachmentFile ? req.files.attachmentFile[0] : null;
    const logoFile = req.files.logo ? req.files.logo[0] : null;

    // TEMPORARY: Skip Excel parsing validation
    // Parse Excel file to get eligible students data (commented out for now)
    // const eligibleStudents = await parseExcelFile(eligibleStudentsFile.path);

    // if (!eligibleStudents || eligibleStudents.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'No valid student data found in Excel file'
    //   });
    // }

    // Temporary: Store file without parsing, use default count
    const eligibleStudents = []; // Empty array for now
    const totalEligibleStudents = 45; // Default count as requested

    // Create company
    const company = await Company.create({
      name,
      jobDescription,
      role,
      logo: logoFile ? logoFile.filename : '',
      eligibleStudentsFile: eligibleStudentsFile.filename,
      attachmentFile: attachmentFile ? attachmentFile.filename : '',
      eligibleStudents,
      totalEligibleStudents,
      createdBy: createdBy || 'coordinator',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    console.error('Create company error:', error);
    
    // Handle duplicate company name
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A company with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create company',
      error: error.message
    });
  }
};

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const { status, createdBy, search } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (createdBy) query.createdBy = createdBy;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { jobDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .select('-eligibleStudents'); // Exclude large array for list view

    res.json({
      success: true,
      data: companies,
      count: companies.length
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company',
      error: error.message
    });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, jobDescription, role, updatedBy, status } = req.body;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update basic fields
    if (name) company.name = name;
    if (jobDescription) company.jobDescription = jobDescription;
    if (role) company.role = role;
    if (status) company.status = status;
    if (updatedBy) company.updatedBy = updatedBy;

    // Handle file updates
    if (req.files) {
      // Update logo
      if (req.files.logo) {
        const newLogo = req.files.logo[0];
        
        // Delete old logo
        if (company.logo) {
          const oldFilePath = path.join(__dirname, '../../uploads', company.logo);
          try {
            await fs.unlink(oldFilePath);
          } catch (err) {
            console.log('Old logo not found or already deleted');
          }
        }

        company.logo = newLogo.filename;
      }

      // Update eligible students file
      if (req.files.eligibleStudentsFile) {
        const newFile = req.files.eligibleStudentsFile[0];
        
        // Delete old file
        if (company.eligibleStudentsFile) {
          const oldFilePath = path.join(__dirname, '../../uploads', company.eligibleStudentsFile);
          try {
            await fs.unlink(oldFilePath);
          } catch (err) {
            console.log('Old file not found or already deleted');
          }
        }

        // TEMPORARY: Skip Excel parsing validation
        // Parse new Excel file (commented out for now)
        // const eligibleStudents = await parseExcelFile(newFile.path);
        // company.eligibleStudents = eligibleStudents;
        // company.totalEligibleStudents = eligibleStudents.length;
        
        // Temporary: Just update filename, keep default count
        company.eligibleStudentsFile = newFile.filename;
        company.totalEligibleStudents = 45; // Default count
      }

      // Update attachment file
      if (req.files.attachmentFile) {
        const newAttachment = req.files.attachmentFile[0];
        
        // Delete old attachment
        if (company.attachmentFile) {
          const oldFilePath = path.join(__dirname, '../../uploads', company.attachmentFile);
          try {
            await fs.unlink(oldFilePath);
          } catch (err) {
            console.log('Old attachment not found or already deleted');
          }
        }

        company.attachmentFile = newAttachment.filename;
      }
    }

    await company.save();

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company',
      error: error.message
    });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Delete associated files
    if (company.logo) {
      const filePath = path.join(__dirname, '../../uploads', company.logo);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log('Logo not found or already deleted');
      }
    }

    if (company.eligibleStudentsFile) {
      const filePath = path.join(__dirname, '../../uploads', company.eligibleStudentsFile);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log('File not found or already deleted');
      }
    }

    if (company.attachmentFile) {
      const filePath = path.join(__dirname, '../../uploads', company.attachmentFile);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log('Attachment not found or already deleted');
      }
    }

    await Company.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message
    });
  }
};

// Get eligible students for a company
exports.getEligibleStudents = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).select('eligibleStudents name');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: {
        companyName: company.name,
        students: company.eligibleStudents
      }
    });
  } catch (error) {
    console.error('Get eligible students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eligible students',
      error: error.message
    });
  }
};
