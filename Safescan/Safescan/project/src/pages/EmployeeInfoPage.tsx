import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEmployee, Employee } from '../context/EmployeeContext';
import { 
  User, 
  Phone, 
  Heart, 
  Pill, 
  AlertTriangle, 
  UserCheck, 
  Calendar,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const EmployeeInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchEmployee, loading, error } = useEmployee();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) return;
      
      try {
        const employeeData = await fetchEmployee(id);
        setEmployee(employeeData);
        setFetchError(null);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load employee data');
      }
    };

    loadEmployee();
  }, [id, fetchEmployee]);

  const handleCallEmergencyContact = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "N/A";
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading employee information...</p>
        </div>
      </div>
    );
  }

  if (fetchError || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Employee Not Found</h2>
          <p className="text-gray-600 mb-6">
            {fetchError || error || 'The requested employee information could not be found.'}
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Employee Data</h2>
          <p className="text-gray-600 mb-6">
            Employee information is not available at this time.
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{employee.name || "Unknown"}</h1>
              <p className="text-gray-600">Employee ID: {employee.employeeId || "N/A"}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Age: {calculateAge(employee.dob)} years</span>
                </span>
                <span>Born: {formatDate(employee.dob)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                Blood Type: {employee.bloodGroup || "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Medical Information */}
          <div className="space-y-6">
            {/* Allergies */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Allergies</h2>
              </div>
              {employee.allergies?.length ? (
                <div className="space-y-2">
                  {employee.allergies.map((allergy, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <span className="font-medium text-orange-800">{allergy}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No known allergies</p>
              )}
            </div>

            {/* Medications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Pill className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Current Medications</h2>
              </div>
              {employee.medications?.length ? (
                <div className="space-y-3">
                  {employee.medications.map((medication, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="font-semibold text-blue-900">{medication.name}</div>
                      {medication.dosage && (
                        <div className="text-sm text-blue-700 mt-1">Dosage: {medication.dosage}</div>
                      )}
                      {medication.frequency && (
                        <div className="text-sm text-blue-700">Frequency: {medication.frequency}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No current medications</p>
              )}
            </div>

            {/* Medical Conditions */}
            {employee.medicalConditions?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Medical Conditions</h2>
                </div>
                <div className="space-y-2">
                  {employee.medicalConditions.map((condition, index) => (
                    <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <span className="font-medium text-purple-800">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Phone className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
              </div>
              <div className="space-y-4">
                {employee.emergencyContacts?.length ? (
                  employee.emergencyContacts.map((contact, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.relationship}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCallEmergencyContact(contact.phone)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 w-full justify-center"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Call {contact.phone || "N/A"}</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No emergency contacts available</p>
                )}
              </div>
            </div>

            {/* Physician */}
            {employee.physician && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Primary Physician</h2>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">{employee.physician.name || "Unknown"}</div>
                  {employee.physician.specialty && (
                    <div className="text-sm text-gray-600 mb-3">{employee.physician.specialty}</div>
                  )}
                  {employee.physician.phone && (
                    <button
                      onClick={() => handleCallEmergencyContact(employee.physician?.phone)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full justify-center"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call {employee.physician.phone}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {employee.notes && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">{employee.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-6 bg-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">🚨 For Emergency Use Only</h3>
              <p className="text-red-100">
                This information is provided for emergency medical care. Contact emergency services (911) if immediate medical attention is required.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">911</div>
              <div className="text-sm text-red-200">Emergency Services</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoPage;
