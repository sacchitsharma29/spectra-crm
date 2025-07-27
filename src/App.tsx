import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import Installations from './components/Installations';
import Analytics from './components/Analytics';
import Invoices from './components/Invoices';
import Settings from './components/Settings';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="installations" element={<Installations />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;