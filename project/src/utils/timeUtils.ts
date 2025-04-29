import { format, differenceInMinutes, parseISO, addMinutes } from 'date-fns';

export const formatTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'HH:mm');
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  }
  
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${mins} min`;
};

export const calculateTotalSleepMinutes = (
  sessions: { start: string; end: string }[]
): number => {
  return sessions.reduce((total, session) => {
    // Parse dates
    const startDate = parseISO(session.start);
    const endDate = parseISO(session.end);
    
    // Calculate difference in minutes
    let minutes = differenceInMinutes(endDate, startDate);
    
    // If end time is "earlier" than start time, it means we slept past midnight
    if (minutes < 0) {
      minutes += 24 * 60; // Add 24 hours
    }
    
    return total + minutes;
  }, 0);
};

export const getSleepQualityMessage = (totalMinutes: number): string => {
  const hours = totalMinutes / 60;
  
  if (hours < 4) {
    return 'Very poor sleep duration';
  } else if (hours < 6) {
    return 'Insufficient sleep';
  } else if (hours < 7) {
    return 'Borderline sleep duration';
  } else if (hours <= 9) {
    return 'Optimal sleep duration';
  } else {
    return 'Extended sleep duration';
  }
};

export const getSleepQualityColor = (totalMinutes: number): string => {
  const hours = totalMinutes / 60;
  
  if (hours < 4) {
    return 'text-red-500';
  } else if (hours < 6) {
    return 'text-orange-500';
  } else if (hours < 7) {
    return 'text-yellow-500';
  } else if (hours <= 9) {
    return 'text-green-500';
  } else {
    return 'text-blue-500';
  }
};

export const getCurrentTime = (): string => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm");
};

export const getEndTimeFromDuration = (startTime: string, durationMinutes: number): string => {
  const startDate = parseISO(startTime);
  const endDate = addMinutes(startDate, durationMinutes);
  return format(endDate, "yyyy-MM-dd'T'HH:mm");
};