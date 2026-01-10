'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { CalibrationRun } from '@/types/calibrax';
import { classifyAllOrgans } from '@/lib/calibrax/classifyOrgans';
import { EchoChamberModal } from './EchoChamberModal';

interface SyntxFieldViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  run: CalibrationRun;
}

export function SyntxFieldViewModal({ isOpen, onClose, run }: SyntxFieldViewModalProps) {
  const [organsByPosition, setOrgansByPosition] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [echoChamberOpen, setEchoChamberOpen] = useState<'input' | 'output' | null>(null);

  const timestamp = new Date(run.timestamp).toLocaleString('de-DE');
  const duration = (run.meta.duration_ms / 1000).toFixed(2);
  const hasUserPrompt = run.stages?.gpt_user_prompt && run.stages.gpt_user_prompt.trim() !== "";

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      classifyAllOrgans(run.cron_data.felder)
        .then(setOrgansByPosition)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, run.cron_data.felder]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with Galactic Pattern */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            >
              {/* Starfield Background */}
              <div className="absolute inset-0 opacity-40">
                {[...Array(100)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Modal - TOP POSITIONED */}
            <div className="fixed inset-x-0 top-8 z-50 flex justify-center p-4 pointer-events-none overflow-y-auto max-h-[90vh]">
              <motion.div
                className="relative max-w-7xl w-full pointer-events-auto"
                initial={{ scale: 0.9, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Outer Galactic Glow */}
                <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-purple-500/30 to-pink-500/20 rounded-3xl blur-3xl" />
                
                {/* Main Body - Cyber Frame */}
                <div className="relative bg-gradient-to-b from-gray-950 via-black to-gray-950 border-2 border-cyan-400/40 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
                  {/* Top Energy Pulse */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400"
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: '200% 200%' }}
                  />

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-400/60 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-400/60 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400/60 rounded-br-2xl" />

                  {/* HEADER - Cyber Style */}
                  <div className="relative bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 border-b border-cyan-500/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.05, 1],
                            boxShadow: ['0 0 10px rgba(6, 182, 212, 0.5)', '0 0 20px rgba(6, 182, 212, 0.8)', '0 0 10px rgba(6, 182, 212, 0.5)']
                          }} 
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Image src="/Logo1.png" alt="SYNTX" width={48} height={48} className="rounded-lg" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                            SYNTX FIELD MATRIX
                          </h2>
                          <p className="text-xs text-gray-500 font-mono">{timestamp}</p>
                        </div>
                      </div>
                      <motion.button 
                        onClick={onClose} 
                        className="p-2 hover:bg-red-500/20 rounded-xl border border-red-500/30 backdrop-blur-sm" 
                        whileHover={{ scale: 1.1, borderColor: 'rgba(239, 68, 68, 0.6)' }}
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </motion.button>
                    </div>

                    {/* Vital Stats - Cyber Grid */}
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      <CyberStat label="PULSE" value={duration + 's'} color="cyan" />
                      <CyberStat label="INTEGRITY" value={run.scores.overall + '%'} color="purple" />
                      <CyberStat label="COMPLETE" value={run.scores.field_completeness + '%'} color="green" />
                      <CyberStat label="STRUCTURE" value={run.scores.structure_adherence + '%'} color="pink" />
                      <CyberStat label="STATUS" value={run.meta.success ? 'ONLINE' : 'ERROR'} color={run.meta.success ? 'green' : 'red'} />
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-6 space-y-6">
                    
                    {/* DNA CORE - Cyber Enhanced */}
                    <div className="relative text-center p-6 bg-gradient-to-r from-purple-900/20 via-black/40 to-pink-900/20 border border-purple-500/40 rounded-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"
                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        style={{ backgroundSize: '200% 200%' }}
                      />
                      <div className="relative">
                        <motion.div
                          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-wider"
                          animate={{ 
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            textShadow: ['0 0 10px rgba(6, 182, 212, 0.5)', '0 0 20px rgba(6, 182, 212, 0.8)', '0 0 10px rgba(6, 182, 212, 0.5)']
                          }}
                          transition={{ duration: 5, repeat: Infinity }}
                          style={{ backgroundSize: '200% 200%' }}
                        >
                          {run.stages?.gpt_system_prompt || 'SYNTEX::TRUE_RAW'}
                        </motion.div>
                        <p className="text-xs text-gray-500 mt-2 font-mono">SYSTEM DNA CORE</p>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <motion.div
                          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    ) : (
                      <>
                        {/* FIELD MATRIX - Full Cyber Layout */}
                        <div className="relative min-h-[400px] border border-cyan-500/30 rounded-2xl p-6 bg-gradient-to-b from-gray-950/50 via-black/80 to-gray-950/50 overflow-hidden backdrop-blur-sm">
                          {/* Galactic Grid Background */}
                          <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute inset-0" style={{
                              backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                              backgroundSize: '50px 50px'
                            }} />
                          </div>

                          {/* DNA Helix */}
                          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                            <motion.path
                              d="M 30% 0% Q 20% 15%, 30% 30% T 30% 60% T 30% 90% T 30% 100%"
                              stroke="url(#gradient1)"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray="10 5"
                              animate={{ strokeDashoffset: [0, -100] }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.path
                              d="M 70% 0% Q 80% 15%, 70% 30% T 70% 60% T 70% 90% T 70% 100%"
                              stroke="url(#gradient2)"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray="10 5"
                              animate={{ strokeDashoffset: [0, 100] }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            <defs>
                              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#ec4899" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* TOP LAYER */}
                          <div className="relative flex justify-center gap-4 mb-8 flex-wrap">
                            {organsByPosition['top-center']?.map(o => <CyberNode key={o.field} node={o} />)}
                            {organsByPosition['top-sides']?.map(o => <CyberNode key={o.field} node={o} />)}
                            {organsByPosition['top-center-left']?.map(o => <CyberNode key={o.field} node={o} />)}
                            {organsByPosition['top-center-right']?.map(o => <CyberNode key={o.field} node={o} />)}
                          </div>

                          {/* MIDDLE LAYER */}
                          <div className="relative grid grid-cols-3 gap-4 mb-8">
                            <div className="flex flex-col gap-2">
                              {organsByPosition['middle-left']?.map(o => <CyberNode key={o.field} node={o} />)}
                              {organsByPosition['middle-left-lower']?.map(o => <CyberNode key={o.field} node={o} />)}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              {organsByPosition['middle-center']?.map(o => <CyberNode key={o.field} node={o} />)}
                            </div>
                            <div className="flex flex-col gap-2">
                              {organsByPosition['middle-right']?.map(o => <CyberNode key={o.field} node={o} />)}
                              {organsByPosition['middle-right-lower']?.map(o => <CyberNode key={o.field} node={o} />)}
                            </div>
                          </div>

                          {/* BOTTOM LAYER */}
                          <div className="relative flex justify-center gap-4 mb-4 flex-wrap">
                            {organsByPosition['bottom-left']?.map(o => <CyberNode key={o.field} node={o} />)}
                            {organsByPosition['bottom-center']?.map(o => <CyberNode key={o.field} node={o} />)}
                          </div>

                          {/* FLOW NODES */}
                          <div className="relative flex flex-wrap gap-2 justify-center mt-4">
                            {organsByPosition['all']?.map(o => <FlowChip key={o.field} node={o} />)}
                            {organsByPosition['background']?.map(o => <FlowChip key={o.field} node={o} />)}
                            {organsByPosition['unknown']?.map(o => <FlowChip key={o.field} node={o} />)}
                          </div>
                        </div>

                        {/* ECHO CHAMBER BUTTONS - BRUTAL CYBER STYLE */}
                        <div className="grid grid-cols-2 gap-6">
                          <EchoChamberButton
                            title="INPUT STREAM"
                            hasContent={!!hasUserPrompt}
                            onClick={() => setEchoChamberOpen('input')}
                            color="cyan"
                          />
                          <EchoChamberButton
                            title="OUTPUT CORE"
                            hasContent={!!run.stages?.gpt_output_meta_prompt}
                            onClick={() => setEchoChamberOpen('output')}
                            color="purple"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ECHO CHAMBER MODALS */}
      <EchoChamberModal
        isOpen={echoChamberOpen === 'input'}
        onClose={() => setEchoChamberOpen(null)}
        title="INPUT STREAM"
        content={run.stages?.gpt_user_prompt || undefined}
        type="input"
      />
      <EchoChamberModal
        isOpen={echoChamberOpen === 'output'}
        onClose={() => setEchoChamberOpen(null)}
        title="OUTPUT CORE"
        content={run.stages?.gpt_output_meta_prompt || undefined}
        type="output"
      />
    </>
  );
}

