import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings as SettingsIcon, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md fixed bottom-0 left-0 right-0 md:static md:bottom-auto z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 md:space-x-8 overflow-x-auto w-full md:w-auto py-2 md:py-0 no-scrollbar">
            <Link
              to="/"
              className={`inline-flex flex-col md:flex-row items-center px-1 pt-1 min-w-[4rem] md:min-w-0 transition-colors ${
                isActive('/') 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Home className="h-5 w-5 mb-1 md:mb-0 md:mr-2" />
              <span className="text-xs md:text-sm">Dashboard</span>
            </Link>
            <Link
              to="/add"
              className={`inline-flex flex-col md:flex-row items-center px-1 pt-1 min-w-[4rem] md:min-w-0 transition-colors ${
                isActive('/add')
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <PlusCircle className="h-5 w-5 mb-1 md:mb-0 md:mr-2" />
              <span className="text-xs md:text-sm">Add</span>
            </Link>
            <Link
              to="/entries"
              className={`inline-flex flex-col md:flex-row items-center px-1 pt-1 min-w-[4rem] md:min-w-0 transition-colors ${
                isActive('/entries')
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <List className="h-5 w-5 mb-1 md:mb-0 md:mr-2" />
              <span className="text-xs md:text-sm">Entries</span>
            </Link>
            <Link
              to="/settings"
              className={`inline-flex flex-col md:flex-row items-center px-1 pt-1 min-w-[4rem] md:min-w-0 transition-colors ${
                isActive('/settings')
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <SettingsIcon className="h-5 w-5 mb-1 md:mb-0 md:mr-2" />
              <span className="text-xs md:text-sm">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;