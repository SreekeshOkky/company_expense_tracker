export interface Expense {
  id: string;
  date: string;
  meal: 'morning' | 'lunch' | 'evening';
  amount: number;
  createdAt: Date;
  userId: string;
  synced?: boolean;
}

export interface Settings {
  numberOfPeople: number;
  dailyLimitPerPerson: number;
}

export interface WeeklyExpense {
  total: number;
  remaining: number;
  dailyRemaining: number;
  days: {
    [key: string]: {
      total: number;
      remaining: number;
      meals: {
        morning: number;
        lunch: number;
        evening: number;
      };
    };
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}