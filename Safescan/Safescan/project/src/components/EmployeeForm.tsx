import React, { useState, useEffect } from 'react';
import { useEmployee, Employee } from '../context/EmployeeContext';
import { X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';

interface EmployeeFormProps {
  employee?: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose, onSuccess }) => {
  const { createEmployee, updateEmployee, loading, error } = useEmployee();
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    dob: '',
    bloodGroup: '',
    allergies: [''],
    medications: [{ name: '', dosage: '', frequency: '' }],
    emergencyContacts: [{ name: '', phone: '', relationship: '' }],
    physician: { name: '', phone: '', specialty: '' },
    insurance: { provider: '', memberId: '', groupNumber: '' },
    medicalConditions: [''],
    notes: ''
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        name: employee.name || '',
        dob: employee.dob ? employee.dob.split('T')[0] : '',
        bloodGroup: employee.bloodGroup || '',
        allergies: employee.allergies?.length > 0 ? employee.allergies : [''],
        medications: employee.medications?.length > 0 ? employee.medications : [{ name: '', dosage: '', frequency: '' }],
        emergencyContacts: employee.emergencyContacts?.length > 0 ? employee.emergencyContacts : [{ name: '', phone: '', relationship: '' }],
        physician: employee.physician || { name: '', phone: '', specialty: '' },
        insurance: employee.insurance || { provider: '', memberId: '', groupNumber: '' },
        medicalConditions: employee.medicalConditions?.length > 0 ? employee.medicalConditions : [''],
        notes: employee.notes || ''
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.name || !formData.employeeId || !formData.dob || !formData.bloodGroup) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (formData.emergencyContacts.every(contact => !contact.name || !contact.phone)) {
      setFormError('At least one emergency contact is required');
      return;
    }

    if (!formData.physician.name || !formData.physician.phone) {
      setFormError('Physician information is required');
      return;
    }

    if (!formData.insurance.provider || !formData.insurance.memberId) {
      setFormError('Insurance information is required');
      return;
    }

    // Clean up arrays (remove empty entries)
    const cleanedData = {
      ...formData,
      allergies: formData.allergies.filter(item => item.trim() !== ''),
      medicalConditions: formData.medicalConditions.filter(item => item.trim() !== ''),
      medications: formData.medications.filter(med => med.name.trim() !== ''),
      emergencyContacts: formData.emergencyContacts.filter(contact => contact.name.trim() !== '' && contact.phone.trim() !== '')
    };

    try {
      if (employee) {
        await updateEmployee(employee._id, cleanedData);
      } else {
        await createEmployee(cleanedData as any);
      }
      onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const handleObjectArrayChange = (field: string, index: number, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const handleObjectChange = (field: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof prev] as any, [key]: value }
    }));
  };

  const addArrayItem = (field: string, defaultValue: any = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), defaultValue]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {(formError || error) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{formError || error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID *
              </label>
              <input
                type="text"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="EMP001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
          
          {/* Allergies */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            {formData.allergies.map((allergy, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={allergy}
                  onChange={(e) => handleArrayChange('allergies', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Penicillin"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('allergies', index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('allergies', '')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4" />
              <span>Add Allergy</span>
            </button>
          </div>

          {/* Medical Conditions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
            {formData.medicalConditions.map((condition, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => handleArrayChange('medicalConditions', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Diabetes"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('medicalConditions', index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('medicalConditions', '')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4" />
              <span>Add Medical Condition</span>
            </button>
          </div>

          {/* Medications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
            {formData.medications.map((medication, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-3 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  value={medication.name}
                  onChange={(e) => handleObjectArrayChange('medications', index, 'name', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Medication name"
                />
                <input
                  type="text"
                  value={medication.dosage || ''}
                  onChange={(e) => handleObjectArrayChange('medications', index, 'dosage', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dosage"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={medication.frequency || ''}
                    onChange={(e) => handleObjectArrayChange('medications', index, 'frequency', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Frequency"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('medications', index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('medications', { name: '', dosage: '', frequency: '' })}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts *</h3>
          {formData.emergencyContacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 p-3 border border-gray-200 rounded-lg">
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleObjectArrayChange('emergencyContacts', index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact name"
                required
              />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleObjectArrayChange('emergencyContacts', index, 'phone', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
                required
              />
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={contact.relationship}
                  onChange={(e) => handleObjectArrayChange('emergencyContacts', index, 'relationship', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Relationship"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('emergencyContacts', index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('emergencyContacts', { name: '', phone: '', relationship: '' })}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-4 w-4" />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        {/* Physician Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Physician *</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.physician.name}
              onChange={(e) => handleObjectChange('physician', 'name', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Physician name"
              required
            />
            <input
              type="tel"
              value={formData.physician.phone}
              onChange={(e) => handleObjectChange('physician', 'phone', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number"
              required
            />
            <input
              type="text"
              value={formData.physician.specialty || ''}
              onChange={(e) => handleObjectChange('physician', 'specialty', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Specialty (optional)"
            />
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information *</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.insurance.provider}
              onChange={(e) => handleObjectChange('insurance', 'provider', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Insurance provider"
              required
            />
            <input
              type="text"
              value={formData.insurance.memberId}
              onChange={(e) => handleObjectChange('insurance', 'memberId', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Member ID"
              required
            />
            <input
              type="text"
              value={formData.insurance.groupNumber || ''}
              onChange={(e) => handleObjectChange('insurance', 'groupNumber', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Group number (optional)"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional medical information or special considerations..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{employee ? 'Update' : 'Create'} Employee</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;