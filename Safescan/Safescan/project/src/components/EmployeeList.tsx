import React, { useState } from 'react';
import { Employee, useEmployee } from '../context/EmployeeContext';
import { 
  Edit, 
  Trash2, 
  QrCode, 
  Download, 
  Phone, 
  Heart, 
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onRefresh: () => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  onEditEmployee, 
  onRefresh 
}) => {
  const { deleteEmployee, generateQRCode, loading } = useEmployee();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingQRId, setGeneratingQRId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteEmployee(id);
        onRefresh();
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleGenerateQR = async (employee: Employee) => {
    setGeneratingQRId(employee._id);
    try {
      const qrCodeDataUrl = await generateQRCode(employee._id);
      
      // Create download link
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `${employee.name.replace(/\s+/g, '_')}_QR_Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('QR generation error:', error);
    } finally {
      setGeneratingQRId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Filter employees based on search term and blood group
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !filterBloodGroup || employee.bloodGroup === filterBloodGroup;
    
    return matchesSearch && matchesBloodGroup;
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
        <p className="text-gray-600">Add your first employee to get started with the emergency medical system.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <select
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
      </div>

      {/* Employee Cards */}
      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <div key={employee._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">ID: {employee.employeeId}</p>
                  </div>
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {employee.bloodGroup}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Age:</span> {calculateAge(employee.dob)} years
                  </div>
                  <div>
                    <span className="text-gray-600">DOB:</span> {formatDate(employee.dob)}
                  </div>
                  <div>
                    <span className="text-gray-600">Emergency Contacts:</span> {employee.emergencyContacts?.length || 0}
                  </div>
                </div>

                {/* Medical Info Summary */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {employee.allergies && employee.allergies.length > 0 && (
                    <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{employee.allergies.length} allerg{employee.allergies.length === 1 ? 'y' : 'ies'}</span>
                    </div>
                  )}
                  {employee.medications && employee.medications.length > 0 && (
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      <Heart className="h-3 w-3" />
                      <span>{employee.medications.length} medication{employee.medications.length === 1 ? '' : 's'}</span>
                    </div>
                  )}
                  {employee.emergencyContacts && employee.emergencyContacts.length > 0 && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <Phone className="h-3 w-3" />
                      <span>{employee.emergencyContacts.length} contact{employee.emergencyContacts.length === 1 ? '' : 's'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleGenerateQR(employee)}
                  disabled={generatingQRId === employee._id}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Download QR Code"
                >
                  {generatingQRId === employee._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <QrCode className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={() => onEditEmployee(employee)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Edit Employee"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDelete(employee._id)}
                  disabled={deletingId === employee._id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete Employee"
                >
                  {deletingId === employee._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && employees.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;