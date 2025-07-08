import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../store/userSlice';
import { AppDispatch } from '../store/index';
import { UserFormData } from '../types';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  general?: string;
}

const CreateUser: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validateField = (name: keyof UserFormData, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return !/^[A-Za-z]+$/.test(value) ? 'Must contain only letters' :
               value.length > 100 ? 'Must be 100 characters or less' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Must be a valid email address' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name as keyof UserFormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const fieldKey = key as keyof UserFormData;
      const error = validateField(fieldKey, formData[fieldKey]);
      if (error) newErrors[fieldKey] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(createUser(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      setErrors({general: error})
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto" data-testid="success-message">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <div className="text-green-700 text-lg font-semibold mb-2">Success!</div>
          <div className="text-gray-600">User created successfully! Redirecting to users list...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto" data-testid="create-user-form">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="user-form">
        <div>
          <label htmlFor="firstName" className="block mb-2 font-semibold text-gray-700">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter first name"
            data-testid="first-name-input"
            required
          />
          {errors.firstName && <div className="text-red-500 text-sm mt-1 flex items-center" data-testid="first-name-error">⚠️ {errors.firstName}</div>}
        </div>

        <div>
          <label htmlFor="lastName" className="block mb-2 font-semibold text-gray-700">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter last name"
            data-testid="last-name-input"
            required
          />
          {errors.lastName && <div className="text-red-500 text-sm mt-1 flex items-center" data-testid="last-name-error">⚠️ {errors.lastName}</div>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter email address"
            data-testid="email-input"
            required
          />
          {errors.email && <div className="text-red-500 text-sm mt-1 flex items-center" data-testid="email-error">⚠️ {errors.email}</div>}
        </div>

        {errors.general && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-200" data-testid="general-error">⚠️ {errors.general}</div>}

        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all transform hover:scale-105"
          data-testid="submit-button"
        >
          ✨ Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
