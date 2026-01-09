'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

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

export function NeuralTimeline() {
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

  if (loading || !data?.progress) return null;

  const maxScore = Math.max(...data.progress.map(g => g.avg_score));

  // Color based on maturity (score vs sample ratio)
  const getSynapseColor = (gen: Generation, prevGen?: Generation) => {
    const maturity = gen.avg_score / 100;
    const stability = prevGen ? Math.abs(gen.avg_score - prevGen.avg_score) < 5 : true;
    
    if (maturity > 0.8) return stability ? 'rgba(255,255,255,1)' : 'rgba(6,182,212,1)'; // White/Cyan
    if (maturity > 0.6) return 'rgba(6,182,212,1)'; // Cyan
    return 'rgba(168,85,247,1)'; // Purple
  };

  return (
    <div className="relative bg-black rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden shadow-[0_0_40px_rgba(purple,0.4)] p-8">
      {/* Static Noise Background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="text-purple-400" size={48} />
          </motion.div>
          <div>
            <h3 className="text-purple-400 font-black text-5xl tracking-wider uppercase font-['Orbitron']">
              NEURAL TIMELINE
            </h3>
            <p className="text-cyan-400 text-sm font-mono mt-2">
              {data.generationen} SYNAPTIC GENERATIONS · PULSE: {data.trend}
            </p>
          </div>
        </div>

        {/* Live Pulse Indicator */}
        <motion.div 
          className="flex items-center gap-3 bg-purple-500/10 px-6 py-3 rounded-2xl border-2 border-purple-500/30"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(168,85,247,0.3)',
              '0 0 40px rgba(168,85,247,0.8)',
              '0 0 20px rgba(168,85,247,0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-3 h-3 rounded-full bg-cyan-400"
            animate={{ 
              scale: [1, 1.8, 1],
              boxShadow: [
                '0 0 10px rgba(6,182,212,0.5)',
                '0 0 30px rgba(6,182,212,1)',
                '0 0 10px rgba(6,182,212,0.5)'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-cyan-400 font-mono text-sm font-bold">LIVE STREAM</span>
        </motion.div>
      </div>

      {/* Neural Timeline */}
      <div className="relative h-[400px] flex items-center">
        <svg className="w-full h-full">
          <defs>
            {/* Glow filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Connection Lines */}
          {data.progress.map((gen, idx) => {
            if (idx === 0) return null;
            const prevGen = data.progress[idx - 1];
            const x1 = (idx - 1) * (100 / (data.progress.length - 1));
            const x2 = idx * (100 / (data.progress.length - 1));
            const y1 = 50 - (prevGen.avg_score / maxScore) * 30;
            const y2 = 50 - (gen.avg_score / maxScore) * 30;
            
            const scoreDrop = gen.avg_score < prevGen.avg_score;
            const mutation = Math.abs(gen.avg_score - prevGen.avg_score) > 10;
            
            return (
              <motion.line
                key={`line-${idx}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={mutation ? 'rgba(6,182,212,0.8)' : 'rgba(168,85,247,0.4)'}
                strokeWidth={mutation ? '3' : '2'}
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  strokeDasharray: mutation ? [5, 5] : [0, 0]
                }}
                transition={{ 
                  duration: 1, 
                  delay: idx * 0.1,
                  strokeDasharray: { duration: 1, repeat: Infinity }
                }}
              />
            );
          })}

          {/* Synapse Points */}
          {data.progress.map((gen, idx) => {
            const x = idx * (100 / (data.progress.length - 1));
            const y = 50 - (gen.avg_score / maxScore) * 30;
            const prevGen = idx > 0 ? data.progress[idx - 1] : undefined;
            const isHovered = hoveredGen === gen.generation;
            
            return (
              <g key={`synapse-${idx}`}>
                {/* Outer glow ring */}
                <motion.circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={isHovered ? 25 : 15}
                  fill="none"
                  stroke={getSynapseColor(gen, prevGen)}
                  strokeWidth="2"
                  opacity="0.3"
                  filter="url(#glow)"
                  animate={{
                    r: isHovered ? [15, 35, 15] : [10, 20, 10],
                    opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                />

                {/* Core synapse */}
                <motion.circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={isHovered ? 12 : 8}
                  fill={getSynapseColor(gen, prevGen)}
                  filter="url(#glow)"
                  onMouseEnter={() => setHoveredGen(gen.generation)}
                  onMouseLeave={() => setHoveredGen(null)}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ scale: 1.5 }}
                />

                {/* Generation number */}
                <text
                  x={`${x}%`}
                  y={`${y + 15}%`}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontFamily="monospace"
                  opacity={isHovered ? 1 : 0.6}
                >
                  G{gen.generation}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredGen !== null && (() => {
          const gen = data.progress.find(g => g.generation === hoveredGen);
          if (!gen) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-0 right-0 bg-black/95 border-4 border-cyan-500 rounded-2xl p-6 min-w-[300px]"
              style={{ boxShadow: '0 0 60px rgba(6,182,212,1)' }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-cyan-900">
                  <Zap className="text-cyan-400" size={20} />
                  <span className="text-cyan-400 font-black text-xl">GEN {gen.generation}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono text-sm">Score:</span>
                  <span className="text-white font-black text-2xl">{gen.avg_score.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono text-sm">Samples:</span>
                  <span className="text-cyan-400 font-bold">{gen.sample_count}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono text-sm">Prompts:</span>
                  <span className="text-white font-bold">{gen.prompts_generated}</span>
                </div>

                <div className="text-gray-500 text-xs pt-3 border-t-2 border-cyan-900 font-mono">
                  {new Date(gen.timestamp).toLocaleString('de-DE')}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs mb-1 font-mono">PEAK</div>
          <div className="text-white font-black text-3xl">{maxScore.toFixed(1)}</div>
        </div>
        <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs mb-1 font-mono">DELTA</div>
          <div className="text-cyan-400 font-black text-3xl">+{data.verbesserung.toFixed(1)}%</div>
        </div>
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs mb-1 font-mono">TOTAL</div>
          <div className="text-white font-black text-3xl">
            {data.progress.reduce((sum, g) => sum + g.prompts_generated, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
