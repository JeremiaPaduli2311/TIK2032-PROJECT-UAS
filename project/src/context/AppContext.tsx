import React, { createContext, useState, useEffect } from 'react';
import { SleepSession, AppContextType } from '../types';

const defaultContextValue: AppContextType = {
  sleepSessions: [],
  addSleepSession: () => {},
  deleteSleepSession: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load sleep sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('sleepSessions');
    if (savedSessions) {
      setSleepSessions(JSON.parse(savedSessions));
    }
    
    // Check for system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Save sleep sessions to localStorage when updated
  useEffect(() => {
    localStorage.setItem('sleepSessions', JSON.stringify(sleepSessions));
  }, [sleepSessions]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const addSleepSession = (session: Omit<SleepSession, 'id'>) => {
    const newSession: SleepSession = {
      ...session,
      id: Date.now().toString(),
    };
    
    setSleepSessions(prev => [newSession, ...prev]);
  };

  const deleteSleepSession = (id: string) => {
    setSleepSessions(prev => prev.filter(session => session.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider 
      value={{ 
        sleepSessions, 
        addSleepSession, 
        deleteSleepSession,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};