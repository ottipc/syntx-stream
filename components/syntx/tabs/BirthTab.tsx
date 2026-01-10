'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import Image from 'next/image';
import { useCronStreamStore } from '@/lib/stores/cron-stream-store';
import { 
  CursorResonance,
  FieldBackground,
  StreamCardEnhanced,
  CreateButtonNeo
} from '@/components/birth-field';
import { StreamCreateModal } from '@/components/streams/StreamCreateModal';
import { StreamEditModal } from '@/components/streams/StreamEditModal';
import { StreamDeleteDialog } from '@/components/streams/StreamDeleteDialog';
import type { StromConfig } from '@/types/strom';

type FilterType = 'all' | 'active' | 'inactive';

export function BirthTab() {
  const { streams, fetchStreams, toggleActive } = useCronStreamStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<StromConfig | null>(null);
  const [deletingStream, setDeletingStream] = useState<StromConfig | null>(null);
  const [systemState, setSystemState] = useState<'stable' | 'stress' | 'drift'>('stable');

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  useEffect(() => {
    const activeCount = streams.filter(s => s.aktiv).length;
    if (activeCount === 0) setSystemState('drift');
    else if (activeCount > 5) setSystemState('stress');
    else setSystemState('stable');
  }, [streams]);

  const filteredStreams = streams.filter((stream) => {
    if (filter === 'active') return stream.aktiv;
    if (filter === 'inactive') return !stream.aktiv;
    return true;
  });

  return (
    <div className="relative min-h-screen">
      <CursorResonance />
      <FieldBackground state={systemState} />

      <div className="relative z-10 p-6 space-y-6">
        {/* Header with Logo */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-6"
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(0,255,255,0.5))',
                'drop-shadow(0 0 40px rgba(0,255,255,1))',
                'drop-shadow(0 0 20px rgba(0,255,255,0.5))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Image 
              src="/Logo1.png" 
              alt="SYNTX Logo" 
              width={120} 
              height={120}
              className="object-contain"
            />
          </motion.div>

          <motion.h1 
            className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% auto',
              textShadow: '0 0 40px rgba(0,255,255,0.5)'
            }}
          >
            BIRTH
          </motion.h1>
          <motion.p 
            className="text-cyan-400 text-lg font-mono"
            animate={{
              opacity: [0.7, 1, 0.7],
              textShadow: [
                '0 0 10px rgba(0,255,255,0.5)',
                '0 0 20px rgba(0,255,255,1)',
                '0 0 10px rgba(0,255,255,0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            Stream Creation Field
          </motion.p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Filter className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as FilterType[]).map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl font-medium text-sm transition-all relative overflow-hidden ${
                    filter === f
                      ? 'bg-cyan-600/30 text-cyan-400'
                      : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: filter === f ? '0 0 20px rgba(0,255,255,0.4)' : 'none'
                  }}
                >
                  {filter === f && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <span className="relative z-10">{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <CreateButtonNeo onClick={() => setIsCreateOpen(true)} />
        </div>

        {/* Stream Grid - SCHMALER & STROM EFFECT */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredStreams.map((stream, index) => (
              <motion.div
                key={stream.strom_id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  // Strom effect - cards flow together
                  y: Math.sin(index * 0.5) * 10
                }}
                exit={{ opacity: 0, x: 50 }}
                transition={{
                  delay: index * 0.1,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
              >
                <StreamCardEnhanced
                  stream={stream}
                  onEdit={() => setEditingStream(stream)}
                  onDelete={() => setDeletingStream(stream)}
                  onToggle={() => toggleActive(stream.strom_id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredStreams.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-slate-600 mb-4"
              animate={{
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              <p className="text-2xl font-bold mb-2">No Streams in Field</p>
              <p className="text-sm">
                {filter !== 'all' ? `No ${filter} streams detected` : 'Initiate first stream creation'}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Connection lines between cards */}
        <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20 z-0">
          {filteredStreams.map((_, i) => {
            if (i === filteredStreams.length - 1) return null;
            return (
              <motion.line
                key={i}
                x1={`${33 * i + 16.5}%`}
                y1="50%"
                x2={`${33 * (i + 1) + 16.5}%`}
                y2="50%"
                stroke="rgba(0,255,255,0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.2 }}
              />
            );
          })}
        </svg>
      </div>

      {/* Modals */}
      <StreamCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <StreamEditModal isOpen={!!editingStream} onClose={() => setEditingStream(null)} stream={editingStream} />
      <StreamDeleteDialog isOpen={!!deletingStream} onClose={() => setDeletingStream(null)} stream={deletingStream} />
    </div>
  );
}
