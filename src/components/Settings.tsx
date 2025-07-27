import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { User, Database, Download, Trash2, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { customers, products, tasks, invoices } = useData();
  const [showClearData, setShowClearData] = useState(false);

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Note: This would need to be implemented with Firebase batch delete operations
      alert('Data clearing functionality needs to be implemented with Firebase batch operations.');
    }
  };

  const exportAllData = () => {
    const data = {
      customers,
      products,
      tasks,
      invoices,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = [
    { name: 'Total Customers', value: customers.length },
    { name: 'Total Products', value: products.length },
    { name: 'Total Tasks', value: tasks.length },
    { name: 'Total Invoices', value: invoices.length }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your account settings and system preferences for internal team use
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Information
          </h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Display Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.displayName || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.uid}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* System Statistics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Statistics
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Data Management */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Management
          </h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-500 mb-3">
              Download a complete backup of all your CRM data in JSON format.
            </p>
            <button
              onClick={exportAllData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </button>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
              Danger Zone
            </h4>
            <p className="text-sm text-gray-500 mb-3">
              Clear all data from the system. This action cannot be undone. (Firebase implementation required)
            </p>
            {showClearData ? (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700">
                    Are you absolutely sure? This will permanently delete all customers, 
                    products, tasks, and invoices from Firebase. This action cannot be undone.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleClearAllData}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Yes, Clear All Data
                  </button>
                  <button
                    onClick={() => setShowClearData(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearData(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Information</h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Version</dt>
              <dd className="mt-1 text-sm text-gray-900">Spectra CRM v2.0.0</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data Storage</dt>
              <dd className="mt-1 text-sm text-gray-900">Firebase Firestore</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Authentication</dt>
              <dd className="mt-1 text-sm text-gray-900">Firebase Auth</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Environment</dt>
              <dd className="mt-1 text-sm text-gray-900">Production</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Settings;