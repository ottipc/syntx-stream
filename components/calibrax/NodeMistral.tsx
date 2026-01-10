'use client';

import { motion } from 'framer-motion';
import type { CalibrationRun } from '@/types/calibrax';

interface NodeMistralProps {
  run: CalibrationRun;
  onClick?: () => void;
}

export function NodeMistral({ run, onClick }: NodeMistralProps) {
  const duration = (run.meta.duration_ms / 1000).toFixed(1);
  const isCompleted = run.meta.success;
  const hasHighQuality = run.scores.overall >= 90;

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-cyan-900/40 to-cyan-950/60 border ${
        isCompleted ? 'border-cyan-500/30' : 'border-red-500/30'
      } rounded-xl p-5 min-w-[260px] shadow-xl cursor-pointer group`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 ${
        isCompleted ? 'bg-cyan-600/20' : 'bg-red-600/20'
      } rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      {/* Pulse ring for quality >= 90 */}
      {hasHighQuality && (
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/50 rounded-xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${
            isCompleted ? 'bg-cyan-400' : 'bg-red-400'
          }`} />
          <span className="text-xs text-cyan-300 font-mono font-bold tracking-wider">MISTRAL OUTPUT</span>
          <span className="ml-auto text-xs text-cyan-400 font-mono">{duration}s</span>
        </div>
        
        {/* Stats */}
        <div className="space-y-1.5 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Model:</span>
            <span className="text-cyan-300 font-mono font-bold">{run.cron_data.modell}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Fields:</span>
            <span className="text-cyan-300 font-mono">{Object.keys(run.cron_data.felder).length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Retries:</span>
            <span className="text-yellow-400 font-mono">{run.meta.retry_count}</span>
          </div>
        </div>
        
        {/* Score Tags */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
            run.scores.overall >= 80 ? 'bg-green-900/30 border border-green-500/30' :
            run.scores.overall >= 50 ? 'bg-yellow-900/30 border border-yellow-500/30' :
            'bg-red-900/30 border border-red-500/30'
          }`}>
            <span className="text-[10px] text-gray-400">Overall:</span>
            <span className={`text-sm font-bold ${
              run.scores.overall >= 80 ? 'text-green-400' :
              run.scores.overall >= 50 ? 'text-yellow-400' :
              'text-red-400'
            }`}>{run.scores.overall}%</span>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
            run.scores.field_completeness >= 80 ? 'bg-green-900/30 border border-green-500/30' :
            run.scores.field_completeness >= 50 ? 'bg-yellow-900/30 border border-yellow-500/30' :
            'bg-red-900/30 border border-red-500/30'
          }`}>
            <span className="text-[10px] text-gray-400">Complete:</span>
            <span className={`text-sm font-bold ${
              run.scores.field_completeness >= 80 ? 'text-green-400' :
              run.scores.field_completeness >= 50 ? 'text-yellow-400' :
              'text-red-400'
            }`}>{run.scores.field_completeness}%</span>
          </div>
          
          {isCompleted && <span className="ml-auto text-green-400 text-lg">●</span>}
        </div>
      </div>
    </motion.div>
  );
}
