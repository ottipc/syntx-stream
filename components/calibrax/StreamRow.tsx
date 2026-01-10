'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { CalibrationRun } from '@/types/calibrax';
import { AnimatedStream } from './AnimatedStream';
import { NeuralBackground } from './NeuralBackground';
import { SyntxFieldViewModal } from './SyntxFieldViewModal';

interface StreamRowProps {
  run: CalibrationRun;
  index: number;
  onClick: () => void;
}

type StageType = 'metadata' | 'gpt-input' | 'gpt-output' | 'mistral-input' | 'mistral-output';

export function StreamRow({ run, index, onClick }: StreamRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const time = new Date(run.timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const stages = [
    {
      id: 'metadata' as StageType,
      emoji: '📋',
      title: 'METADATA',
      color: 'purple',
      preview: run.cron_data.name.substring(0, 30) + '...',
    },
    {
      id: 'gpt-input' as StageType,
      emoji: '🧠',
      title: 'GPT INPUT',
      color: 'blue',
      preview: run.stages?.gpt_system_prompt?.substring(0, 20) + '...' || 'N/A',
    },
    {
      id: 'gpt-output' as StageType,
      emoji: '✨',
      title: 'GPT OUTPUT',
      color: 'cyan',
      preview: run.stages?.gpt_output_meta_prompt?.substring(0, 30) + '...' || 'N/A',
    },
    {
      id: 'mistral-input' as StageType,
      emoji: '🔧',
      title: 'MISTRAL INPUT',
      color: 'green',
      preview: run.stages?.mistral_input?.substring(0, 30) + '...' || 'N/A',
    },
    {
      id: 'mistral-output' as StageType,
      emoji: '🌊',
      title: 'MISTRAL OUTPUT',
      color: 'yellow',
      preview: run.stages?.mistral_output?.substring(0, 30) + '...' || 'N/A',
    },
  ];

  const colorMap: Record<string, string> = {
    purple: 'border-purple-500/30 bg-purple-900/10',
    blue: 'border-blue-500/30 bg-blue-900/10',
    cyan: 'border-cyan-500/30 bg-cyan-900/10',
    green: 'border-green-500/30 bg-green-900/10',
    yellow: 'border-yellow-500/30 bg-yellow-900/10',
  };

  return (
    <>
      <motion.div
        className="relative bg-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -2 }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Neural Background */}
        <NeuralBackground quality={run.scores.overall} />

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🧬</div>
              <div>
                <div className="text-sm text-gray-400 font-mono">{time}</div>
                <div className="text-lg font-bold text-white line-clamp-1">{run.cron_data.name}</div>
              </div>
            </div>
            
            {/* Scores */}
            <div className="flex items-center gap-3">
              <Badge label="Overall" value={`${run.scores.overall}%`} color={run.scores.overall >= 80 ? 'green' : run.scores.overall >= 50 ? 'yellow' : 'red'} />
              <Badge label="Complete" value={`${run.scores.field_completeness}%`} color="cyan" />
            </div>
          </div>

          {/* Stages Flow */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {stages.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-3 flex-shrink-0">
                <StageBox stage={stage} colorMap={colorMap} />
                {i < stages.length - 1 && <AnimatedStream quality={run.scores.overall} />}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SYNTX Field View Modal */}
      <SyntxFieldViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        run={run}
      />
    </>
  );
}

// Sub-components

function StageBox({ stage, colorMap }: { stage: any; colorMap: Record<string, string> }) {
  return (
    <motion.div
      className={`border rounded-lg p-3 min-w-[180px] ${colorMap[stage.color]} group-hover:border-opacity-60 transition-all`}
      whileHover={{ scale: 1.03, y: -2 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{stage.emoji}</span>
        <span className="text-xs text-gray-400 font-mono uppercase">{stage.title}</span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2">{stage.preview}</p>
    </motion.div>
  );
}

function Badge({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-900/30 border-green-500/30 text-green-400',
    yellow: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400',
    red: 'bg-red-900/30 border-red-500/30 text-red-400',
    cyan: 'bg-cyan-900/30 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div className={`px-3 py-1 rounded-lg border text-xs font-mono ${colorMap[color]}`}>
      <span className="opacity-60">{label}:</span>
      <span className="ml-1 font-bold">{value}</span>
    </div>
  );
}
