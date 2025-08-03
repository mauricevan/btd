import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerService } from '../services/customers';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Laad alle klanten
  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Laad één klant
  const loadCustomer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomer(id);
      setSelectedCustomer(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Voeg nieuwe klant toe
  const addCustomer = async (customerData) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await customerService.addCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update klant
  const updateCustomer = async (id, customerData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCustomer = await customerService.updateCustomer(id, customerData);
      setCustomers(prev => prev.map(c => c.id === parseInt(id) ? updatedCustomer : c));
      if (selectedCustomer && selectedCustomer.id === parseInt(id)) {
        setSelectedCustomer(updatedCustomer);
      }
      return updatedCustomer;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verwijder klant
  const deleteCustomer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== parseInt(id)));
      if (selectedCustomer && selectedCustomer.id === parseInt(id)) {
        setSelectedCustomer(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Zoek klanten
  const searchCustomers = async (query) => {
    if (!query.trim()) {
      await loadCustomers();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const results = await customerService.searchCustomers(query);
      setCustomers(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter klanten op type
  const filterCustomersByType = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const results = await customerService.filterCustomersByType(type);
      setCustomers(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Voeg notitie toe
  const addNote = async (customerId, note) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCustomer = await customerService.addNote(customerId, note);
      setCustomers(prev => prev.map(c => c.id === parseInt(customerId) ? updatedCustomer : c));
      if (selectedCustomer && selectedCustomer.id === parseInt(customerId)) {
        setSelectedCustomer(updatedCustomer);
      }
      return updatedCustomer;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Clear selected customer
  const clearSelectedCustomer = () => setSelectedCustomer(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const value = {
    customers,
    selectedCustomer,
    loading,
    error,
    loadCustomers,
    loadCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    filterCustomersByType,
    addNote,
    clearError,
    clearSelectedCustomer,
    setSelectedCustomer
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
} 