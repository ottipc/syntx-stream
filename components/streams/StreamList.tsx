'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Zap, Clock, Filter } from 'lucide-react';
import { useCronStreamStore } from '@/lib/stores/cron-stream-store';
import type { StromConfig } from '@/types/strom';
import { StreamCreateModal } from './StreamCreateModal';
import { StreamEditModal } from './StreamEditModal';
import { StreamDeleteDialog } from './StreamDeleteDialog';

type FilterType = 'all' | 'active' | 'inactive';

export function StreamList() {
  const { streams, fetchStreams, toggleActive } = useCronStreamStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<StromConfig | null>(null);
  const [deletingStream, setDeletingStream] = useState<StromConfig | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const filteredStreams = streams.filter((stream) => {
    if (filter === 'active') return stream.aktiv;
    if (filter === 'inactive') return !stream.aktiv;
    return true;
  });

  const formatSchedule = (cron: string) => {
    const parts = cron.split(' ');
    if (parts.length < 5) return cron;

    const minute = parts[0];
    const hour = parts[1];
    const dayOfWeek = parts[4];

    if (dayOfWeek === '*') {
      return `Daily at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }

    const days = dayOfWeek.split(',').map((d) => {
      const dayMap: Record<string, string> = {
        '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed',
        '4': 'Thu', '5': 'Fri', '6': 'Sat',
      };
      return dayMap[d] || d;
    });

    return `${days.join(', ')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  const getNextRun = (cron: string) => {
    const now = new Date();
    const parts = cron.split(' ');
    if (parts.length < 5) return 'Unknown';

    const targetHour = parseInt(parts[1]);
    const targetMinute = parseInt(parts[0]);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const timeUntil = (targetHour - currentHour) * 60 + (targetMinute - currentMinute);

    if (timeUntil > 0 && timeUntil < 180) {
      return `in ${Math.floor(timeUntil / 60)}h ${timeUntil % 60}m`;
    } else if (timeUntil > 0) {
      return `in ${Math.floor(timeUntil / 60)} hours`;
    } else {
      return `in ${24 + Math.floor(timeUntil / 60)} hours`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar & Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 font-bold"
        >
          <Plus className="w-5 h-5" />
          Create Stream
        </motion.button>
      </div>

      {/* Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStreams.map((stream) => (
          <motion.div
            key={stream.strom_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onHoverStart={() => setHoveredCard(stream.strom_id)}
            onHoverEnd={() => setHoveredCard(null)}
            className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-cyan-500/50 transition-all group"
          >
            {/* Stream Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stream.aktiv ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'}`} />
                <div>
                  <h3 className="text-xl font-bold text-white">{stream.name}</h3>
                  <p className="text-sm text-slate-400">{stream.modell} • {stream.sprachen?.join(', ')}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hoveredCard === stream.strom_id ? 1 : 0,
                    scale: hoveredCard === stream.strom_id ? 1 : 0.8,
                  }}
                  onClick={() => setEditingStream(stream)}
                  className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hoveredCard === stream.strom_id ? 1 : 0,
                    scale: hoveredCard === stream.strom_id ? 1 : 0.8,
                  }}
                  onClick={() => setDeletingStream(stream)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>

                <button
                  onClick={() => toggleActive(stream.strom_id)}
                  className={`p-2 rounded-lg transition-colors ${
                    stream.aktiv
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/40'
                      : 'bg-slate-700/50 text-slate-500 hover:bg-slate-600/50'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Field Topics */}
            <div className="space-y-3 mb-4">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Field Topics</div>
              {stream.felder_topics && Object.entries(stream.felder_topics).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{key}</span>
                    <span className="text-cyan-400 font-mono">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(typeof value === 'number' ? value : 0.5) * 100}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Clock className="w-4 h-4" />
              <span>{formatSchedule(stream.zeitplan)}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">Next: {getNextRun(stream.zeitplan)}</span>
            </div>

            {/* Styles */}
            <div className="flex flex-wrap gap-2">
              {stream.styles?.map((style) => (
                <span key={style} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                  {style}
                </span>
              ))}
            </div>

            {/* Muster */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-600 font-mono">{stream.muster}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStreams.length === 0 && (
        <div className="text-center py-16">
          <div className="text-slate-600 mb-4">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No streams found</p>
            <p className="text-sm mt-2">
              {filter !== 'all' ? `No ${filter} streams available` : 'Create your first stream to get started'}
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <StreamCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <StreamEditModal isOpen={!!editingStream} onClose={() => setEditingStream(null)} stream={editingStream} />
      <StreamDeleteDialog isOpen={!!deletingStream} onClose={() => setDeletingStream(null)} stream={deletingStream} />
    </div>
  );
}
