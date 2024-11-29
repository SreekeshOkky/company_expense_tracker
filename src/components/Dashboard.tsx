import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { WeeklyExpense, Settings } from '../types';
import { Download, TrendingUp, Wallet } from 'lucide-react';

const Dashboard = () => {
  const [weeklyExpense, setWeeklyExpense] = useState<WeeklyExpense>({
    total: 0,
    remaining: 0,
    days: {}
  });
  const [settings, setSettings] = useState<Settings>({ numberOfPeople: 1, dailyLimitPerPerson: 200 });

  useEffect(() => {
    const fetchData = async () => {
      const start = startOfWeek(new Date(), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(), { weekStartsOn: 1 });

      const q = query(
        collection(db, 'expenses'),
        where('date', '>=', format(start, 'yyyy-MM-dd')),
        where('date', '<=', format(end, 'yyyy-MM-dd'))
      );

      const querySnapshot = await getDocs(q);
      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const weeklyData: WeeklyExpense = {
        total: 0,
        remaining: 0,
        days: {}
      };

      expenses.forEach((expense: any) => {
        const date = expense.date;
        if (!weeklyData.days[date]) {
          weeklyData.days[date] = {
            total: 0,
            meals: { morning: 0, lunch: 0, dinner: 0 }
          };
        }
        weeklyData.days[date].meals[expense.meal] += expense.amount;
        weeklyData.days[date].total += expense.amount;
        weeklyData.total += expense.amount;
      });

      const weeklyLimit = settings.numberOfPeople * settings.dailyLimitPerPerson * 5;
      weeklyData.remaining = weeklyLimit - weeklyData.total;

      setWeeklyExpense(weeklyData);
    };

    fetchData();
  }, [settings]);

  const downloadReport = () => {
    const dataStr = JSON.stringify(weeklyExpense, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `expense-report-${format(new Date(), 'yyyy-MM')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Weekly Total</h3>
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">₹{weeklyExpense.total}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Remaining Budget</h3>
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">₹{weeklyExpense.remaining}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={downloadReport}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Monthly Report
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(weeklyExpense.days).map(([date, data]) => (
            <div key={date} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{format(new Date(date), 'EEEE, MMM d')}</h4>
                <span className="font-bold text-indigo-600">₹{data.total}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>Morning: ₹{data.meals.morning}</div>
                <div>Lunch: ₹{data.meals.lunch}</div>
                <div>Dinner: ₹{data.meals.dinner}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;