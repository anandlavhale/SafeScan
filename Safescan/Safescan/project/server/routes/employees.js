import express from 'express';
import { body, validationResult } from 'express-validator';
import Employee from '../models/Employee.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const employeeValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('employeeId').notEmpty().trim().withMessage('Employee ID is required'),
  body('dob').isDate().withMessage('Valid date of birth is required'),
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Valid blood group is required'),
  body('emergencyContacts').isArray({ min: 1 }).withMessage('At least one emergency contact is required'),
  body('physician.name').notEmpty().withMessage('Physician name is required'),
  body('physician.phone').notEmpty().withMessage('Physician phone is required'),
  body('insurance.provider').notEmpty().withMessage('Insurance provider is required'),
  body('insurance.memberId').notEmpty().withMessage('Insurance member ID is required')
];

// GET /api/employees/:id - Public endpoint for QR scanning
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    // Return public emergency information only
    const publicInfo = {
      id: employee._id,
      name: employee.name,
      age: employee.age,
      dob: employee.dob,
      bloodGroup: employee.bloodGroup,
      allergies: employee.allergies,
      medications: employee.medications,
      emergencyContacts: employee.emergencyContacts,
      physician: employee.physician,
      medicalConditions: employee.medicalConditions,
      notes: employee.notes
    };

    res.json({
      success: true,
      data: publicInfo
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// GET /api/employees - Get all employees (Admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// POST /api/employees - Create new employee
router.post('/', authenticate, employeeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ 
      employeeId: req.body.employeeId.toUpperCase() 
    });
    
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    const employee = new Employee(req.body);
    await employee.save();

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(employee.qrCodeUrl);
    employee.qrCodeDataUrl = qrCodeDataUrl;

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', authenticate, employeeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// GET /api/employees/:id/qr - Get QR code for employee
router.get('/:id/qr', authenticate, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const qrCodeDataUrl = await generateQRCode(employee.qrCodeUrl);
    
    res.json({
      success: true,
      data: {
        qrCodeDataUrl,
        qrCodeUrl: employee.qrCodeUrl
      }
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;