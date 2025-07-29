import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { motion } from 'framer-motion';
import workOrderService, { workOrderServiceMock } from '../services/workorders';

export default function WorkOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTask } = useTasks();
  
  // Form state
  const [formData, setFormData] = useState({
    // Klantgegevens
    customerName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    
    // Werkorderinformatie
    description: '',
    date: new Date().toISOString().split('T')[0],
    
    // Artikellijst
    items: [
      { name: '', quantity: 1, price: 0, vatPercentage: 21 }
    ],
    
    // Overige
    notes: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const vatAmount = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price * (item.vatPercentage / 100));
    }, 0);

    return {
      subtotal: subtotal,
      vatAmount: vatAmount,
      total: subtotal + vatAmount
    };
  };

  const totals = calculateTotals();

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Klantnaam is verplicht';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefoonnummer is verplicht';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Omschrijving van het werk is verplicht';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item${index}Name`] = 'Artikelnaam is verplicht';
      }
      if (item.quantity <= 0) {
        newErrors[`item${index}Quantity`] = 'Aantal moet groter zijn dan 0';
      }
      if (item.price < 0) {
        newErrors[`item${index}Price`] = 'Prijs kan niet negatief zijn';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));

    // Clear error
    const errorKey = `item${index}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0, vatPercentage: 21 }]
    }));
  };

  // Remove item
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create work order data
      const workOrderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        description: formData.description,
        date: formData.date,
        items: formData.items,
        notes: formData.notes,
        totals
      };

      // Try to create work order via backend, fallback to mock
      let result;
      try {
        result = await workOrderService.createWorkOrder(workOrderData);
      } catch (error) {
        console.log('Backend failed, using mock service');
        result = await workOrderServiceMock.createWorkOrder(workOrderData);
      }

      // Create task from work order
      const taskData = {
        title: `Werkorder: ${formData.customerName}`,
        description: `Klant: ${formData.customerName}\nTelefoon: ${formData.phone}\n\nWerk: ${formData.description}\n\nArtikelen:\n${formData.items.map(item => 
          `- ${item.name}: ${item.quantity}x €${item.price.toFixed(2)} (${item.vatPercentage}% BTW)`
        ).join('\n')}\n\nTotaal: €${totals.total.toFixed(2)}\n\nOpmerkingen: ${formData.notes || 'Geen'}`,
        status: 'open',
        userId: user?.id || 1 // Default to admin if no user
      };

      // Add task
      await addTask(taskData);

      // Show success message
      alert(result.message || 'Werkorder succesvol aangemaakt en toegevoegd aan taken!');
      
      // Navigate to tasks page
      if (user?.role === 'admin') {
        navigate('/admin/tasks');
      } else {
        navigate('/user/tasks');
      }

    } catch (error) {
      console.error('Error creating work order:', error);
      alert('Er is een fout opgetreden bij het aanmaken van de werkorder.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-navy mb-2">📋 Werkorder Aanmaken</h1>
          <p className="text-gray-600">Maak een nieuwe werkorder aan die automatisch wordt toegevoegd aan de taken</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          {/* Klantgegevens */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              👤 Klantgegevens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klantnaam *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Naam van de klant"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Telefoonnummer *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="06-12345678"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 E-mailadres
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="klant@email.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Datum
                </label>
                <input
                  type="date"
                  value={formData.date}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏠 Adres
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Straat en huisnummer"
                  />
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Postcode"
                  />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Plaats"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Werkorderinformatie */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              🔧 Werkorderinformatie
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Korte omschrijving van het werk *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Beschrijf kort wat er moet gebeuren..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Artikellijst */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                📦 Artikellijst
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + Artikel toevoegen
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artikelnaam *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item${index}Name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Naam van het artikel"
                    />
                    {errors[`item${index}Name`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item${index}Name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aantal
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item${index}Quantity`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item${index}Quantity`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item${index}Quantity`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prijs per stuk (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item${index}Price`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item${index}Price`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item${index}Price`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BTW (%)
                    </label>
                    <select
                      value={item.vatPercentage}
                      onChange={(e) => handleItemChange(index, 'vatPercentage', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>0%</option>
                      <option value={9}>9%</option>
                      <option value={21}>21%</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Totaal
                      </label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                        <div className="text-sm text-gray-600">€{(item.quantity * item.price).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">+ €{(item.quantity * item.price * (item.vatPercentage / 100)).toFixed(2)} BTW</div>
                      </div>
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totaalprijs */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Totaalprijs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Subtotaal (excl. BTW)</div>
                <div className="text-2xl font-bold text-gray-900">€{totals.subtotal.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">BTW</div>
                <div className="text-2xl font-bold text-blue-600">€{totals.vatAmount.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Totaal (incl. BTW)</div>
                <div className="text-3xl font-bold text-green-600">€{totals.total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Opmerkingen */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Opmerkingen
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Extra opmerkingen of bijzonderheden..."
            />
          </div>

          {/* Actieknoppen */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Bezig met opslaan...' : '💾 Werkorder opslaan'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🖨️ Printen
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
} 