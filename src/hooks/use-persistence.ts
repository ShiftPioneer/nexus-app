
import { useEffect } from 'react';

// This hook ensures data persistence across sessions
export const usePersistence = (key: string, data: any, deps: any[] = []) => {
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, data, ...deps]);
};

// Helper function to load data from localStorage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};
