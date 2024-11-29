import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Settings as SettingsType } from '../types';
import { Users, IndianRupee } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState<SettingsType>({
    numberOfPeople: 1,
    dailyLimitPerPerson: 200
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as SettingsType);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of People</label>
          <div className="mt-1 relative">
            <input
              type="number"
              value={settings.numberOfPeople}
              onChange={(e) => setSettings({ ...settings, numberOfPeople: Number(e.target.value) })}
              min="1"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Users className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Daily Limit Per Person (₹)</label>
          <div className="mt-1 relative">
            <input
              type="number"
              value={settings.dailyLimitPerPerson}
              onChange={(e) => setSettings({ ...settings, dailyLimitPerPerson: Number(e.target.value) })}
              min="0"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <IndianRupee className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;