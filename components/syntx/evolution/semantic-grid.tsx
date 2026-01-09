'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import kategorien from '@/data/kategorien.json';

interface TopicData {
  count: number;
  avg_score: number;
  perfect_count: number;
  min_score: number;
  max_score: number;
}

interface TopicsResponse {
  status: string;
  total_topics: number;
  topics: Record<string, TopicData>;
}

const getKategorieIcon = (kategorie: string) => {
  const kat = kategorien.kategorien[kategorie as keyof typeof kategorien.kategorien];
  return kat?.visual?.icon || '📦';
};

export function SemanticFieldGrid() {
  const [data, setData] = useState<TopicsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://dev.syntx-system.com/api/strom/analytics/topics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black/80 border-2 border-purple-500/30 rounded-3xl p-8">
        <Brain className="w-8 h-8 text-purple-400 animate-pulse mx-auto" />
      </div>
    );
  }

  if (!data?.topics) return null;

  const topics = Object.entries(data.topics);

  const getEmotionalColor = (avgScore: number) => {
    if (avgScore >= 70) return { from: '#10b981', to: '#06b6d4', glow: '16,185,129', border: 'border-emerald-500' };
    if (avgScore >= 50) return { from: '#06b6d4', to: '#a855f7', glow: '6,182,212', border: 'border-cyan-500' };
    if (avgScore >= 30) return { from: '#f59e0b', to: '#eab308', glow: '245,158,11', border: 'border-orange-500' };
    return { from: '#ef4444', to: '#f97316', glow: '239,68,68', border: 'border-red-500' };
  };

  return (
    <div className="relative bg-black rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden shadow-[0_0_40px_rgba(purple,0.4)] p-6">
      {/* Animated circuit lines background */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{ 
          backgroundPosition: ['0px 0px', '100px 100px', '0px 0px']
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 48%, rgba(168,85,247,0.5) 49%, rgba(168,85,247,0.5) 51%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(168,85,247,0.5) 49%, rgba(168,85,247,0.5) 51%, transparent 52%)
          `,
          backgroundSize: '30px 30px'
        }} 
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="text-purple-400" size={32} />
        </motion.div>
        <div>
          <h3 className="text-purple-400 font-black text-2xl tracking-wider uppercase">
            SEMANTIC FIELD GRID
          </h3>
          <p className="text-gray-500 text-xs font-mono mt-1">
            Living Topic Cards · Emotional Spectrum · {topics.length} Active
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="relative grid grid-cols-4 gap-4">
        {topics.map(([topic, stats], idx) => {
          const isSelected = selectedTopic === topic;
          const colors = getEmotionalColor(stats.avg_score);
          const movement = stats.avg_score < 40;
          
          return (
            <motion.div
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, type: "spring" }}
              whileHover={{ scale: 1.05, zIndex: 50 }}
              onClick={() => setSelectedTopic(isSelected ? null : topic)}
              className="relative cursor-pointer group"
            >
              {/* Outer glow container */}
              <motion.div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                  filter: 'blur(8px)'
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Main card */}
              <div className={`relative bg-black rounded-2xl border-2 ${colors.border} overflow-hidden h-40`}>
                {/* Animated border particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top particles */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`top-${i}`}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        top: 0,
                        left: `${i * 12.5}%`,
                        backgroundColor: colors.from,
                        boxShadow: `0 0 6px ${colors.from}`
                      }}
                      animate={{
                        left: [`${i * 12.5}%`, `${(i * 12.5 + 5) % 100}%`],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "linear"
                      }}
                    />
                  ))}

                  {/* Right particles */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`right-${i}`}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        right: 0,
                        top: `${i * 16.66}%`,
                        backgroundColor: colors.to,
                        boxShadow: `0 0 6px ${colors.to}`
                      }}
                      animate={{
                        top: [`${i * 16.66}%`, `${(i * 16.66 + 10) % 100}%`],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "linear"
                      }}
                    />
                  ))}

                  {/* Corner brackets with animation */}
                  <motion.div 
                    className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${colors.border}`}
                    animate={{
                      borderColor: [colors.from, colors.to, colors.from]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${colors.border}`}
                    animate={{
                      borderColor: [colors.to, colors.from, colors.to]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div 
                    className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${colors.border}`}
                    animate={{
                      borderColor: [colors.from, colors.to, colors.from]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                  <motion.div 
                    className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${colors.border}`}
                    animate={{
                      borderColor: [colors.to, colors.from, colors.to]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  />

                  {/* Diagonal data streams */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(${colors.glow},0.1) 8px, rgba(${colors.glow},0.1) 9px)`,
                    }}
                    animate={{
                      backgroundPosition: ['0px 0px', '20px 20px']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Gradient pulse background */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                    opacity: 0.15
                  }}
                  animate={{
                    opacity: [0.1, 0.25, 0.1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Radial flow for high movement topics */}
                {movement && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(${colors.glow},0.3) 0%, transparent 70%)`
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                  <motion.div
                    className="text-4xl mb-2"
                    animate={isSelected ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {getKategorieIcon(topic)}
                  </motion.div>
                  
                  <h4 className="text-white font-bold text-sm uppercase tracking-wide text-center mb-2">
                    {topic}
                  </h4>
                  
                  <div className="flex items-center gap-1 mb-1">
                    <motion.div
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={12} className="text-cyan-400" />
                    </motion.div>
                    <span className="text-cyan-400 font-mono text-lg font-black">
                      {stats.avg_score.toFixed(0)}
                    </span>
                  </div>

                  <div className="text-gray-500 text-xs font-mono mb-2">
                    {stats.count} samples
                  </div>

                  <motion.div 
                    className="flex items-center gap-1"
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap size={10} style={{ color: colors.from }} />
                    <span className="text-[10px] font-mono font-bold" style={{ color: colors.from }}>
                      {stats.avg_score >= 70 ? 'HARMONY' :
                       stats.avg_score >= 50 ? 'NEUTRAL' :
                       stats.avg_score >= 30 ? 'TENSION' : 'CONFLICT'}
                    </span>
                  </motion.div>
                </div>

                {/* Scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-px"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, rgba(${colors.glow},0.8), transparent)`
                  }}
                  animate={{
                    top: ['0%', '100%']
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: idx * 0.2
                  }}
                />
              </div>

              {/* Info Panel */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/98 border-2 border-purple-500 rounded-xl p-4 z-[100]"
                    style={{ boxShadow: `0 0 40px rgba(${colors.glow},0.8)` }}
                  >
                    <div className="space-y-2">
                      <div className="text-purple-400 font-black text-sm uppercase pb-2 border-b border-purple-900">
                        {topic}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">AVG:</span>
                          <span className="text-white font-bold">{stats.avg_score.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">RANGE:</span>
                          <span className="text-gray-300">{stats.min_score}-{stats.max_score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">SAMPLES:</span>
                          <span className="text-cyan-400 font-bold">{stats.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PERFECT:</span>
                          <span className="text-green-400 font-bold">{stats.perfect_count}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-900 flex items-center justify-between">
                        {stats.avg_score >= 70 ? <TrendingUp className="text-green-400" size={14} /> : <TrendingDown className="text-red-400" size={14} />}
                        <span className="text-cyan-400 text-[10px] font-mono">Model: Claude</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
