'use client';

import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

interface ScheduleDisplayProps {
  zeitplan: string;
  isActive: boolean;
}

// Parse cron to readable format
const parseCron = (cron: string) => {
  const parts = cron.split(' ');
  if (parts.length < 5) return { time: '00:00', days: [], dayText: 'Invalid' };

  const minute = parts[0].padStart(2, '0');
  const hour = parts[1].padStart(2, '0');
  const dayOfWeek = parts[4];

  const time = `${hour}:${minute}`;

  const dayMap: Record<string, { short: string; full: string }> = {
    '1': { short: 'Mo', full: 'Montag' },
    '2': { short: 'Di', full: 'Dienstag' },
    '3': { short: 'Mi', full: 'Mittwoch' },
    '4': { short: 'Do', full: 'Donnerstag' },
    '5': { short: 'Fr', full: 'Freitag' },
    '6': { short: 'Sa', full: 'Samstag' },
    '0': { short: 'So', full: 'Sonntag' },
    '7': { short: 'So', full: 'Sonntag' }
  };

  // Handle all days
  if (dayOfWeek === '*') {
    return { time, days: Object.values(dayMap), dayText: 'Täglich' };
  }

  // Handle ranges like "1-5"
  if (dayOfWeek.includes('-')) {
    const [start, end] = dayOfWeek.split('-').map(Number);
    const rangeDays = [];
    for (let i = start; i <= end; i++) {
      if (dayMap[i]) {
        rangeDays.push(dayMap[i]);
      }
    }
    return { time, days: rangeDays, dayText: rangeDays.map(d => d.short).join(' · ') };
  }

  // Handle comma-separated like "1,2,4,5"
  if (dayOfWeek.includes(',')) {
    const days = dayOfWeek.split(',').map(d => dayMap[d]).filter(Boolean);
    return { time, days, dayText: days.map(d => d.short).join(' · ') };
  }

  // Single day
  const singleDay = dayMap[dayOfWeek];
  if (singleDay) {
    return { time, days: [singleDay], dayText: singleDay.full };
  }

  return { time, days: [], dayText: 'Invalid' };
};

// Get next run time
const getNextRun = (cron: string) => {
  const now = new Date();
  const parts = cron.split(' ');
  if (parts.length < 5) return 'Unknown';

  const targetHour = parseInt(parts[1]);
  const targetMinute = parseInt(parts[0]);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const minutesUntil = (targetHour - currentHour) * 60 + (targetMinute - currentMinute);

  if (minutesUntil > 0 && minutesUntil < 60) {
    return `${minutesUntil}min`;
  } else if (minutesUntil > 0 && minutesUntil < 180) {
    const hours = Math.floor(minutesUntil / 60);
    const mins = minutesUntil % 60;
    return `${hours}h ${mins}m`;
  } else if (minutesUntil > 0) {
    return `${Math.floor(minutesUntil / 60)}h`;
  } else {
    const hoursUntil = 24 + Math.floor(minutesUntil / 60);
    return `${hoursUntil}h`;
  }
};

export function ScheduleDisplay({ zeitplan, isActive }: ScheduleDisplayProps) {
  const { time, days, dayText } = parseCron(zeitplan);
  const nextRun = getNextRun(zeitplan);
  const [hours, minutes] = time.split(':');

  return (
    <div className="relative bg-black/40 backdrop-blur-sm rounded-xl p-4 overflow-hidden">
      {/* Background pulse */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-cyan-500/5"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Header */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
          </motion.div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Schedule</span>
        </div>
        <Calendar className="w-4 h-4 text-purple-400" />
      </div>

      {/* Digital time display */}
      <div className="relative mb-4">
        <div className="flex items-baseline justify-center gap-2">
          {/* Hours */}
          <motion.div 
            className="relative"
            animate={isActive ? {
              textShadow: [
                '0 0 10px rgba(0,255,255,0.5)',
                '0 0 30px rgba(0,255,255,1)',
                '0 0 10px rgba(0,255,255,0.5)'
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-5xl font-black font-mono text-cyan-400 leading-none">
              {hours}
            </div>
          </motion.div>

          {/* Separator */}
          <motion.div
            className="text-5xl font-black text-cyan-400/50 leading-none"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            :
          </motion.div>

          {/* Minutes */}
          <motion.div 
            className="relative"
            animate={isActive ? {
              textShadow: [
                '0 0 10px rgba(0,255,255,0.5)',
                '0 0 30px rgba(0,255,255,1)',
                '0 0 10px rgba(0,255,255,0.5)'
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <div className="text-5xl font-black font-mono text-cyan-400 leading-none">
              {minutes}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Day badges */}
      {days.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {days.map((day, i) => (
            <motion.div
              key={i}
              className="px-3 py-1 bg-purple-600/20 rounded-lg border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 15px rgba(168,85,247,0.5)',
                backgroundColor: 'rgba(168,85,247,0.3)'
              }}
            >
              <span className="text-xs font-bold text-purple-300">{day.short}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Next run */}
      <motion.div 
        className="text-center p-2 bg-black/40 rounded-lg"
        animate={isActive ? {
          boxShadow: [
            '0 0 10px rgba(0,255,255,0.2)',
            '0 0 20px rgba(0,255,255,0.4)',
            '0 0 10px rgba(0,255,255,0.2)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Next Activation</div>
        <motion.div 
          className="text-sm font-bold text-cyan-400 font-mono"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {nextRun}
        </motion.div>
      </motion.div>

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-400/30" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-400/30" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400/30" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-400/30" />
    </div>
  );
}
