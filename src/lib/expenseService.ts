import { collection, query, where, getDocs, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Settings, WeeklyExpense, Expense } from '../types';

export interface ExpenseWithUser {
  id: string;
  amount: number;
  meal: 'morning' | 'lunch' | 'evening';
  userId: string;
  userEmail: string;
}

export interface DayExpenses {
  total: number;
  remaining: number;
  meals: {
    morning: ExpenseWithUser[];
    lunch: ExpenseWithUser[];
    evening: ExpenseWithUser[];
  };
}

export const fetchWeeklyExpenses = async (settings: Settings): Promise<WeeklyExpense> => {
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

  const weeklyData: {
    total: number;
    remaining: number;
    dailyRemaining: number;
    days: { [key: string]: DayExpenses };
  } = {
    total: 0,
    remaining: 0,
    dailyRemaining: 0,
    days: {}
  };

  // Initialize all weekdays
  for (let d = 0; d < 5; d++) {
    const date = format(new Date(start.getTime() + d * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    weeklyData.days[date] = {
      total: 0,
      remaining: settings.numberOfPeople * settings.dailyLimitPerPerson,
      meals: {
        morning: [],
        lunch: [],
        evening: []
      }
    };
  }

  expenses.forEach((expense: any) => {
    const date = expense.date;
    const expenseWithUser: ExpenseWithUser = {
      id: expense.id,
      amount: expense.amount,
      meal: expense.meal,
      userId: expense.userId,
      userEmail: expense.userEmail || 'Unknown User'
    };

    weeklyData.days[date].meals[expense.meal].push(expenseWithUser);
    weeklyData.days[date].total += expense.amount;
    weeklyData.days[date].remaining = (settings.numberOfPeople * settings.dailyLimitPerPerson) - weeklyData.days[date].total;
    weeklyData.total += expense.amount;
  });

  const weeklyLimit = settings.numberOfPeople * settings.dailyLimitPerPerson * 5;
  weeklyData.remaining = weeklyLimit - weeklyData.total;

  // Calculate daily remaining for current day
  const today = format(new Date(), 'yyyy-MM-dd');
  weeklyData.dailyRemaining = weeklyData.days[today]?.remaining || 0;

  return weeklyData as WeeklyExpense;
};

export const fetchSettings = async (): Promise<Settings> => {
  const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
  if (settingsDoc.exists()) {
    return settingsDoc.data() as Settings;
  }
  return { numberOfPeople: 1, dailyLimitPerPerson: 200 };
};

export const fetchExpensesByWeek = async (weekStart: Date): Promise<Expense[]> => {
  const end = endOfWeek(weekStart, { weekStartsOn: 1 });
  
  const q = query(
    collection(db, 'expenses'),
    where('date', '>=', format(weekStart, 'yyyy-MM-dd')),
    where('date', '<=', format(end, 'yyyy-MM-dd'))
  );

  const querySnapshot = await getDocs(q);
  const expenses = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Expense));

  // Sort expenses by date in descending order
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const deleteExpense = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'expenses', id));
};

export const updateExpense = async (id: string, expense: Expense): Promise<void> => {
  const { id: _, ...updateData } = expense;
  await updateDoc(doc(db, 'expenses', id), updateData);
};