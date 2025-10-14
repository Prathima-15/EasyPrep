// Department mapping for coordinators
// Maps coordinator departments to student departments they can manage

export const DEPARTMENT_MAPPING: Record<string, string[]> = {
  "IT": ["IT", "ADS"],
  "CSE": ["CSE", "CSD", "AIML"],
  "ECE": ["ECE"],
  "CIVIL": ["CIVIL"],
  "EEE": ["EEE"],
  "MECH": ["MECH"],
  "MCT": ["MCT"],
  "BME": ["BME"],
  "FT": ["FT"],
  "Placement": ["IT", "CSE", "ECE", "CIVIL", "EEE", "MECH", "MCT", "BME", "FT", "ADS", "CSD", "AIML"], // Placement can see all
}

// Get all student departments that a coordinator can manage
export function getManageableDepartments(coordinatorDepartment: string): string[] {
  return DEPARTMENT_MAPPING[coordinatorDepartment] || []
}

// Check if a coordinator can manage a specific student department
export function canManageDepartment(coordinatorDepartment: string, studentDepartment: string): boolean {
  const manageableDepts = getManageableDepartments(coordinatorDepartment)
  return manageableDepts.includes(studentDepartment)
}

// Get the coordinator department for a student department
export function getCoordinatorForStudentDept(studentDepartment: string): string | null {
  for (const [coordinatorDept, studentDepts] of Object.entries(DEPARTMENT_MAPPING)) {
    if (studentDepts.includes(studentDepartment)) {
      return coordinatorDept
    }
  }
  return null
}

// Get all student departments (for reference)
export const ALL_STUDENT_DEPARTMENTS = [
  "IT", "CSE", "ECE", "CIVIL", "EEE", "MECH", "MCT", "BME", "FT", "ADS", "CSD", "AIML"
]

// Get all coordinator departments
export const ALL_COORDINATOR_DEPARTMENTS = Object.keys(DEPARTMENT_MAPPING)
