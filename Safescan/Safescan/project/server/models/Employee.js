import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    trim: true
  }
});

const physicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Physician name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Physician phone is required'],
    trim: true
  },
  specialty: {
    type: String,
    trim: true
  }
});

const insuranceSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: [true, 'Insurance provider is required'],
    trim: true
  },
  memberId: {
    type: String,
    required: [true, 'Member ID is required'],
    trim: true
  },
  groupNumber: {
    type: String,
    trim: true
  }
});

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    uppercase: true
  },
  allergies: [{
    type: String,
    trim: true
  }],
  medications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      trim: true
    },
    frequency: {
      type: String,
      trim: true
    }
  }],
  emergencyContacts: [emergencyContactSchema],
  physician: physicianSchema,
  insurance: insuranceSchema,
  qrCodeUrl: {
    type: String
  },
  medicalConditions: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Generate QR code URL before saving
employeeSchema.pre('save', function(next) {
  if (!this.qrCodeUrl) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    this.qrCodeUrl = `${baseUrl}/employee/${this._id}`;
  }
  next();
});

// Virtual for age calculation
employeeSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Ensure virtual fields are serialized
employeeSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Employee', employeeSchema);