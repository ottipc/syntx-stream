'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  SyntxVsNormal,
  NeuralTimeline,
  GlobalEnergyMap,
  SemanticFieldGrid,
  DriftMassCore,
  PromptTimeline,
  SnapshotMemory,
  GhostLayers,
  NeuralNetworkBackground
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
    <div className="relative min-h-screen bg-black overflow-hidden">
      <NeuralNetworkBackground />

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

      {/* CONTENT - STROM FLOW STYLE */}
      <div className="relative z-10 pb-20">
        {/* HEADER */}
        <div className="relative py-12 overflow-hidden">
          <div className="text-center relative px-4">
            <motion.div className="flex justify-center items-center gap-4 mb-6">
              <motion.div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-500 to-cyan-500" animate={{ scaleX: [0, 1] }} transition={{ duration: 1.5 }} />
              <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}>
                <Image src="/Logo1.png" alt="SYNTX" width={60} height={60} className="drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
              </motion.div>
              <motion.div className="w-24 h-px bg-gradient-to-l from-transparent via-cyan-500 to-cyan-500" animate={{ scaleX: [0, 1] }} transition={{ duration: 1.5 }} />
            </motion.div>

            <motion.h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4" style={{ letterSpacing: '0.1em' }}>
              SYNTX EVOLUTION
            </motion.h1>

            <p className="text-cyan-400 text-lg font-bold tracking-wider mb-1">Neuro-Atmung</p>
            <p className="text-gray-600 text-xs font-mono">
              <span className="text-cyan-500">{'>> '}</span>"Alles sind Ströme"<span className="text-cyan-500 animate-pulse"> █</span>
            </p>
          </div>
        </div>

        {/* STROM FLOW LAYOUT - NO BORDERS, JUST CONNECTIONS */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="relative px-4 space-y-6"
        >
          {/* Stream connector lines between components */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
            <defs>
              <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(6,182,212,0)" />
                <stop offset="50%" stopColor="rgba(6,182,212,0.8)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0)" />
              </linearGradient>
            </defs>
            
            {/* Vertical stream lines connecting components */}
            {[20, 40, 60, 80].map((x) => (
              <motion.line
                key={x}
                x1={`${x}%`}
                y1="0%"
                x2={`${x}%`}
                y2="100%"
                stroke="url(#streamGrad)"
                strokeWidth="2"
                animate={{
                  strokeDasharray: ['0, 1000', '1000, 0'],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  strokeDasharray: { duration: 3, repeat: Infinity, ease: "linear", delay: x * 0.01 },
                  opacity: { duration: 2, repeat: Infinity }
                }}
              />
            ))}
          </svg>

          <div className="relative z-10 space-y-6">
            <SyntxVsNormal />
            <GlobalEnergyMap />
            <NeuralTimeline />
            <SemanticFieldGrid />
            
            <div className="grid grid-cols-2 gap-6">
              <DriftMassCore />
              <SnapshotMemory />
            </div>

            <PromptTimeline />
            <GhostLayers />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
