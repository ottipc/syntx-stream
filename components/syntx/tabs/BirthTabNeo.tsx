'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
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

export function BirthTabNeo() {
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
    // Determine system state based on streams
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
      {/* Field Engine Components */}
      <CursorResonance />
      <FieldBackground state={systemState} />

      {/* Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% auto'
            }}
          >
            BIRTH
          </motion.h1>
          <motion.p 
            className="text-cyan-400 text-lg"
            animate={{
              opacity: [0.7, 1, 0.7]
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-cyan-400" />
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as FilterType[]).map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === f
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: filter === f ? '0 0 20px rgba(0,255,255,0.5)' : 'none'
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <CreateButtonNeo onClick={() => setIsCreateOpen(true)} />
        </div>

        {/* Stream Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredStreams.map((stream) => (
              <StreamCardEnhanced
                key={stream.strom_id}
                stream={stream}
                onEdit={() => setEditingStream(stream)}
                onDelete={() => setDeletingStream(stream)}
                onToggle={() => toggleActive(stream.strom_id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredStreams.length === 0 && (
          <motion.div
            className="text-center py-16"
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
              <p className="text-lg">No streams in field</p>
              <p className="text-sm mt-2">
                {filter !== 'all' ? `No ${filter} streams` : 'Create your first stream'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <StreamCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <StreamEditModal isOpen={!!editingStream} onClose={() => setEditingStream(null)} stream={editingStream} />
      <StreamDeleteDialog isOpen={!!deletingStream} onClose={() => setDeletingStream(null)} stream={deletingStream} />
    </div>
  );
}
