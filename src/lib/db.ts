import { openDB } from 'idb';
import { Expense } from '../types';

const DB_NAME = 'food-expense-tracker';
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('expenses')) {
        const store = db.createObjectStore('expenses', { keyPath: 'id' });
        store.createIndex('userId', 'userId');
        store.createIndex('synced', 'synced');
      }
    },
  });
  return db;
};

export const addExpenseOffline = async (expense: Expense) => {
  const db = await initDB();
  await db.add('expenses', { ...expense, synced: false });
};

export const getSyncPendingExpenses = async (userId: string) => {
  const db = await initDB();
  return db.getAllFromIndex('expenses', 'userId', userId);
};

export const markExpenseAsSynced = async (id: string) => {
  const db = await initDB();
  const tx = db.transaction('expenses', 'readwrite');
  const expense = await tx.store.get(id);
  if (expense) {
    await tx.store.put({ ...expense, synced: true });
  }
  await tx.done;
};