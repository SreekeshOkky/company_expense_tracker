import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { WeeklyExpense, Settings } from '../types';
import { Download, TrendingUp, Wallet, AlertCircle, ChevronDown, ChevronUp, User } from 'lucide-react';
import { fetchWeeklyExpenses, fetchSettings, ExpenseWithUser } from '../lib/expenseService';
import ExpenseChart from './ExpenseChart';

const Dashboard = () => {
  const [weeklyExpense, setWeeklyExpense] = useState<WeeklyExpense>({
    total: 0,
    remaining: 0,
    dailyRemaining: 0,
    days: {}
  });
  const [settings, setSettings] = useState<Settings>({ numberOfPeople: 1, dailyLimitPerPerson: 200 });
  const [expandedDays, setExpandedDays] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const settingsData = await fetchSettings();
      setSettings(settingsData);
      const weeklyData = await fetchWeeklyExpenses(settingsData);
      setWeeklyExpense(weeklyData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleDay = (date: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const downloadReport = () => {
    const dataStr = JSON.stringify(weeklyExpense, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `expense-report-${format(new Date(), 'yyyy-MM')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderMealExpenses = (expenses: ExpenseWithUser[]) => {
    if (expenses.length === 0) return <div className="text-gray-500">No expenses</div>;

    return expenses.map((expense) => (
      <div key={expense.id} className="flex items-center justify-between py-1 border-b last:border-b-0">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm text-gray-600">{expense.userEmail}</span>
        </div>
        <span className="text-sm font-medium">₹{expense.amount}</span>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Today's Remaining</h3>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>
          <p className={`mt-2 text-3xl font-bold ${weeklyExpense.dailyRemaining < 0 ? 'text-red-600' : 'text-orange-600'}`}>
            ₹{weeklyExpense.dailyRemaining}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Weekly Balance</h3>
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
          <p className={`mt-2 text-3xl font-bold ${weeklyExpense.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₹{weeklyExpense.remaining}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Weekly Total</h3>
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">₹{weeklyExpense.total}</p>
        </div>
      </div>

      <ExpenseChart weeklyData={weeklyExpense.days} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Daily Breakdown</h3>
          <div className="flex space-x-4">
            <button
              onClick={loadData}
              className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={downloadReport}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(weeklyExpense.days)
            .sort(([dateA], [dateB]) => parseISO(dateA).getTime() - parseISO(dateB).getTime())
            .map(([date, data]) => (
            <div key={date} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDay(date)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <h4 className="font-medium">{format(new Date(date), 'EEEE, MMM d')}</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-indigo-600">₹{data.total}</div>
                    <div className={`text-sm ${data.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Remaining: ₹{data.remaining}
                    </div>
                  </div>
                  {expandedDays[date] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedDays[date] && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Morning</h5>
                      {renderMealExpenses((data as any).meals.morning)}
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Lunch</h5>
                      {renderMealExpenses((data as any).meals.lunch)}
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Evening</h5>
                      {renderMealExpenses((data as any).meals.evening)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;