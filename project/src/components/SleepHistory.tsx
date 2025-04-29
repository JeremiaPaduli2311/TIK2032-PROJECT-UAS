import React, { useState } from 'react';
import { Trash2, ClipboardList, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';

import useAppContext from '../hooks/useAppContext';
import { formatTime, formatDuration, getSleepQualityMessage, getSleepQualityColor } from '../utils/timeUtils';
import { SleepSession } from '../types';

const SleepHistory: React.FC = () => {
  const { sleepSessions, deleteSleepSession } = useAppContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (sleepSessions.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <ClipboardList className="text-purple-500" size={24} />
          <h2 className="text-xl font-semibold text-navy-800 dark:text-white">Sleep History</h2>
        </div>
        <div className="text-center py-6 text-navy-600 dark:text-navy-300">
          No sleep records yet. Start tracking your sleep!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <ClipboardList className="text-purple-500" size={24} />
        <h2 className="text-xl font-semibold text-navy-800 dark:text-white">Sleep History</h2>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {sleepSessions.map((session) => (
            <motion.div
              key={session.id}
              className="border border-navy-100 dark:border-navy-700 rounded-lg overflow-hidden"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div 
                className="p-4 bg-navy-50 dark:bg-navy-800 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(session.id)}
              >
                <div>
                  <span className="font-medium text-navy-800 dark:text-white">
                    {format(parseISO(session.date), 'MMM d, yyyy')}
                  </span>
                  <div className="text-sm flex gap-2 items-center">
                    <span className="text-navy-600 dark:text-navy-300">
                      {formatDuration(session.totalMinutes)}
                    </span>
                    <span className={`text-xs font-medium ${getSleepQualityColor(session.totalMinutes)}`}>
                      {getSleepQualityMessage(session.totalMinutes)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSleepSession(session.id);
                    }}
                    className="p-2 text-navy-600 dark:text-navy-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mr-2"
                    aria-label="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                  {expandedId === session.id ? (
                    <ChevronDown size={20} className="text-navy-600 dark:text-navy-300" />
                  ) : (
                    <ChevronRight size={20} className="text-navy-600 dark:text-navy-300" />
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedId === session.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white dark:bg-navy-900 border-t border-navy-100 dark:border-navy-700">
                      <h4 className="font-medium text-sm text-navy-700 dark:text-navy-200 mb-2">
                        Sleep Periods:
                      </h4>
                      <div className="space-y-2">
                        {session.sessions.map((period, index) => (
                          <div key={index} className="text-sm flex justify-between bg-navy-50 dark:bg-navy-800 p-2 rounded">
                            <div>
                              <span className="text-navy-700 dark:text-navy-200">
                                {format(parseISO(period.start), 'MMM d, h:mm a')}
                              </span>
                              {' → '}
                              <span className="text-navy-700 dark:text-navy-200">
                                {format(parseISO(period.end), 'MMM d, h:mm a')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {session.notes && (
                        <div className="mt-3">
                          <h4 className="font-medium text-sm text-navy-700 dark:text-navy-200 mb-1">
                            Notes:
                          </h4>
                          <p className="text-sm text-navy-600 dark:text-navy-300 bg-navy-50 dark:bg-navy-800 p-2 rounded">
                            {session.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SleepHistory;