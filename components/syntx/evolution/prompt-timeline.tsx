'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Activity, Cpu } from 'lucide-react';

interface Prompt {
  id: string;
  timestamp: string;
  topic: string;
  score: number;
  wrapper?: string;
  style?: string;
  prompt_text?: string;
}

export function PromptTimeline() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPrompt, setHoveredPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    fetch('https://dev.syntx-system.com/api/strom/prompts/complete-export?page=1&page_size=100')
      .then(res => res.json())
      .then(data => data.exports && setPrompts(data.exports))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-black/80 border-2 border-cyan-500/30 rounded-3xl p-8"><Clock className="w-8 h-8 text-cyan-400 animate-spin mx-auto" /></div>;
  if (prompts.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'from-green-500 to-emerald-600', glow: '16,185,129', border: 'border-green-500', text: 'text-green-400' };
    if (score >= 60) return { bg: 'from-yellow-500 to-orange-500', glow: '234,179,8', border: 'border-yellow-500', text: 'text-yellow-400' };
    if (score >= 40) return { bg: 'from-orange-500 to-red-500', glow: '249,115,22', border: 'border-orange-500', text: 'text-orange-400' };
    return { bg: 'from-red-500 to-rose-600', glow: '239,68,68', border: 'border-red-500', text: 'text-red-400' };
  };

  const groupedByDay = prompts.reduce((acc, prompt) => {
    const day = new Date(prompt.timestamp).toLocaleDateString('de-DE');
    if (!acc[day]) acc[day] = [];
    acc[day].push(prompt);
    return acc;
  }, {} as Record<string, Prompt[]>);

  return (
    <>
      <div className="relative bg-black rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden shadow-[0_0_40px_rgba(cyan,0.4)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-cyan-400" size={28} />
          <h3 className="text-cyan-400 font-black text-2xl tracking-wider uppercase">PROMPT TIMELINE</h3>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-900/30" />
          <div className="space-y-6 pl-10">
            {Object.entries(groupedByDay).map(([day, dayPrompts], dayIdx) => (
              <motion.div key={day} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: dayIdx * 0.08 }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="absolute left-0 w-3 h-3 rounded-full bg-cyan-500 border-4 border-black -translate-x-1" />
                  <div className="text-cyan-400 font-bold text-base">{day}</div>
                  <div className="text-gray-500 text-xs">({dayPrompts.length})</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dayPrompts.map((prompt) => {
                    const colors = getScoreColor(prompt.score || 0);
                    return (
                      <motion.div
                        key={prompt.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 2.5 }}
                        onMouseEnter={() => setHoveredPrompt(prompt)}
                        onMouseLeave={() => setHoveredPrompt(null)}
                        className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${colors.bg} border-2 border-white cursor-pointer`}
                        style={{ boxShadow: `0 0 8px rgba(${colors.glow},0.8)` }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs">
          {[
            { grad: 'from-green-500 to-emerald-600', label: '80-100' },
            { grad: 'from-yellow-500 to-orange-500', label: '60-80' },
            { grad: 'from-orange-500 to-red-500', label: '40-60' },
            { grad: 'from-red-500 to-rose-600', label: '0-40' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${item.grad} border-2 border-white`} />
              <span className="text-gray-400 font-mono">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MEGA CYBER TOOLTIP PORTAL */}
      {hoveredPrompt && (
        <div className="fixed inset-0 pointer-events-none z-[99999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateX: -90 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative bg-black/95 rounded-3xl p-8 shadow-2xl"
            style={{ 
              minWidth: '500px',
              maxWidth: '600px',
              boxShadow: `0 0 80px rgba(${getScoreColor(hoveredPrompt.score || 0).glow},1), 0 30px 100px rgba(0,0,0,0.9)`,
              border: `4px solid rgb(${getScoreColor(hoveredPrompt.score || 0).glow})`
            }}
          >
            {/* Animated circuit background */}
            <motion.div 
              className="absolute inset-0 opacity-5 rounded-3xl"
              animate={{ 
                backgroundPosition: ['0px 0px', '100px 100px', '0px 0px']
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: `
                  linear-gradient(90deg, transparent 48%, rgba(${getScoreColor(hoveredPrompt.score || 0).glow},0.5) 49%, rgba(${getScoreColor(hoveredPrompt.score || 0).glow},0.5) 51%, transparent 52%),
                  linear-gradient(0deg, transparent 48%, rgba(${getScoreColor(hoveredPrompt.score || 0).glow},0.5) 49%, rgba(${getScoreColor(hoveredPrompt.score || 0).glow},0.5) 51%, transparent 52%)
                `,
                backgroundSize: '30px 30px'
              }} 
            />

            {/* Flowing particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: `rgb(${getScoreColor(hoveredPrompt.score || 0).glow})`,
                    top: `${Math.random() * 100}%`,
                    left: '-10px',
                    boxShadow: `0 0 10px rgb(${getScoreColor(hoveredPrompt.score || 0).glow})`
                  }}
                  animate={{
                    left: ['0%', '110%'],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear"
                  }}
                />
              ))}
            </div>

            {/* Header with massive score */}
            <div className="relative mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu className={getScoreColor(hoveredPrompt.score || 0).text} size={32} />
                    </motion.div>
                    <div>
                      <div className={`${getScoreColor(hoveredPrompt.score || 0).text} font-black text-3xl uppercase tracking-wider`}>
                        {hoveredPrompt.topic}
                      </div>
                      <div className="text-gray-500 text-sm font-mono mt-1">
                        FIELD RESONANCE ANALYSIS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Massive score badge */}
                <motion.div
                  className={`relative bg-gradient-to-br ${getScoreColor(hoveredPrompt.score || 0).bg} rounded-2xl p-6 border-4 border-white`}
                  animate={{
                    boxShadow: [
                      `0 0 20px rgba(${getScoreColor(hoveredPrompt.score || 0).glow},0.5)`,
                      `0 0 60px rgba(${getScoreColor(hoveredPrompt.score || 0).glow},1)`,
                      `0 0 20px rgba(${getScoreColor(hoveredPrompt.score || 0).glow},0.5)`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-white font-black text-6xl leading-none text-center">
                    {hoveredPrompt.score || 0}
                  </div>
                  <div className="text-white/80 text-xs font-mono text-center mt-2">
                    SCORE
                  </div>
                  
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-4 border-white/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Info grid with strom cards */}
            <div className="relative grid grid-cols-2 gap-4 mb-6">
              {hoveredPrompt.wrapper && (
                <motion.div 
                  className="relative bg-purple-500/10 rounded-xl p-4 border-2 border-purple-500/30 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative">
                    <div className="text-purple-400 text-xs font-mono mb-2 flex items-center gap-2">
                      <Zap size={12} />
                      WRAPPER
                    </div>
                    <div className="text-white font-bold text-lg">{hoveredPrompt.wrapper}</div>
                  </div>
                </motion.div>
              )}

              {hoveredPrompt.style && (
                <motion.div 
                  className="relative bg-cyan-500/10 rounded-xl p-4 border-2 border-cyan-500/30 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  />
                  <div className="relative">
                    <div className="text-cyan-400 text-xs font-mono mb-2 flex items-center gap-2">
                      <Activity size={12} />
                      STYLE
                    </div>
                    <div className="text-white font-bold text-lg">{hoveredPrompt.style}</div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Timestamp with flowing bar */}
            <div className="relative bg-gray-900/50 rounded-xl p-4 border-2 border-gray-700 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, rgb(${getScoreColor(hoveredPrompt.score || 0).glow}), transparent)`
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-gray-500 text-xs font-mono">TIMESTAMP</span>
                </div>
                <div className="text-white font-mono text-sm">
                  {new Date(hoveredPrompt.timestamp).toLocaleString('de-DE')}
                </div>
              </div>
            </div>

            {/* Preview if available */}
            {hoveredPrompt.prompt_text && (
              <div className="relative mt-4 bg-black/70 rounded-xl p-4 border-2 border-cyan-900 overflow-hidden max-h-32">
                <div className="text-gray-500 text-xs font-mono mb-2 flex items-center gap-2">
                  <Activity size={12} />
                  FIELD PREVIEW
                </div>
                <div className="text-gray-400 text-sm leading-relaxed overflow-y-auto max-h-20">
                  {hoveredPrompt.prompt_text.slice(0, 200)}
                  {hoveredPrompt.prompt_text.length > 200 ? '...' : ''}
                </div>
              </div>
            )}

            {/* Corner brackets - larger */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4" style={{ borderColor: `rgb(${getScoreColor(hoveredPrompt.score || 0).glow})` }} />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4" style={{ borderColor: `rgb(${getScoreColor(hoveredPrompt.score || 0).glow})` }} />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4" style={{ borderColor: `rgb(${getScoreColor(hoveredPrompt.score || 0).glow})` }} />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4" style={{ borderColor: `rgb(${getScoreColor(hoveredPrompt.score || 0).glow})` }} />
          </motion.div>
        </div>
      )}
    </>
  );
}
