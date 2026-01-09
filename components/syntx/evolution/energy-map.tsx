'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

interface SystemEnergy {
  mutation: number;
  inputDensity: number;
  driftTension: number;
  topicFriction: number;
}

interface TopicData {
  count: number;
  avg_score: number;
  perfect_count: number;
}

export function GlobalEnergyMap() {
  const [energy, setEnergy] = useState<SystemEnergy>({
    mutation: 0,
    inputDensity: 0,
    driftTension: 0,
    topicFriction: 0
  });

  const [particles, setParticles] = useState<Array<{
    id: number;
    color: string;
    y: number;
    speed: number;
  }>>([]);

  // Fetch real data and calculate energy
  useEffect(() => {
    Promise.all([
      fetch('https://dev.syntx-system.com/api/strom/analytics/topics').then(r => r.json()),
      fetch('https://dev.syntx-system.com/api/strom/feld/drift').then(r => r.json())
    ]).then(([topicsData, driftData]) => {
      const topics: Record<string, TopicData> = topicsData.topics || {};
      const totalCount = Object.values(topics).reduce((sum, t) => sum + t.count, 0);
      const avgScore = Object.values(topics).reduce((sum, t) => sum + t.avg_score, 0) / Object.keys(topics).length;
      const driftCount = driftData.count || 0;

      // Calculate energy metrics
      const scoreVariance = Object.values(topics).reduce((sum, t) => sum + Math.abs(t.avg_score - avgScore), 0) / Object.keys(topics).length;
      
      setEnergy({
        mutation: Math.min(scoreVariance / 50, 1), // 0-1 based on score variance
        inputDensity: Math.min(totalCount / 500, 1), // 0-1 based on total prompts
        driftTension: Math.min(driftCount / 30, 1), // 0-1 based on drift bodies
        topicFriction: Math.min(scoreVariance / 40, 1) // 0-1 based on topic differences
      });
    }).catch(console.error);
  }, []);

  // Generate particles based on system energy
  useEffect(() => {
    const interval = setInterval(() => {
      const avgEnergy = (energy.mutation + energy.inputDensity + energy.driftTension + energy.topicFriction) / 4;
      
      // Determine particle color based on dominant energy
      let color = 'rgba(6,182,212,0.8)'; // Türkis = Klarheit (default)
      
      if (energy.driftTension > 0.6) {
        color = 'rgba(236,72,153,0.8)'; // Magenta = Drift
      } else if (energy.topicFriction > 0.6) {
        color = 'rgba(250,204,21,0.8)'; // Gelb = Reibung
      } else if (avgEnergy > 0.85) {
        color = 'rgba(255,255,255,0.9)'; // Weiß = Breakthrough
      }
      
      setParticles(prev => [
        ...prev.slice(-40),
        {
          id: Date.now() + Math.random(),
          color,
          y: 30 + Math.random() * 40,
          speed: 1.5 + avgEnergy * 3
        }
      ]);
    }, 150);

    return () => clearInterval(interval);
  }, [energy]);

  const avgEnergy = (energy.mutation + energy.inputDensity + energy.driftTension + energy.topicFriction) / 4;

  return (
    <div className="relative w-full h-56 bg-black rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden shadow-[0_0_40px_rgba(cyan,0.4)]">
      {/* Static Noise Background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Title */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity className="text-cyan-400" size={36} />
        </motion.div>
        <div>
          <h3 className="text-cyan-400 font-black text-3xl tracking-wider uppercase">
            GLOBALE ENERGIEMAP
          </h3>
          <p className="text-gray-500 text-xs font-mono mt-1">
            System Flux Field · Real-time Movement · EEG-Style
          </p>
        </div>
      </div>

      {/* Aurora Field - SVG Waves */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgb(250,204,21)', stopOpacity: 0.3 }} />
            <stop offset="20%" style={{ stopColor: 'rgb(6,182,212)', stopOpacity: 0.5 }} />
            <stop offset="40%" style={{ stopColor: 'rgb(236,72,153)', stopOpacity: 0.4 }} />
            <stop offset="60%" style={{ stopColor: 'rgb(6,182,212)', stopOpacity: 0.5 }} />
            <stop offset="80%" style={{ stopColor: 'rgb(168,85,247)', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(255,255,255)', stopOpacity: 0.3 }} />
          </linearGradient>
          
          <filter id="auroraGlow">
            <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Multiple Aurora Wave Layers */}
        {[0, 1, 2, 3].map((wave) => (
          <motion.path
            key={wave}
            d={`M 0,${50 + wave * 8} Q 250,${30 + wave * 8} 500,${50 + wave * 8} T 1000,${50 + wave * 8}`}
            fill="none"
            stroke="url(#auroraGrad)"
            strokeWidth={4 - wave * 0.5}
            filter="url(#auroraGlow)"
            opacity={0.4 + avgEnergy * 0.4 - wave * 0.08}
            animate={{ 
              d: [
                `M 0,${50 + wave * 8} Q 250,${20 + wave * 8} 500,${50 + wave * 8} T 1000,${50 + wave * 8}`,
                `M 0,${50 + wave * 8} Q 250,${80 + wave * 8} 500,${50 + wave * 8} T 1000,${50 + wave * 8}`,
                `M 0,${50 + wave * 8} Q 250,${20 + wave * 8} 500,${50 + wave * 8} T 1000,${50 + wave * 8}`,
              ]
            }}
            transition={{ 
              duration: 4 + wave * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: wave * 0.3
            }}
          />
        ))}
      </svg>

      {/* Flowing Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: particle.color,
              top: `${particle.y}%`,
              left: '-10px',
              boxShadow: `0 0 12px ${particle.color}, 0 0 24px ${particle.color}`
            }}
            animate={{
              left: ['0%', '110%'],
              opacity: [0, 1, 1, 0.8, 0],
              scale: [0.5, 1.2, 1, 0.8, 0.3]
            }}
            transition={{
              duration: 12 / particle.speed,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* EEG Centerline */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ 
          top: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
        }}
        animate={{
          scaleX: [1, 1.05, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Energy Metrics */}
      <div className="absolute bottom-4 right-6 flex gap-5 z-20">
        {[
          { label: 'MUTATION', value: energy.mutation, color: 'cyan', icon: '⚡' },
          { label: 'INPUT', value: energy.inputDensity, color: 'green', icon: '📊' },
          { label: 'DRIFT', value: energy.driftTension, color: 'pink', icon: '🔥' },
          { label: 'FRICTION', value: energy.topicFriction, color: 'yellow', icon: '⚙️' }
        ].map((metric) => (
          <motion.div 
            key={metric.label}
            className="text-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="flex items-center gap-1 justify-center mb-1">
              <span className="text-sm">{metric.icon}</span>
              <div className={`text-${metric.color}-400 text-[10px] font-mono font-bold`}>
                {metric.label}
              </div>
            </div>
            <div className="w-16 h-2 bg-black/70 rounded-full overflow-hidden border border-gray-800">
              <motion.div
                className={`h-full bg-gradient-to-r from-${metric.color}-600 to-${metric.color}-400`}
                animate={{ width: `${metric.value * 100}%` }}
                transition={{ duration: 0.8, type: "spring" }}
                style={{
                  boxShadow: `0 0 10px rgba(${
                    metric.color === 'cyan' ? '6,182,212' :
                    metric.color === 'green' ? '34,197,94' :
                    metric.color === 'pink' ? '236,72,153' : '250,204,21'
                  },0.8)`
                }}
              />
            </div>
            <div className="text-white text-xs font-mono mt-1">
              {Math.round(metric.value * 100)}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Status Badge */}
      <motion.div 
        className="absolute top-4 right-6 z-20 flex items-center gap-2 bg-black/80 px-4 py-2 rounded-xl border-2"
        style={{
          borderColor: avgEnergy > 0.7 ? 'rgba(236,72,153,0.6)' : 
                       avgEnergy > 0.4 ? 'rgba(250,204,21,0.6)' : 'rgba(6,182,212,0.6)'
        }}
        animate={{
          boxShadow: [
            `0 0 20px rgba(${avgEnergy > 0.7 ? '236,72,153' : avgEnergy > 0.4 ? '250,204,21' : '6,182,212'},0.3)`,
            `0 0 40px rgba(${avgEnergy > 0.7 ? '236,72,153' : avgEnergy > 0.4 ? '250,204,21' : '6,182,212'},0.8)`,
            `0 0 20px rgba(${avgEnergy > 0.7 ? '236,72,153' : avgEnergy > 0.4 ? '250,204,21' : '6,182,212'},0.3)`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap size={16} className={
          avgEnergy > 0.7 ? 'text-pink-400' :
          avgEnergy > 0.4 ? 'text-yellow-400' : 'text-cyan-400'
        } />
        <span className={`font-mono text-sm font-bold ${
          avgEnergy > 0.7 ? 'text-pink-400' :
          avgEnergy > 0.4 ? 'text-yellow-400' : 'text-cyan-400'
        }`}>
          {avgEnergy > 0.7 ? 'HIGH FLUX' : avgEnergy > 0.4 ? 'ACTIVE' : 'STABLE'}
        </span>
      </motion.div>
    </div>
  );
}
