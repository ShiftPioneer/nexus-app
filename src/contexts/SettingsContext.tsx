import React, { createContext, useContext, ReactNode } from 'react';
import { useSettingsStorage, ISettings } from '@/hooks/use-settings-storage';

interface SettingsContextType {
  settings: ISettings;
  updateSettings: (category: keyof ISettings, updates: Partial<ISettings[keyof ISettings]>) => Promise<{ success: boolean; error?: string }>;
  saveSettings: (newSettings: ISettings) => Promise<{ success: boolean; error?: string }>;
  resetSettings: () => Promise<{ success: boolean; error?: string }>;
  exportSettings: () => void;
  isLoading: boolean;
  defaults: ISettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const settingsStorage = useSettingsStorage();

  return (
    <SettingsContext.Provider value={settingsStorage}>
      {children}
    </SettingsContext.Provider>
  );
};