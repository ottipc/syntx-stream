'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Zap, TrendingUp, Hash } from 'lucide-react';
import type { StromConfig } from '@/types/strom';
import { ScheduleDisplay } from './schedule-display';

interface StreamCardEnhancedProps {
  stream: StromConfig;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

export function StreamCardEnhanced({ stream, onEdit, onDelete, onToggle }: StreamCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-black/60 backdrop-blur-md rounded-2xl p-6 overflow-hidden group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{
        boxShadow: stream.aktiv 
          ? '0 0 30px rgba(0,255,255,0.4)' 
          : '0 0 15px rgba(100,100,100,0.2)'
      }}
    >
      {/* Rotating border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-50"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${stream.aktiv ? 'rgba(0,255,255,0.4)' : 'rgba(100,100,100,0.3)'}, transparent)`
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50" />

      {/* Status pulse */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <motion.div
          className={`w-3 h-3 rounded-full ${stream.aktiv ? 'bg-cyan-400' : 'bg-slate-600'}`}
          animate={stream.aktiv ? { 
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 8px rgba(0,255,255,0.6)',
              '0 0 20px rgba(0,255,255,1)',
              '0 0 8px rgba(0,255,255,0.6)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.span 
          className={`text-xs font-mono ${stream.aktiv ? 'text-cyan-400' : 'text-slate-600'}`}
          animate={stream.aktiv ? {
            textShadow: [
              '0 0 5px rgba(0,255,255,0.5)',
              '0 0 10px rgba(0,255,255,1)',
              '0 0 5px rgba(0,255,255,0.5)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {stream.aktiv ? 'ACTIVE' : 'INACTIVE'}
        </motion.span>
      </div>

      {/* Header */}
      <div className="mb-6 pt-8">
        <motion.h3 
          className="text-2xl font-black text-white mb-2"
          style={{
            textShadow: isHovered ? '0 0 15px rgba(0,255,255,0.8)' : '0 0 5px rgba(0,255,255,0.3)'
          }}
        >
          {stream.name}
        </motion.h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-cyan-400 font-mono">{stream.modell}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{stream.sprachen?.join(' · ')}</span>
        </div>
      </div>

      {/* SCHEDULE DISPLAY - GEILE VERSION! */}
      <div className="mb-6">
        <ScheduleDisplay zeitplan={stream.zeitplan} isActive={stream.aktiv} />
      </div>

      {/* Field Topics */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider font-bold">
          <TrendingUp className="w-3 h-3" />
          Field Resonance
        </div>
        {stream.felder_topics && Object.entries(stream.felder_topics).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{key}</span>
              <motion.span 
                className="text-cyan-400 font-mono"
                animate={{
                  textShadow: isHovered ? [
                    '0 0 5px rgba(0,255,255,0.5)',
                    '0 0 10px rgba(0,255,255,1)',
                    '0 0 5px rgba(0,255,255,0.5)'
                  ] : 'none'
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {typeof value === 'number' ? (value * 100).toFixed(0) : value}%
              </motion.span>
            </div>
            <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />
              
              {/* Bar */}
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative"
                initial={{ width: 0 }}
                animate={{ width: `${(typeof value === 'number' ? value : 0.5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  boxShadow: '0 0 10px rgba(0,255,255,0.6)'
                }}
              >
                {/* Flowing shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {stream.styles?.map((style) => (
          <motion.span 
            key={style} 
            className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 15px rgba(168,85,247,0.5)'
            }}
          >
            {style}
          </motion.span>
        ))}
      </div>

      {/* Muster */}
      <div className="mb-6 p-3 bg-black/40 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-3 h-3 text-slate-600" />
          <span className="text-xs text-slate-600 uppercase tracking-wider">Pattern</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">{stream.muster}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 relative z-10">
        <motion.button
          onClick={onToggle}
          className={`p-3 rounded-xl transition-colors ${
            stream.aktiv
              ? 'bg-cyan-600/30 text-cyan-400 hover:bg-cyan-600/50'
              : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: stream.aktiv ? '0 0 15px rgba(0,255,255,0.4)' : 'none'
          }}
        >
          <Zap className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                onClick={onEdit}
                className="p-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-400 rounded-xl"
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 0 15px rgba(168,85,247,0.4)' }}
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                onClick={onDelete}
                className="p-3 bg-red-600/30 hover:bg-red-600/50 text-red-400 rounded-xl"
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Hover glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow: 'inset 0 0 100px rgba(0,255,255,0.15)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
