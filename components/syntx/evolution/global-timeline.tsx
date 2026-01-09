'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Zap, Activity } from 'lucide-react';

interface Generation {
  generation: number;
  timestamp: string;
  avg_score: number;
  sample_count: number;
  prompts_generated: number;
}

interface ProgressData {
  status: string;
  generationen: number;
  progress: Generation[];
  trend: string;
  verbesserung: number;
}

export function GlobalEvolutionTimeline() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredGen, setHoveredGen] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://dev.syntx-system.com/api/strom/generation/progress')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black/80 border-2 border-purple-500/30 rounded-3xl p-8 flex items-center justify-center">
        <Clock className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!data?.progress) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-400';
    if (score >= 40) return 'from-orange-400 to-red-400';
    return 'from-red-500 to-rose-600';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 80) return '0 0 40px rgba(74,222,128,1)';
    if (score >= 60) return '0 0 40px rgba(250,204,21,1)';
    if (score >= 40) return '0 0 40px rgba(251,146,60,1)';
    return '0 0 40px rgba(239,68,68,1)';
  };

  const maxScore = Math.max(...data.progress.map(g => g.avg_score));
  const minScore = Math.min(...data.progress.map(g => g.avg_score));

  return (
    <div className="relative bg-black rounded-3xl border-4 border-purple-400 overflow-hidden shadow-2xl shadow-purple-500/50">
      {/* Animated circuit pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ 
          backgroundPosition: ['0px 0px', '200px 200px', '0px 0px']
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 48%, rgba(168,85,247,0.5) 49%, rgba(168,85,247,0.5) 51%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(168,85,247,0.5) 49%, rgba(168,85,247,0.5) 51%, transparent 52%)
          `,
          backgroundSize: '50px 50px'
        }} 
      />

      {/* Flowing particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: '-10px'
            }}
            animate={{
              left: ['0%', '110%'],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8 border-b-2 border-purple-900/30 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <TrendingUp className="text-purple-400" size={40} />
              </motion.div>
              <div>
                <h3 className="text-purple-400 font-black text-4xl tracking-wider uppercase mb-1">
                  GLOBAL SYSTEM EVOLUTION
                </h3>
                <p className="text-gray-400 text-sm font-mono flex items-center gap-2">
                  <Activity size={14} className="text-purple-500 animate-pulse" />
                  {data.generationen} Generationen · Trend: {data.trend} · Verbesserung: +{data.verbesserung.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Live indicator */}
            <motion.div 
              className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-xl border-2 border-purple-500/30"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-purple-400 font-mono text-sm font-bold">LIVE STREAM</span>
            </motion.div>
          </div>

          {/* Equalizer visualization */}
          <div className="flex items-end justify-center gap-1 h-12">
            {data.progress.map((gen, idx) => (
              <motion.div
                key={gen.generation}
                className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                animate={{ 
                  height: [`${20}%`, `${(gen.avg_score / maxScore) * 100}%`],
                  opacity: [0.3, 1]
                }}
                transition={{ 
                  duration: 1,
                  delay: idx * 0.1
                }}
              />
            ))}
          </div>
        </div>

        {/* Timeline - Rest des Codes bleibt gleich... */}
        <div className="text-center text-gray-500 py-8">Timeline wird geladen...</div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-purple-500/10 rounded-2xl p-6 border-2 border-purple-500/30">
            <div className="text-gray-400 text-sm mb-2 font-bold">BEST SCORE</div>
            <div className="text-green-400 font-black text-4xl">{maxScore.toFixed(1)}</div>
          </div>
          <div className="bg-purple-500/10 rounded-2xl p-6 border-2 border-purple-500/30">
            <div className="text-gray-400 text-sm mb-2 font-bold">IMPROVEMENT</div>
            <div className="text-green-400 font-black text-4xl">+{data.verbesserung.toFixed(1)}%</div>
          </div>
          <div className="bg-purple-500/10 rounded-2xl p-6 border-2 border-purple-500/30">
            <div className="text-gray-400 text-sm mb-2 font-bold">TOTAL PROMPTS</div>
            <div className="text-cyan-400 font-black text-4xl">
              {data.progress.reduce((sum, g) => sum + g.prompts_generated, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
