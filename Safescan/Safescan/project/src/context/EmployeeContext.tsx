import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/employees');
      setEmployees(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployee = async (id: string): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/employees/${id}`);
      const employee = response.data.data;
      setCurrentEmployee(employee);
      return employee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData: Omit<Employee, '_id'>): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/employees', employeeData);
      const newEmployee = response.data.data;
      setEmployees(prev => [newEmployee, ...prev]);
      return newEmployee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/employees/${id}`, employeeData);
      const updatedEmployee = response.data.data;
      setEmployees(prev => prev.map(emp => emp._id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (id: string): Promise<string> => {
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
  };

  const value: EmployeeContextType = {
    employees,
    currentEmployee,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateQRCode,
    loading,
    error
  };

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