// Cyber Components

function CyberStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, { border: string; bg: string; text: string }> = {
    cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-900/10', text: 'text-cyan-400' },
    purple: { border: 'border-purple-500/40', bg: 'bg-purple-900/10', text: 'text-purple-400' },
    green: { border: 'border-green-500/40', bg: 'bg-green-900/10', text: 'text-green-400' },
    pink: { border: 'border-pink-500/40', bg: 'bg-pink-900/10', text: 'text-pink-400' },
    red: { border: 'border-red-500/40', bg: 'bg-red-900/10', text: 'text-red-400' },
  };
  const c = colors[color] || colors.cyan;
  
  return (
    <motion.div 
      className={`border ${c.border} ${c.bg} rounded p-2 backdrop-blur-sm`}
      whileHover={{ scale: 1.05, borderColor: c.border.replace('/40', '/60') }}
    >
      <div className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">{label}</div>
      <div className={`text-sm font-mono font-bold ${c.text}`}>{value}</div>
    </motion.div>
  );
}

function CyberNode({ node }: { node: any }) {
  return (
    <motion.div
      className="relative border rounded-xl p-4 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-900/90 backdrop-blur-sm min-w-[180px]"
      style={{ borderColor: `${node.color}60` }}
      animate={{ 
        boxShadow: [
          `0 0 15px ${node.color}30`, 
          `0 0 25px ${node.color}50`, 
          `0 0 15px ${node.color}30`
        ]
      }}
      transition={{ duration: 3, repeat: Infinity }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 0 30px ${node.color}70`
      }}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l rounded-tl-xl" style={{ borderColor: node.color }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r rounded-br-xl" style={{ borderColor: node.color }} />
      
      <div className="flex items-center gap-3 mb-3">
        <motion.span 
          className="text-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {node.emoji}
        </motion.span>
        <div className="flex-1">
          <div className="text-lg font-bold text-white font-mono">{node.weight}</div>
        </div>
      </div>
      
      {/* FIELD NAME - MEGA PROMINENT */}
      <div 
        className="text-sm font-mono font-black uppercase tracking-widest mt-2 truncate"
        style={{ color: node.color }}
      >
        {node.field}
      </div>
    </motion.div>
  );
}

function FlowChip({ node }: { node: any }) {
  return (
    <motion.div
      className="px-4 py-2 rounded-full border bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm"
      style={{ borderColor: `${node.color}80` }}
      animate={{ 
        opacity: [0.7, 1, 0.7],
        boxShadow: [`0 0 10px ${node.color}40`, `0 0 20px ${node.color}60`, `0 0 10px ${node.color}40`]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-xs font-mono font-bold text-white">
        {node.emoji} <span style={{ color: node.color }}>{node.field.toUpperCase()}</span>
      </span>
    </motion.div>
  );
}

function EchoChamberButton({ title, hasContent, onClick, color }: { title: string; hasContent: boolean; onClick: () => void; color: string }) {
  const colorValue = color === 'cyan' ? '#06b6d4' : '#a855f7';
  
  return (
    <motion.button
      onClick={onClick}
      className="relative border-2 rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-sm overflow-hidden"
      style={{ borderColor: `${colorValue}60` }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 0 40px ${colorValue}60`
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Pulse */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle, ${colorValue}20 0%, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xl font-black tracking-wider mb-2" style={{ color: colorValue }}>
            {title}
          </div>
          <div className="flex items-center gap-2 text-sm font-mono">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hasContent ? '#22c55e' : '#eab308' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-gray-400">
              {hasContent ? 'SIGNAL ACTIVE' : 'EMPTY'}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Eye className="w-8 h-8" style={{ color: colorValue }} />
        </motion.div>
      </div>
    </motion.button>
  );
}
