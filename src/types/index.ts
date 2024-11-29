export interface Expense {
  id: string;
  date: string;
  meal: 'morning' | 'lunch' | 'dinner';
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
  days: {
    [key: string]: {
      total: number;
      meals: {
        morning: number;
        lunch: number;
        dinner: number;
      };
    };
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}