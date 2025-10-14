/**
 * Excel Parser Utility
 * Parses Excel files to extract register numbers for student eligibility
 */

import * as XLSX from 'xlsx'

/**
 * Parses an Excel file and extracts register numbers from the "Register Number" column
 * @param file - The Excel file to parse
 * @returns Promise<string[]> - Array of register numbers
 */
export async function parseEligibilityExcel(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('Failed to read file'))
          return
        }

        // Parse the Excel file
        const workbook = XLSX.read(data, { type: 'binary' })
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'))
          return
        }

        // Find the "Register Number" column index
        const headerRow = jsonData[0]
        const registerNumberIndex = headerRow.findIndex((col: string) => 
          col && col.toString().toLowerCase().includes('register')
        )

        if (registerNumberIndex === -1) {
          reject(new Error('Could not find "Register Number" column in Excel file'))
          return
        }

        // Extract register numbers from the column (skip header row)
        const registerNumbers: string[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          const registerNumber = row[registerNumberIndex]
          
          if (registerNumber) {
            // Convert to string and trim whitespace
            const regNum = registerNumber.toString().trim()
            if (regNum) {
              registerNumbers.push(regNum)
            }
          }
        }

        if (registerNumbers.length === 0) {
          reject(new Error('No register numbers found in the Excel file'))
          return
        }

        resolve(registerNumbers)
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * Validates if a register number exists in the eligibility list
 * @param studentRegisterNumber - The student's register number (username)
 * @param eligibleRegisterNumbers - Array of eligible register numbers
 * @returns boolean - True if student is eligible
 */
export function isStudentEligible(
  studentRegisterNumber: string,
  eligibleRegisterNumbers: string[]
): boolean {
  if (!studentRegisterNumber || !eligibleRegisterNumbers || eligibleRegisterNumbers.length === 0) {
    return false
  }

  // Normalize both for case-insensitive comparison
  const normalizedStudentReg = studentRegisterNumber.trim().toLowerCase()
  
  return eligibleRegisterNumbers.some(
    regNum => regNum.trim().toLowerCase() === normalizedStudentReg
  )
}

/**
 * Gets the count of eligible students
 * @param eligibleRegisterNumbers - Array of eligible register numbers
 * @returns number - Count of unique register numbers
 */
export function getEligibleStudentsCount(eligibleRegisterNumbers: string[]): number {
  // Remove duplicates and count
  const uniqueRegNumbers = new Set(eligibleRegisterNumbers.map(r => r.trim().toLowerCase()))
  return uniqueRegNumbers.size
}
