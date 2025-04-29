import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import SleepCalculator from './components/SleepCalculator';
import SleepHistory from './components/SleepHistory';
import SleepStats from './components/SleepStats';
import useAppContext from './hooks/useAppContext';

function App() {
  const { isDarkMode, toggleDarkMode } = useAppContext();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-stars bg-navy-50 dark:bg-navy-900 pb-10">
      <header className="relative backdrop-blur-sm bg-white/80 dark:bg-navy-800/80 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="text-purple-500"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <Moon size={28} />
            </motion.div>
            <h1 className="text-2xl font-semibold text-navy-800 dark:text-white">
              Slumber<span className="text-purple-500">Stats</span>
            </h1>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-800 dark:text-white transition-all duration-300 hover:scale-110"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SleepCalculator />
            
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SleepHistory />
              <SleepStats />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;