'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, ZapOff, Edit2, Trash2 } from 'lucide-react';
import { FieldWeightVisualizer } from './FieldWeightVisualizer';
import { ResonanceIndicator } from './ResonanceIndicator';
import { StreamEditModal } from './StreamEditModal';
import { StreamDeleteDialog } from './StreamDeleteDialog';
import { formatCronReadable, calculateNextRun } from '@/lib/cron-utils';
import type { Strom } from '@/types/strom';

interface StreamCardProps {
  stream: Strom;
  onToggle: () => void;
}

export function StreamCard({ stream, onToggle }: StreamCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const nextRun = calculateNextRun(stream.zeitplan);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 hover:border-blue-500/50 transition-colors group"
      >
        {/* Action Buttons - Show on Hover */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditModalOpen(true)}
            className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDeleteDialogOpen(true)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Header with Resonance Indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <ResonanceIndicator active={stream.aktiv} size="lg" />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {stream.name}
              </h3>
              <p className="text-sm text-slate-400">
                {stream.modell} • {stream.sprachen.join(', ')}
              </p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              stream.aktiv
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
            }`}
          >
            {stream.aktiv ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Field Weights */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
            Field Topics
          </div>
          <FieldWeightVisualizer fields={stream.felder_topics} />
        </div>

        {/* Schedule Info */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Clock className="w-4 h-4" />
          <span>{formatCronReadable(stream.zeitplan)}</span>
          {nextRun && (
            <span className="text-slate-500">
              • Next: {nextRun.toLocaleString()}
            </span>
          )}
        </div>

        {/* Styles */}
        <div className="flex gap-2 flex-wrap">
          {stream.styles.map((style) => (
            <span
              key={style}
              className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs"
            >
              {style}
            </span>
          ))}
        </div>

        {/* ID Badge */}
        <div className="mt-3 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            {stream.muster}
          </span>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <StreamEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        stream={stream}
      />

      {/* Delete Dialog */}
      <StreamDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        stream={stream}
      />
    </>
  );
}
