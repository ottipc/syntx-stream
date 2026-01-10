'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Zap, CheckCircle, Target } from 'lucide-react';
import Image from 'next/image';
import type { CalibrationRun } from '@/types/calibrax';
import { MetadataView } from './stages/MetadataView';
import { GPTInputView } from './stages/GPTInputView';
import { GPTOutputView } from './stages/GPTOutputView';
import { MistralInputView } from './stages/MistralInputView';
import { MistralOutputView } from './stages/MistralOutputView';
import { CyberStatCard } from './ui/CyberStatCard';
import { NeuralBackdrop } from './ui/NeuralBackdrop';

interface StageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: 'metadata' | 'gpt-input' | 'gpt-output' | 'mistral-input' | 'mistral-output';
  run: CalibrationRun;
}

export function StageDetailModal({ isOpen, onClose, stage, run }: StageDetailModalProps) {
  const stageConfig = {
    'metadata': { title: 'METADATA', emoji: '📋', color: 'purple' },
    'gpt-input': { title: 'GPT INPUT', emoji: '🧠', color: 'blue' },
    'gpt-output': { title: 'GPT OUTPUT', emoji: '✨', color: 'cyan' },
    'mistral-input': { title: 'MISTRAL INPUT', emoji: '🔧', color: 'green' },
    'mistral-output': { title: 'MISTRAL OUTPUT', emoji: '🌊', color: 'yellow' },
  };

  const config = stageConfig[stage];
  const timestamp = new Date(run.timestamp).toLocaleString('de-DE');
  const duration = (run.meta.duration_ms / 1000).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <NeuralBackdrop onClick={onClose} />

          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pointer-events-none overflow-y-auto">
            <motion.div
              className="relative max-w-6xl w-full pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -30 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl animate-pulse" />
              
              <div className="relative bg-gray-950 border-2 border-cyan-500/30 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-b-2 border-cyan-900/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-md" />
                        <div className="relative">
                          <Image src="/Logo1.png" alt="SYNTX" width={64} height={64} className="rounded-lg" />
                        </div>
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-5xl">{config.emoji}</span>
                          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">{config.title}</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">Full Pipeline Stage • {timestamp}</p>
                      </div>
                    </div>
                    <motion.button onClick={onClose} className="p-3 hover:bg-red-500/20 rounded-xl transition-colors border-2 border-red-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <X className="w-6 h-6 text-red-400" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <CyberStatCard 
                      icon={<Clock className="w-5 h-5" />} 
                      label="Timestamp" 
                      value={timestamp} 
                      color="blue" 
                    />
                    <CyberStatCard 
                      icon={<Zap className="w-5 h-5" />} 
                      label="Duration" 
                      value={`${duration}s`} 
                      color="yellow" 
                    />
                    <CyberStatCard 
                      icon={<CheckCircle className="w-5 h-5" />} 
                      label="Overall" 
                      value={`${run.scores.overall}%`} 
                      color="cyan" 
                    />
                    <CyberStatCard 
                      icon={<Target className="w-5 h-5" />} 
                      label="Complete" 
                      value={`${run.scores.field_completeness}%`} 
                      color="green" 
                    />
                    <CyberStatCard 
                      icon={<CheckCircle className="w-5 h-5" />} 
                      label="Structure" 
                      value={`${run.scores.structure_adherence}%`} 
                      color="purple" 
                    />
                  </div>
                </div>

                <div className="p-6 max-h-[65vh] overflow-y-auto bg-gray-950">
                  {stage === 'metadata' && <MetadataView run={run} />}
                  {stage === 'gpt-input' && <GPTInputView run={run} />}
                  {stage === 'gpt-output' && <GPTOutputView run={run} />}
                  {stage === 'mistral-input' && <MistralInputView run={run} />}
                  {stage === 'mistral-output' && <MistralOutputView run={run} />}
                </div>

                <div className="relative border-t-2 border-cyan-900/50 bg-gradient-to-b from-gray-950 to-gray-900 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-mono">
                      Model: {run.cron_data.modell} • Status: {run.meta.success ? '✅ SUCCESS' : '❌ FAILED'}
                    </div>
                    <motion.button
                      onClick={onClose}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
