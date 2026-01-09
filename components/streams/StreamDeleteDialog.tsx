'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useCronStreamStore } from '@/lib/stores/cron-stream-store';
import type { Strom } from '@/types/strom';

interface StreamDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stream: Strom | null;
}

export function StreamDeleteDialog({ isOpen, onClose, stream }: StreamDeleteDialogProps) {
  const { deleteStream } = useCronStreamStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!stream) return;
    
    setLoading(true);
    
    try {
      await deleteStream(stream.muster);
      onClose();
    } catch (error) {
      console.error('Failed to delete stream:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!stream) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-slate-950 rounded-2xl border border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden">
              
              {/* Neural Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-red-950/10 to-slate-950 opacity-50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
              
              {/* Content */}
              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0"
                  >
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">Delete Stream</h2>
                    <p className="text-sm text-slate-400">
                      Are you sure you want to delete this stream? This action cannot be undone.
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Stream Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6"
                >
                  <div className="text-sm text-slate-400 mb-1">Stream Name</div>
                  <div className="text-white font-semibold">{stream.name}</div>
                  <div className="text-xs text-slate-500 mt-2 font-mono">{stream.muster}</div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
