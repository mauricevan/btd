import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCustomers } from '../../context/CustomerContext';
import CustomerFormComponent from '../../components/CustomerForm';

const CustomerForm = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const { 
    selectedCustomer, 
    loading, 
    error, 
    loadCustomer, 
    addCustomer, 
    updateCustomer 
  } = useCustomers();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check admin access
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  // Load customer data if editing
  useEffect(() => {
    if (id && id !== 'new') {
      loadCustomer(id);
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      if (id && id !== 'new') {
        // Update existing customer
        const success = await updateCustomer(id, formData);
        if (success) {
          setSuccessMessage('Klant succesvol bijgewerkt');
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate(`/admin/customers/${id}`);
          }, 2000);
        }
      } else {
        // Add new customer
        const newCustomer = await addCustomer(formData);
        if (newCustomer) {
          setSuccessMessage('Klant succesvol toegevoegd');
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/admin/customers');
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleCancel = () => {
    if (id && id !== 'new') {
      navigate(`/admin/customers/${id}`);
    } else {
      navigate('/admin/customers');
    }
  };

  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {id && id !== 'new' ? 'Terug naar klant' : 'Terug naar klanten'}
          </button>
          <h1 className="text-3xl font-bold text-navy">
            {id && id !== 'new' ? 'Klant Bewerken' : 'Nieuwe Klant Toevoegen'}
          </h1>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {loading && id && id !== 'new' ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        ) : (
          <CustomerFormComponent
            customer={id && id !== 'new' ? selectedCustomer : null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerForm; 