import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, isAfter } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Calendar, Clock, IndianRupee, User, TrendingUp } from 'lucide-react';
import { fetchExpensesByWeek, deleteExpense, updateExpense } from '../lib/expenseService';
import { Expense } from '../types';

const ExpenseEntries = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyTotal, setWeeklyTotal] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, [currentWeek]);

  const loadExpenses = async () => {
    setIsLoading(true);
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const data = await fetchExpensesByWeek(weekStart);
    
    // Calculate weekly total
    const total = data.reduce((sum, expense) => sum + expense.amount, 0);
    setWeeklyTotal(total);
    
    setExpenses(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
      await loadExpenses();
    }
  };

  const handleEdit = async (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      await updateExpense(editingExpense.id, editingExpense);
      setEditingExpense(null);
      await loadExpenses();
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1);
    
    // Prevent navigation to future weeks
    if (isAfter(startOfWeek(newDate, { weekStartsOn: 1 }), startOfWeek(new Date(), { weekStartsOn: 1 }))) {
      return;
    }
    
    setCurrentWeek(newDate);
  };

  const EditForm = ({ expense }: { expense: Expense }) => (
    <form onSubmit={handleUpdate} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={editingExpense.date}
            onChange={e => setEditingExpense({...editingExpense, date: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal</label>
          <select
            value={editingExpense.meal}
            onChange={e => setEditingExpense({...editingExpense, meal: e.target.value as 'morning' | 'lunch' | 'evening'})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="morning">Morning</option>
            <option value="lunch">Lunch</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={editingExpense.amount}
            onChange={e => setEditingExpense({...editingExpense, amount: Number(e.target.value)})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingExpense(null)}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Expense Entries</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">
            Week of {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={isAfter(startOfWeek(addWeeks(currentWeek, 1), { weekStartsOn: 1 }), startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekly Summary Widget */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Weekly Total</h3>
          <TrendingUp className="h-5 w-5 text-indigo-600" />
        </div>
        <p className="mt-2 text-3xl font-bold text-indigo-600">₹{weeklyTotal}</p>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map(expense => (
              <tr key={expense.id}>
                {editingExpense?.id === expense.id ? (
                  <td colSpan={5}>
                    <EditForm expense={expense} />
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {expense.meal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {expenses.map(expense => (
          <div key={expense.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {editingExpense?.id === expense.id ? (
              <EditForm expense={expense} />
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900 capitalize">{expense.meal}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">₹{expense.amount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{expense.userEmail}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseEntries;