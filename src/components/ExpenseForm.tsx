import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [meal, setMeal] = useState<'morning' | 'lunch' | 'evening'>('morning');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedDate = new Date(date);
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      alert('Expenses can only be added for weekdays');
      return;
    }

    try {
      const expenseData = {
        amount: Number(amount),
        meal,
        date,
        createdAt: new Date(),
        userId: user?.id,
        userEmail: user?.email
      };

      await addDoc(collection(db, 'expenses'), expenseData);
      trackEvent('ADD_EXPENSE', {
        meal,
        amount: Number(amount),
        date
      });
      
      setAmount('');
      setMeal('morning');
      navigate('/entries');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="mt-1 relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meal</label>
          <div className="mt-1 relative">
            <select
              value={meal}
              onChange={(e) => setMeal(e.target.value as 'morning' | 'lunch' | 'evening')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="morning">Morning</option>
              <option value="lunch">Lunch</option>
              <option value="evening">Evening</option>
            </select>
            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            min="0"
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;