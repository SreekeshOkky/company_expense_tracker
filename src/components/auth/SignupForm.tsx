import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const isValidDomain = (email: string) => {
    return email.toLowerCase().endsWith('@cambiumnetworks.com');
  };

  const getErrorMessage = (error: any): string => {
    if (error.code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please sign in or use a different email address.';
    }
    if (error.code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (error.code === 'auth/weak-password') {
      return 'Password should be at least 6 characters long and include a mix of letters and numbers.';
    }
    if (error.code === 'auth/operation-not-allowed') {
      return 'Account creation is temporarily disabled. Please try again later.';
    }
    if (error.code === 'auth/network-request-failed') {
      return 'Network error. Please check your internet connection and try again.';
    }
    return 'Something went wrong. Please try again later.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    try {
      // Validate email domain
      if (!isValidDomain(email)) {
        setError('Please use your @cambiumnetworks.com email address');
        setIsChecking(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsChecking(false);
        return;
      }

      // Check if email exists
      const emailExists = await validateEmail(email);
      if (emailExists) {
        setError('This email is already registered. Please sign in or use a different email address.');
        setIsChecking(false);
        return;
      }

      await signUp(email, password);
      navigate('/');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account using your Cambium Networks email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="your.name@cambiumnetworks.com"
                pattern=".+@cambiumnetworks\.com$"
                title="Please use your @cambiumnetworks.com email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min. 6 characters)"
                minLength={6}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Requirements:</p>
            <ul className="list-disc list-inside ml-2 mt-1">
              <li>Must use @cambiumnetworks.com email</li>
              <li>Password at least 6 characters long</li>
              <li>Mix of letters and numbers recommended</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={isChecking}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {isChecking ? 'Creating Account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;