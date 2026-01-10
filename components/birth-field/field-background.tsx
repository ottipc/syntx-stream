'use client';

import { motion } from 'framer-motion';

type SystemState = 'stable' | 'stress' | 'drift';

export function FieldBackground({ state = 'stable' }: { state?: SystemState }) {
  const colors = {
    stable: ['rgba(0,50,80,0.2)', 'rgba(20,80,120,0.3)', 'rgba(0,50,80,0.2)'],
    stress: ['rgba(80,0,0,0.3)', 'rgba(120,20,20,0.4)', 'rgba(80,0,0,0.3)'],
    drift: ['rgba(80,0,80,0.3)', 'rgba(120,20,120,0.4)', 'rgba(80,0,80,0.3)']
  };

  return (
    <>
      {/* Pulsing background */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: colors[state]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Liquid nebula */}
      <svg className="fixed inset-0 w-full h-full -z-5 opacity-20 pointer-events-none">
        <defs>
          <filter id="liquidNebula">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3">
              <animate attributeName="baseFrequency" values="0.01;0.02;0.01" dur="10s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="20" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,100,150,0.3)" filter="url(#liquidNebula)" />
      </svg>

      {/* Grid impulses */}
      <div className="fixed inset-0 -z-8 pointer-events-none opacity-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400"
            style={{
              left: `${(i % 10) * 10}%`,
              top: `${Math.floor(i / 10) * 20}%`,
              boxShadow: '0 0 10px rgba(0,255,255,1)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </>
  );
}
