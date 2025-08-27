import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';

// ✅ Set backend API base URL once
axios.defaults.baseURL = "http://localhost:5000/api";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
}

interface Physician {
  name: string;
  phone: string;
  specialty?: string;
}

interface Insurance {
  provider: string;
  memberId: string;
  groupNumber?: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  dob: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  physician: Physician;
  insurance: Insurance;
  qrCodeUrl?: string;
  medicalConditions?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EmployeeContextType {
  employees: Employee[];
  currentEmployee: Employee | null;
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: string) => Promise<Employee>;
  createEmployee: (employee: Omit<Employee, '_id'>) => Promise<Employee>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  generateQRCode: (id: string) => Promise<string>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Add request cancellation support
  const [currentRequest, setCurrentRequest] = useState<AbortController | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchEmployees = useCallback(async () => {
    // Cancel previous request if still pending
    if (currentRequest) {
      currentRequest.abort();
    }

    const controller = new AbortController();
    setCurrentRequest(controller);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/employees', {
        signal: controller.signal
      });
      setEmployees(response.data.data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was cancelled, don't set error
        return;
      }
      setError(error.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
      setCurrentRequest(null);
    }
  }, []); // ✅ Empty dependency array - this function doesn't depend on any state

  const fetchEmployee = useCallback(async (id: string): Promise<Employee> => {
    // Cancel previous request if still pending
    if (currentRequest) {
      currentRequest.abort();
    }

    const controller = new AbortController();
    setCurrentRequest(controller);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/employees/${id}`, {
        signal: controller.signal
      });
      const employee = response.data.data;
      setCurrentEmployee(employee);
      return employee;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      setCurrentRequest(null);
    }
  }, []); // ✅ Empty dependency array

  const createEmployee = useCallback(async (employeeData: Omit<Employee, '_id'>): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/employees', employeeData);
      const newEmployee = response.data.data;
      
      // ✅ Use functional update to avoid stale closure
      setEmployees(prev => [newEmployee, ...prev]);
      return newEmployee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty dependency array

  const updateEmployee = useCallback(async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/employees/${id}`, employeeData);
      const updatedEmployee = response.data.data;
      
      // ✅ Use functional update
      setEmployees(prev => prev.map(emp => emp._id === id ? updatedEmployee : emp));
      
      // Update current employee if it's the one being updated
      if (currentEmployee?._id === id) {
        setCurrentEmployee(updatedEmployee);
      }
      
      return updatedEmployee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentEmployee?._id]); // ✅ Only depend on currentEmployee._id

  const deleteEmployee = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/employees/${id}`);
      
      // ✅ Use functional update
      setEmployees(prev => prev.filter(emp => emp._id !== id));
      
      // Clear current employee if it's the one being deleted
      if (currentEmployee?._id === id) {
        setCurrentEmployee(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentEmployee?._id]); // ✅ Only depend on currentEmployee._id

  const generateQRCode = useCallback(async (id: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/employees/${id}/qr`);
      return response.data.data.qrCodeDataUrl;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate QR code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty dependency array

  // ✅ Memoize the context value to prevent unnecessary re-renders
  const value: EmployeeContextType = React.useMemo(() => ({
    employees,
    currentEmployee,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateQRCode,
    loading,
    error,
    clearError
  }), [
    employees,
    currentEmployee,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateQRCode,
    loading,
    error,
    clearError
  ]);

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};