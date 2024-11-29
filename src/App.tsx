import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import Settings from './components/Settings';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import { Home, PlusCircle, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const Navigation = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/add"
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Expense
            </Link>
            <Link
              to="/settings"
              className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
            >
              <SettingsIcon className="h-5 w-5 mr-2" />
              Settings
            </Link>
          </div>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/add" element={<PrivateRoute><ExpenseForm /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;