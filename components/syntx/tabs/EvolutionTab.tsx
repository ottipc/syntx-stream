'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  SyntxVsNormal,
  NeuralTimeline,
  TopicSnapshotTrending,
  LiveDriftField,
  PromptTimeline,
  GhostLayers
} from '@/components/syntx/evolution';

export function EvolutionTab() {
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    const interval = setInterval(() => {
      setMatrixChars(Array.from({ length: 50 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* MATRIX RAIN */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-xs"
            style={{ left: `${i * 2}%`, top: -100 }}
            animate={{ y: [0, 1000], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j}>{matrixChars[j]}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* SCAN LINE */}
      <motion.div
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 z-10 pointer-events-none"
        style={{ top: `${scanLine}%` }}
      />

      {/* CYBER GRID */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 space-y-8 pb-20">
        {/* HEADER */}
        <div className="relative py-16 overflow-hidden">
          <div className="text-center relative">
            <motion.div className="flex justify-center items-center gap-4 mb-8">
              <motion.div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-500 to-cyan-500" animate={{ scaleX: [0, 1] }} transition={{ duration: 1.5 }} />
              <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}>
                <Image src="/Logo1.png" alt="SYNTX" width={80} height={80} className="drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
              </motion.div>
              <motion.div className="w-32 h-px bg-gradient-to-l from-transparent via-cyan-500 to-cyan-500" animate={{ scaleX: [0, 1] }} transition={{ duration: 1.5 }} />
            </motion.div>

            <motion.h1 className="text-7xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6" style={{ letterSpacing: '0.1em' }}>
              SYNTX EVOLUTION
            </motion.h1>

            <p className="text-cyan-400 text-2xl font-bold tracking-wider mb-2">System Transformation Timeline</p>
            <p className="text-gray-600 text-sm font-mono">
              <span className="text-cyan-500">{'>> '}</span>"Evolution is felt before it's tracked"<span className="text-cyan-500 animate-pulse"> █</span>
            </p>
          </div>
        </div>

        {/* COMPONENTS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-8">
          <SyntxVsNormal />
          <NeuralTimeline />
          <TopicSnapshotTrending />
          <LiveDriftField />
          <PromptTimeline />
          <GhostLayers />
        </motion.div>
      </div>

      {/* CORNER DECORATIONS */}
      {[0, 1, 2, 3].map(corner => (
        <motion.div
          key={corner}
          className="fixed w-32 h-32 border-cyan-500/30 pointer-events-none z-20"
          style={{
            top: corner < 2 ? 0 : 'auto',
            bottom: corner >= 2 ? 0 : 'auto',
            left: corner % 2 === 0 ? 0 : 'auto',
            right: corner % 2 === 1 ? 0 : 'auto',
            borderTopWidth: corner < 2 ? '4px' : 0,
            borderBottomWidth: corner >= 2 ? '4px' : 0,
            borderLeftWidth: corner % 2 === 0 ? '4px' : 0,
            borderRightWidth: corner % 2 === 1 ? '4px' : 0,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: corner * 0.5 }}
        />
      ))}
    </div>
  );
}
