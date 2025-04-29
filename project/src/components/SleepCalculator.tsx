import React, { useState } from 'react';
import { Plus, Trash2, Save, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';

import useAppContext from '../hooks/useAppContext';
import { calculateTotalSleepMinutes, formatDuration, getCurrentTime } from '../utils/timeUtils';

interface SleepPeriod {
  id: string;
  start: string;
  end: string;
}

const SleepCalculator: React.FC = () => {
  const { addSleepSession } = useAppContext();
  const [sleepPeriods, setSleepPeriods] = useState<SleepPeriod[]>([
    { id: '1', start: getCurrentTime(), end: getCurrentTime() }
  ]);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const addSleepPeriod = () => {
    const newPeriod: SleepPeriod = {
      id: Date.now().toString(),
      start: getCurrentTime(),
      end: getCurrentTime(),
    };
    setSleepPeriods([...sleepPeriods, newPeriod]);
  };

  const removeSleepPeriod = (id: string) => {
    if (sleepPeriods.length > 1) {
      setSleepPeriods(sleepPeriods.filter(period => period.id !== id));
    }
  };

  const updateSleepPeriod = (id: string, field: 'start' | 'end', value: string) => {
    setSleepPeriods(
      sleepPeriods.map(period => 
        period.id === id ? { ...period, [field]: value } : period
      )
    );
  };

  const handleSave = () => {
    // Format the periods for storage
    const formattedPeriods = sleepPeriods.map(period => ({
      start: period.start,
      end: period.end
    }));
    
    // Calculate total sleep time
    const totalMinutes = calculateTotalSleepMinutes(formattedPeriods);
    
    // Save the session
    addSleepSession({
      sessions: formattedPeriods,
      date: new Date().toISOString(),
      totalMinutes,
      notes: notes.trim() || undefined
    });
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setSleepPeriods([{ id: '1', start: getCurrentTime(), end: getCurrentTime() }]);
    setNotes('');
  };

  // Calculate total sleep time for display
  const totalMinutes = calculateTotalSleepMinutes(
    sleepPeriods.map(period => ({ start: period.start, end: period.end }))
  );

  return (
    <motion.div 
      className="card max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <Moon className="text-purple-500" size={24} />
        <h2 className="text-xl font-semibold text-navy-800 dark:text-white">Sleep Calculator</h2>
      </div>
      
      <div className="space-y-4">
        {sleepPeriods.map((period, index) => (
          <motion.div 
            key={period.id}
            className="sleep-session p-3 rounded-lg bg-navy-50 dark:bg-navy-700 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div>
                <label className="block text-sm text-navy-600 dark:text-navy-200 mb-1">
                  Fell asleep at
                </label>
                <input
                  type="datetime-local"
                  className="input-field w-full time-input"
                  value={period.start}
                  onChange={(e) => updateSleepPeriod(period.id, 'start', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-navy-600 dark:text-navy-200 mb-1">
                  Woke up at
                </label>
                <input
                  type="datetime-local"
                  className="input-field w-full time-input"
                  value={period.end}
                  onChange={(e) => updateSleepPeriod(period.id, 'end', e.target.value)}
                />
              </div>
            </div>
            
            <button
              onClick={() => removeSleepPeriod(period.id)}
              className="p-2 text-navy-600 dark:text-navy-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              disabled={sleepPeriods.length === 1}
              aria-label="Remove sleep period"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={addSleepPeriod}
          className="flex items-center text-sm text-purple-500 hover:text-purple-700 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Add another sleep period
        </button>
        
        <div className="text-right">
          <div className="text-sm text-navy-600 dark:text-navy-300">Total sleep time:</div>
          <div className="text-xl font-semibold text-purple-500">{formatDuration(totalMinutes)}</div>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm text-navy-600 dark:text-navy-200 mb-1">
          Notes (optional)
        </label>
        <textarea
          className="input-field w-full resize-none"
          rows={2}
          placeholder="How did you sleep? Any dreams?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center">
          <Save size={16} className="mr-2" />
          Save Sleep Record
        </button>
      </div>
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Sleep record saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SleepCalculator;