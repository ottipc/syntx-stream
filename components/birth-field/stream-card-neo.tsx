'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Zap, Clock } from 'lucide-react';
import type { StromConfig } from '@/types/strom';

interface StreamCardNeoProps {
  stream: StromConfig;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

export function StreamCardNeo({ stream, onEdit, onDelete, onToggle }: StreamCardNeoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-black/80 rounded-2xl p-6 overflow-hidden group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{
        boxShadow: stream.aktiv 
          ? '0 0 20px rgba(0,255,255,0.3)' 
          : '0 0 10px rgba(100,100,100,0.2)'
      }}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${stream.aktiv ? 'rgba(0,255,255,0.3)' : 'rgba(100,100,100,0.2)'}, transparent)`,
          padding: '2px'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Status indicator */}
      <div className="absolute top-4 left-4">
        <motion.div
          className={`w-3 h-3 rounded-full ${stream.aktiv ? 'bg-cyan-500' : 'bg-slate-600'}`}
          animate={stream.aktiv ? { 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 5px rgba(0,255,255,0.5)',
              '0 0 15px rgba(0,255,255,1)',
              '0 0 5px rgba(0,255,255,0.5)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="mb-4 pl-6">
        <motion.h3 
          className="text-xl font-black text-white mb-1"
          style={{
            textShadow: isHovered ? '0 0 10px rgba(0,255,255,0.8)' : 'none'
          }}
        >
          {stream.name}
        </motion.h3>
        <p className="text-sm text-slate-400">{stream.modell} · {stream.sprachen?.join(', ')}</p>
      </div>

      {/* Field Topics */}
      <div className="space-y-2 mb-4">
        {stream.felder_topics && Object.entries(stream.felder_topics).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{key}</span>
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
                {typeof value === 'number' ? value.toFixed(2) : value}
              </motion.span>
            </div>
            <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(typeof value === 'number' ? value : 0.5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  boxShadow: '0 0 5px rgba(0,255,255,0.5)'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
        <Clock className="w-3 h-3" />
        <span>{stream.zeitplan}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            stream.aktiv
              ? 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40'
              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-600/50'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-4 h-4" />
        </motion.button>

        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onEdit}
                className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onDelete}
                className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
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
              boxShadow: 'inset 0 0 80px rgba(0,255,255,0.2)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
