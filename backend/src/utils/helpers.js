// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validate file type
const isValidFileType = (filename, allowedTypes) => {
  const ext = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(ext);
};

// Get file extension
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Sanitize filename
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

// Check if department can be managed
const canManageDepartment = (coordinatorDept, studentDept) => {
  const departmentMappings = {
    'IT': ['IT', 'ADS'],
    'CSE': ['CSE', 'CSD', 'AIML'],
    'ECE': ['ECE'],
    'EEE': ['EEE'],
    'MECH': ['MECH'],
    'CIVIL': ['CIVIL'],
    'BME': ['BME'],
    'FT': ['FT'],
    'MCT': ['MCT'],
    'Placement': ['IT', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BME', 'FT', 'MCT', 'ADS', 'CSD', 'AIML']
  };

  const manageable = departmentMappings[coordinatorDept] || [];
  return manageable.includes(studentDept);
};

// Paginate array
const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit
    }
  };
};

// Create response object
const createResponse = (success, message, data = null, error = null) => {
  const response = { success, message };
  
  if (data) response.data = data;
  if (error) response.error = error;
  
  return response;
};

// Handle async route errors
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  generateOTP,
  formatDate,
  isValidFileType,
  getFileExtension,
  sanitizeFilename,
  canManageDepartment,
  paginate,
  createResponse,
  asyncHandler
};
