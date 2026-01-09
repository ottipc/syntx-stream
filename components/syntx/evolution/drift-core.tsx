'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';

interface DriftBody {
  id: string;
  topic: string;
  kalibrierung_score: number;
  timestamp: string;
}

interface DriftResponse {
  status: string;
  count: number;
  drift_korper: DriftBody[];
}

export function DriftMassCore() {
  const [data, setData] = useState<DriftResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dev.syntx-system.com/api/strom/feld/drift')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black/80 border-2 border-red-500/30 rounded-3xl p-6">
        <Flame className="w-6 h-6 text-red-400 animate-pulse mx-auto" />
      </div>
    );
  }

  if (!data?.drift_korper || data.count === 0) {
    return (
      <div className="bg-black/80 border-2 border-green-500/30 rounded-3xl p-6 text-center">
        <div className="text-green-400 font-bold text-lg">🟢 NO CHAOS</div>
        <div className="text-gray-500 text-xs mt-1">All fields stable</div>
      </div>
    );
  }

  const driftCenters = data.drift_korper.reduce((acc, drift) => {
    if (!acc[drift.topic]) acc[drift.topic] = [];
    acc[drift.topic].push(drift);
    return acc;
  }, {} as Record<string, DriftBody[]>);

  return (
    <div className="relative bg-black rounded-3xl shadow-[0_0_20px_rgba(239,68,68,0.3)] overflow-hidden shadow-[0_0_40px_rgba(red,0.4)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <AlertTriangle className="text-red-400" size={28} />
        </motion.div>
        <div>
          <h3 className="text-red-400 font-black text-2xl tracking-wider uppercase">
            DRIFT-MASS CHAOS-KERN
          </h3>
          <p className="text-gray-500 text-xs font-mono mt-1">
            {data.count} active drift centers
          </p>
        </div>
      </div>

      {/* Smaller circular map */}
      <div className="relative w-full h-64">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
          <defs>
            <radialGradient id="driftCore">
              <stop offset="0%" stopColor="rgb(239,68,68)" stopOpacity="1" />
              <stop offset="50%" stopColor="rgb(168,85,247)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0.2" />
            </radialGradient>
            <filter id="coreGlow">
              <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid rings */}
          {[0, 1, 2].map((ring) => (
            <motion.circle
              key={ring}
              cx="150"
              cy="150"
              r={40 + ring * 35}
              fill="none"
              stroke="rgba(239,68,68,0.2)"
              strokeWidth="1"
              strokeDasharray="5,5"
              animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + ring * 10, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '150px 150px' }}
            />
          ))}

          {/* Drift cores */}
          {Object.entries(driftCenters).map(([topic, drifts], idx) => {
            const angle = (idx / Object.keys(driftCenters).length) * 2 * Math.PI;
            const distance = 50 + (drifts.length * 8);
            const x = 150 + Math.cos(angle) * distance;
            const y = 150 + Math.sin(angle) * distance;
            const avgScore = drifts.reduce((sum, d) => sum + d.kalibrierung_score, 0) / drifts.length;
            const intensity = 1 - (avgScore / 100);

            return (
              <g key={topic}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={25 + drifts.length * 3}
                  fill="url(#driftCore)"
                  opacity={0.4}
                  filter="url(#coreGlow)"
                  animate={{
                    r: [25 + drifts.length * 3, 30 + drifts.length * 3, 25 + drifts.length * 3],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                />

                <motion.circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill={intensity > 0.6 ? 'rgb(239,68,68)' : intensity > 0.4 ? 'rgb(251,146,60)' : 'rgb(168,85,247)'}
                  filter="url(#coreGlow)"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />

                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  className="font-mono uppercase"
                >
                  {topic.slice(0, 4)}
                </text>
              </g>
            );
          })}
        </svg>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-red-500/50 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="text-red-500" size={20} />
        </motion.div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-3">
          <div className="text-gray-500 text-[10px] mb-1 font-mono">CORES</div>
          <div className="text-red-400 font-black text-2xl">{Object.keys(driftCenters).length}</div>
        </div>
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-3">
          <div className="text-gray-500 text-[10px] mb-1 font-mono">BODIES</div>
          <div className="text-purple-400 font-black text-2xl">{data.count}</div>
        </div>
        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-3">
          <div className="text-gray-500 text-[10px] mb-1 font-mono">STATUS</div>
          <div className="text-orange-400 font-black text-sm">ACTIVE</div>
        </div>
      </div>
    </div>
  );
}
