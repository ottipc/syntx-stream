'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface Snapshot {
  label: string;
  time: string;
  change: number; // -1 to 1
  status: 'stable' | 'improving' | 'declining';
}

export function SnapshotMemory() {
  // Mock data - later: fetch from /snapshots/history
  const snapshots: Snapshot[] = [
    { label: 'NOW', time: 'T-0', change: 0, status: 'stable' },
    { label: '5m', time: 'T-5m', change: 0.3, status: 'improving' },
    { label: '15m', time: 'T-15m', change: -0.2, status: 'declining' },
    { label: '1h', time: 'T-1h', change: 0.6, status: 'improving' },
    { label: '2h', time: 'T-2h', change: 0.1, status: 'stable' },
    { label: '6h', time: 'T-6h', change: -0.4, status: 'declining' },
  ];

  return (
    <div className="relative bg-black rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden shadow-[0_0_40px_rgba(cyan,0.4)] p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="text-cyan-400" size={40} />
        </motion.div>
        <div>
          <h3 className="text-cyan-400 font-black text-3xl tracking-wider uppercase">
            SNAPSHOT MEMORY
          </h3>
          <p className="text-gray-500 text-sm font-mono mt-1">
            Zeitsprung-Tunnel · Historical System States
          </p>
        </div>
      </div>

      {/* Tunnel Timeline */}
      <div className="relative h-48">
        {/* Perspective lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${10 + i * 15}%`}
              y2="100%"
              stroke="rgba(6,182,212,0.5)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Timeline */}
        <div className="absolute inset-0 flex items-center justify-between px-8">
          {snapshots.map((snap, idx) => {
            const size = 60 - idx * 8; // Perspective shrinking
            const glowIntensity = Math.abs(snap.change);
            
            return (
              <motion.div
                key={snap.time}
                className="relative group"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, type: "spring" }}
              >
                {/* Stop sphere */}
                <motion.div
                  className="rounded-full border-4 border-white flex items-center justify-center cursor-pointer"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: 
                      snap.status === 'improving' ? 'rgb(34,197,94)' :
                      snap.status === 'declining' ? 'rgb(239,68,68)' : 'rgb(107,114,128)',
                    boxShadow: `0 0 ${glowIntensity * 40}px rgba(${
                      snap.status === 'improving' ? '34,197,94' :
                      snap.status === 'declining' ? '239,68,68' : '107,114,128'
                    },${glowIntensity})`
                  }}
                  whileHover={{ scale: 1.3, zIndex: 50 }}
                  animate={{
                    boxShadow: [
                      `0 0 ${glowIntensity * 20}px rgba(6,182,212,0.3)`,
                      `0 0 ${glowIntensity * 60}px rgba(6,182,212,0.8)`,
                      `0 0 ${glowIntensity * 20}px rgba(6,182,212,0.3)`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white font-mono text-xs font-bold">
                    {snap.label}
                  </span>
                </motion.div>

                {/* Hover info */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/95 border-2 border-cyan-500 rounded-xl p-4 min-w-[180px] shadow-2xl"
                       style={{ boxShadow: '0 0 40px rgba(6,182,212,0.8)' }}>
                    <div className="text-cyan-400 font-mono text-sm font-bold mb-2">
                      {snap.time}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {snap.status === 'improving' ? (
                        <TrendingUp className="text-green-400" size={16} />
                      ) : snap.status === 'declining' ? (
                        <TrendingDown className="text-red-400" size={16} />
                      ) : (
                        <div className="w-4 h-1 bg-gray-500 rounded" />
                      )}
                      <span className={`text-sm font-bold ${
                        snap.status === 'improving' ? 'text-green-400' :
                        snap.status === 'declining' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {snap.change > 0 ? '+' : ''}{(snap.change * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Mini EKG */}
                    <div className="h-8 flex items-end gap-px">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${
                            snap.status === 'improving' ? 'bg-green-500' :
                            snap.status === 'declining' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                          style={{
                            height: `${20 + Math.random() * 80}%`,
                            opacity: 0.3 + Math.random() * 0.7
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          <span className="text-gray-400 font-mono">Improving</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white" />
          <span className="text-gray-400 font-mono">Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
          <span className="text-gray-400 font-mono">Declining</span>
        </div>
      </div>
    </div>
  );
}
