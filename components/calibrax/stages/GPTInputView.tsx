'use client';

import { Copy, Check, Brain, Zap, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CalibrationRun } from '@/types/calibrax';

interface GPTInputViewProps {
  run: CalibrationRun;
  onCopy?: (text: string) => void;
  copied?: boolean;
}

export function GPTInputView({ run, onCopy, copied }: GPTInputViewProps) {
  return (
    <div className="space-y-6">
      {/* HEADER: Neural Strategy */}
      <div className="relative border-2 border-cyan-500/30 rounded-2xl p-6 bg-gradient-to-br from-blue-950/30 to-purple-950/30">
        <motion.div className="absolute inset-0 opacity-10" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 50% 50%, cyan 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </motion.div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                GPT-4 Neural Generation
              </h3>
              <div className="text-xs text-gray-500 font-mono">{run.cron_data.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Model</div>
              <div className="text-sm text-cyan-400 font-mono font-bold">{run.cron_data.modell}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Fields</div>
              <div className="text-sm text-purple-400 font-mono font-bold">{Object.keys(run.cron_data.felder).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM PROMPT: Minimal */}
      <div className="relative border-2 border-purple-500/30 rounded-xl p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1">SYSTEM PROMPT (Minimal!)</div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {run.stages?.gpt_system_prompt || 'SYNTEX::TRUE_RAW'}
              </div>
            </div>
          </div>
          <button onClick={() => onCopy?.(run.stages?.gpt_system_prompt || '')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* USER PROMPT: With Warning if Missing */}
      <div className="relative border-2 border-cyan-500/30 rounded-xl p-4 bg-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-cyan-400 font-mono font-bold">USER PROMPT</div>
          <button onClick={() => onCopy?.(run.stages?.gpt_user_prompt || run.cron_data.name)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        
        {run.stages?.gpt_user_prompt && run.stages.gpt_user_prompt.trim() !== "" ? (
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
            {run.stages.gpt_user_prompt}
          </pre>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>⚠️</motion.div>
            <div>
              <div className="text-sm text-yellow-400 font-bold">USER PROMPT FEHLT</div>
              <div className="text-xs text-gray-400">Nur System Prompt + Meta-Prompt verwendet</div>
            </div>
          </div>
        )}
      </div>

      {/* META PROMPT: GPT Output */}
      {run.stages?.gpt_output_meta_prompt && (
        <div className="relative border-2 border-purple-500/30 rounded-xl p-4 bg-black/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <div className="text-sm text-purple-400 font-mono font-bold">GPT OUTPUT (META-PROMPT)</div>
            </div>
            <button onClick={() => onCopy?.(run.stages?.gpt_output_meta_prompt || "")} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto bg-purple-900/20 rounded p-3 border border-purple-500/20">
            {run.stages.gpt_output_meta_prompt}
          </pre>
        </div>
      )}

      {/* FIELD WEIGHTS: Compact Helix Display */}
      <div className="relative border-2 border-cyan-500/30 rounded-xl p-4 bg-gradient-to-br from-cyan-900/10 to-blue-900/10">
        <div className="text-sm text-cyan-400 font-mono font-bold mb-3">FIELD WEIGHTS</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(run.cron_data.felder).map(([field, weight]) => (
            <motion.div
              key={field}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-lg"
              whileHover={{ scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.6)' }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span className="text-xs text-gray-400 font-mono">{field}</span>
              <span className="text-sm text-cyan-400 font-mono font-bold">{weight}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
