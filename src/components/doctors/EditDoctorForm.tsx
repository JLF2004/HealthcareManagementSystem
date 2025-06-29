import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Doctor } from '../../types';

interface EditDoctorFormProps {
  doctor: Doctor;
  onSave: (doctor: Doctor) => void;
  onCancel: () => void;
}

const EditDoctorForm: React.FC<EditDoctorFormProps> = ({
  doctor,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    specialization: doctor.specialization,
    department: doctor.department,
    contactNumber: doctor.contactNumber,
    email: doctor.email,
    licenseNumber: doctor.licenseNumber,
    availability: [...doctor.availability]
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    department: '',
    contactNumber: '',
    email: '',
    licenseNumber: ''
  });

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      specialization: '',
      department: '',
      contactNumber: '',
      email: '',
      licenseNumber: ''
    };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
      isValid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
      isValid = false;
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...doctor,
        ...formData
      });
    }
  };

  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, availability: newAvailability }));
  };

  const addNewSchedule = () => {
    setFormData(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { day: 'Monday', startTime: '09:00', endTime: '17:00' }
      ]
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          error={errors.firstName}
          required
        />
        
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          error={errors.lastName}
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          required
        />
        
        <Input
          label="Contact Number"
          value={formData.contactNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
          error={errors.contactNumber}
          required
        />
        
        <Input
          label="License Number"
          value={formData.licenseNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
          error={errors.licenseNumber}
          required
        />
        
        <Input
          label="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
          error={errors.specialization}
          required
        />
        
        <Input
          label="Department"
          value={formData.department}
          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          error={errors.department}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Availability</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewSchedule}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Schedule
          </Button>
        </div>
        
        {formData.availability.map((schedule, index) => (
          <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={schedule.day}
                  onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSchedule(index)}
              className="text-red-600 hover:bg-red-50 self-end mb-1"
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Remove
            </Button>
          </div>
        ))}

        {formData.availability.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No availability schedule set. Click "Add Schedule" to add working hours.
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          leftIcon={<X className="h-4 w-4" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditDoctorForm;