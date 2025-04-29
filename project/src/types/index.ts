export interface SleepSession {
  id: string;
  sessions: {
    start: string; // ISO string
    end: string; // ISO string
  }[];
  date: string; // ISO string of the date
  totalMinutes: number;
  notes?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppContextType {
  sleepSessions: SleepSession[];
  addSleepSession: (session: Omit<SleepSession, 'id'>) => void;
  deleteSleepSession: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}