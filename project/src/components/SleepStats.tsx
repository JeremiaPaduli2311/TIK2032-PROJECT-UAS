import React from 'react';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import useAppContext from '../hooks/useAppContext';
import { formatDuration } from '../utils/timeUtils';
import { SleepSession } from '../types';

const SleepStats: React.FC = () => {
  const { sleepSessions } = useAppContext();
  
  // Return placeholder if no sleep data
  if (sleepSessions.length === 0) {
    return (
      <div className="card h-full">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="text-purple-500" size={24} />
          <h2 className="text-xl font-semibold text-navy-800 dark:text-white">Sleep Stats</h2>
        </div>
        <div className="text-center py-6 text-navy-600 dark:text-navy-300">
          Your sleep statistics will appear here once you start recording sleep sessions.
        </div>
      </div>
    );
  }
  
  // Calculate average sleep duration
  const averageSleepMinutes = Math.round(
    sleepSessions.reduce((sum, session) => sum + session.totalMinutes, 0) / sleepSessions.length
  );
  
  // Find longest and shortest sleep durations
  const longestSleep = Math.max(...sleepSessions.map(s => s.totalMinutes));
  const shortestSleep = Math.min(...sleepSessions.map(s => s.totalMinutes));
  
  // Calculate sleep consistency (standard deviation)
  const meanSleep = averageSleepMinutes;
  const squaredDifferences = sleepSessions.map(s => Math.pow(s.totalMinutes - meanSleep, 2));
  const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / sleepSessions.length;
  const stdDev = Math.sqrt(variance);
  const consistencyPercentage = Math.max(0, Math.min(100, 100 - (stdDev / meanSleep * 100)));
  
  // Recent trend - improving or worsening?
  const recentSessions = sleepSessions.slice(0, Math.min(5, sleepSessions.length));
  const oldestRecent = recentSessions[recentSessions.length - 1]?.totalMinutes || 0;
  const newestRecent = recentSessions[0]?.totalMinutes || 0;
  const trendDifference = newestRecent - oldestRecent;
  
  const items = [
    {
      icon: <Clock className="text-purple-500" size={20} />,
      label: 'Average Sleep',
      value: formatDuration(averageSleepMinutes)
    },
    {
      icon: <TrendingUp className="text-green-500" size={20} />,
      label: 'Sleep Consistency',
      value: `${Math.round(consistencyPercentage)}%`
    },
    {
      icon: <BarChart3 className="text-blue-500" size={20} />,
      label: 'Longest Sleep',
      value: formatDuration(longestSleep)
    },
    {
      icon: <BarChart3 className="text-orange-500" size={20} />,
      label: 'Shortest Sleep',
      value: formatDuration(shortestSleep)
    }
  ];

  return (
    <div className="card h-full">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="text-purple-500" size={24} />
        <h2 className="text-xl font-semibold text-navy-800 dark:text-white">Sleep Stats</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="bg-navy-50 dark:bg-navy-800 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center mb-2">
              {item.icon}
              <span className="ml-2 text-sm text-navy-600 dark:text-navy-300">{item.label}</span>
            </div>
            <div className="text-xl font-semibold text-navy-800 dark:text-white">{item.value}</div>
          </motion.div>
        ))}
      </div>
      
      {sleepSessions.length >= 2 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">Recent Trend</h3>
          <div className="bg-navy-50 dark:bg-navy-800 p-4 rounded-lg">
            <div className="flex items-center">
              {trendDifference > 0 ? (
                <TrendingUp className="text-green-500 mr-2" size={20} />
              ) : (
                <TrendingUp className="text-red-500 mr-2 transform rotate-180" size={20} />
              )}
              <span className="text-navy-700 dark:text-navy-200">
                {trendDifference > 0 
                  ? `You're sleeping ${formatDuration(Math.abs(trendDifference))} more recently` 
                  : trendDifference < 0 
                    ? `You're sleeping ${formatDuration(Math.abs(trendDifference))} less recently`
                    : 'Your sleep duration has been consistent'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-navy-600 dark:text-navy-300">
        Based on {sleepSessions.length} recorded sleep {sleepSessions.length === 1 ? 'session' : 'sessions'}
      </div>
    </div>
  );
};

export default SleepStats;