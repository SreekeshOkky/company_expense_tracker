import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseEntries from './components/ExpenseEntries';
import Settings from './components/Settings';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import Navigation from './components/Navigation';
import InstallPWA from './components/InstallPWA';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
          <Navigation />
          <InstallPWA />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/add" element={<PrivateRoute><ExpenseForm /></PrivateRoute>} />
              <Route path="/entries" element={<PrivateRoute><ExpenseEntries /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;