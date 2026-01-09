'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SyntxBorderProps {
  children: ReactNode;
  color?: 'cyan' | 'purple' | 'red' | 'green' | 'orange';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function SyntxBorder({ children, color = 'cyan', intensity = 'medium', className = '' }: SyntxBorderProps) {
  const colorMap = {
    cyan: { from: '#06b6d4', via: '#a855f7', to: '#ef4444', glow: '6,182,212' },
    purple: { from: '#a855f7', via: '#ec4899', to: '#06b6d4', glow: '168,85,247' },
    red: { from: '#ef4444', via: '#f97316', to: '#eab308', glow: '239,68,68' },
    green: { from: '#10b981', via: '#06b6d4', to: '#a855f7', glow: '16,185,129' },
    orange: { from: '#f97316', via: '#eab308', to: '#10b981', glow: '249,115,22' }
  };

  const colors = colorMap[color];
  const particleCount = intensity === 'high' ? 20 : intensity === 'medium' ? 12 : 6;

  return (
    <div className={`relative ${className}`}>
      {/* LAYER 1: OUTER FLOW FIELD (Stromkante) */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, ${colors.from}, ${colors.via}, ${colors.to}, ${colors.from})`,
          padding: '4px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          filter: `drop-shadow(0 0 20px rgba(${colors.glow},0.8))`
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* LAYER 2: INNER CYBER LINEWORK (Netzhaut) */}
      <motion.div
        className="absolute inset-[6px] rounded-3xl pointer-events-none opacity-10"
        animate={{ 
          backgroundPosition: ['0px 0px', '30px 30px', '0px 0px']
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 48%, rgba(${colors.glow},0.8) 49%, rgba(${colors.glow},0.8) 51%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(${colors.glow},0.8) 49%, rgba(${colors.glow},0.8) 51%, transparent 52%)
          `,
          backgroundSize: '15px 15px'
        }}
      />

      {/* LAYER 3: CORNER MODULES (Synapsenhalter) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl overflow-visible">
        <defs>
          <filter id={`cornerGlow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Top Left Corner */}
        <motion.path
          d="M 20 0 L 60 0 M 0 20 L 0 60"
          stroke={colors.from}
          strokeWidth="4"
          fill="none"
          filter={`url(#cornerGlow-${color})`}
          animate={{
            opacity: [0.5, 1, 0.5],
            strokeWidth: [3, 5, 3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Top Right Corner */}
        <motion.path
          d="M calc(100% - 60) 0 L calc(100% - 20) 0 M 100% 20 L 100% 60"
          stroke={colors.via}
          strokeWidth="4"
          fill="none"
          filter={`url(#cornerGlow-${color})`}
          animate={{
            opacity: [0.5, 1, 0.5],
            strokeWidth: [3, 5, 3]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Bottom Left Corner */}
        <motion.path
          d="M 0 calc(100% - 60) L 0 calc(100% - 20) M 20 100% L 60 100%"
          stroke={colors.to}
          strokeWidth="4"
          fill="none"
          filter={`url(#cornerGlow-${color})`}
          animate={{
            opacity: [0.5, 1, 0.5],
            strokeWidth: [3, 5, 3]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        {/* Bottom Right Corner */}
        <motion.path
          d="M 100% calc(100% - 60) L 100% calc(100% - 20) M calc(100% - 20) 100% L calc(100% - 60) 100%"
          stroke={colors.from}
          strokeWidth="4"
          fill="none"
          filter={`url(#cornerGlow-${color})`}
          animate={{
            opacity: [0.5, 1, 0.5],
            strokeWidth: [3, 5, 3]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </svg>

      {/* LAYER 4: GLOW PARTICLE STREAMS (Lichtader) */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        {Array.from({ length: particleCount }).map((_, i) => {
          const side = i % 4;
          const progress = (i / particleCount) * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: colors.from,
                boxShadow: `0 0 10px ${colors.from}, 0 0 20px ${colors.from}`,
                ...(side === 0 ? { top: 0, left: `${progress}%` } :
                    side === 1 ? { right: 0, top: `${progress}%` } :
                    side === 2 ? { bottom: 0, right: `${progress}%` } :
                    { left: 0, bottom: `${progress}%` })
              }}
              animate={
                side === 0 ? { left: ['0%', '100%'], opacity: [0, 1, 1, 0] } :
                side === 1 ? { top: ['0%', '100%'], opacity: [0, 1, 1, 0] } :
                side === 2 ? { right: ['0%', '100%'], opacity: [0, 1, 1, 0] } :
                { bottom: ['0%', '100%'], opacity: [0, 1, 1, 0] }
              }
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: (i / particleCount) * 3,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      {/* Hover Pulse Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 80px rgba(${colors.glow},0.3), 0 0 40px rgba(${colors.glow},0.6)`
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative bg-black rounded-3xl group">
        {children}
      </div>
    </div>
  );
}
