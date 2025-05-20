import React, { useState } from 'react';
import { User, Search, Filter, FileText, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/ui/Button';
import AddPatientForm from '../components/patients/AddPatientForm';
import { patients } from '../utils/mockData';
import type { Patient } from '../types';

const PatientsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const canManagePatients = isAdmin || isDoctor;
  
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleAddPatient = (patientData: Omit<Patient, 'id'>) => {
    // In a real app, this would make an API call
    const newPatient: Patient = {
      id: `patient${patients.length + 1}`,
      ...patientData
    };
    patients.push(newPatient);
    setIsAddingPatient(false);
  };

  const handleDeletePatient = () => {
    if (!patientToDelete) return;
    
    // In a real app, this would make an API call
    const patientIndex = patients.findIndex(p => p.id === patientToDelete.id);
    if (patientIndex !== -1) {
      patients.splice(patientIndex, 1);
    }
    setPatientToDelete(null);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    // In a real app, this would make an API call
    const patientIndex = patients.findIndex(p => p.id === updatedPatient.id);
    if (patientIndex !== -1) {
      patients[patientIndex] = updatedPatient;
    }
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(patient => {
    const searchString = `${patient.firstName} ${patient.lastName} ${patient.email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (!canManagePatients) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900">Access Restricted</h2>
              <p className="mt-2 text-gray-600">Only administrators and doctors can view this page.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
              </div>
              {canManagePatients && (
                <Button 
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsAddingPatient(true)}
                >
                  Add New Patient
                </Button>
              )}
            </div>

            {isAddingPatient || editingPatient ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                </h2>
                <AddPatientForm
                  onSave={editingPatient ? handleUpdatePatient : handleAddPatient}
                  onCancel={() => {
                    setIsAddingPatient(false);
                    setEditingPatient(null);
                  }}
                  initialData={editingPatient}
                />
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      leftIcon={<Filter className="h-4 w-4" />}
                    >
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medical Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          {isAdmin && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Login Details
                            </th>
                          )}
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                  <span className="font-medium text-sm">
                                    {patient.firstName[0]}{patient.lastName[0]}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {patient.firstName} {patient.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {patient.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Blood Type: {patient.bloodType || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{patient.contactNumber}</div>
                              <div className="text-sm text-gray-500">{patient.address}</div>
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{patient.email}</div>
                                {patient.userId && (
                                  <div className="text-sm text-gray-500">Has account</div>
                                )}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {canManagePatients && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mr-2"
                                    leftIcon={<FileText className="h-4 w-4" />}
                                  >
                                    Medical Records
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mr-2"
                                    leftIcon={<Edit2 className="h-4 w-4" />}
                                    onClick={() => setEditingPatient(patient)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    leftIcon={<Trash2 className="h-4 w-4" />}
                                    onClick={() => setPatientToDelete(patient)}
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <Button variant="outline" size="sm">Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to{' '}
                            <span className="font-medium">{filteredPatients.length}</span> of{' '}
                            <span className="font-medium">{filteredPatients.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-l-md"
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-r-md"
                            >
                              Next
                            </Button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Delete Confirmation Modal */}
            {patientToDelete && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Delete Patient
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Are you sure you want to delete {patientToDelete.firstName} {patientToDelete.lastName}? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setPatientToDelete(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDeletePatient}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientsPage;