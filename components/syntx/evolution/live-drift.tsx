'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';

interface DriftBody {
  id: string;
  topic: string;
  style: string;
  wrapper: string;
  kalibrierung_score: number;
  timestamp: string;
  resonanz: string;
}

interface DriftResponse {
  status: string;
  count: number;
  drift_korper: DriftBody[];
}

export function LiveDriftField() {
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
      <div className="bg-black/80 border-2 border-red-500/30 rounded-3xl p-8">
        <Flame className="w-8 h-8 text-red-400 animate-pulse mx-auto" />
      </div>
    );
  }

  if (!data?.drift_korper || data.count === 0) {
    return (
      <div className="bg-black/80 border-2 border-green-500/30 rounded-3xl p-8 text-center">
        <div className="text-green-400 font-bold text-xl">🟢 NO DRIFT DETECTED</div>
        <div className="text-gray-500 text-sm mt-2">System is stable</div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'border-orange-400 bg-orange-500/10';
    if (score >= 40) return 'border-red-400 bg-red-500/10';
    return 'border-rose-500 bg-rose-500/10';
  };

  return (
    <div className="relative bg-black rounded-3xl border-4 border-red-400 overflow-hidden shadow-[0_0_40px_rgba(red,0.4)]">
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{ 
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239,68,68,0.5) 10px, rgba(239,68,68,0.5) 11px)',
        }} 
      />

      <div className="relative p-8">
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="text-red-400" size={32} />
          </motion.div>
          <div>
            <h3 className="text-red-400 font-black text-3xl tracking-wider uppercase">
              LIVE DRIFT FIELD
            </h3>
            <p className="text-gray-400 text-sm">
              {data.count} drift bodies detected · System under stress
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {data.drift_korper.slice(0, 20).map((drift, idx) => (
            <motion.div
              key={drift.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", bounce: 0.3 }}
              whileHover={{ scale: 1.05, zIndex: 50 }}
              className={`relative ${getScoreColor(drift.kalibrierung_score)} 
                         border-2 rounded-2xl p-4 cursor-pointer group`}
            >
              {/* Neon shimmer */}
              {drift.resonanz === 'DRIFT' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              <div className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm capitalize truncate">
                    {drift.topic}
                  </span>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                <div className="text-gray-400 text-xs truncate">
                  {drift.style} · {drift.wrapper}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-red-500/20">
                  <span className="text-red-400 font-black text-2xl">
                    {drift.kalibrierung_score}
                  </span>
                  <span className="text-red-400 text-xs font-bold uppercase">
                    {drift.resonanz}
                  </span>
                </div>

                {/* Mini EKG line */}
                <div className="h-8 flex items-end gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-red-500/50 rounded-t"
                      animate={{ 
                        height: [
                          `${20 + Math.random() * 80}%`,
                          `${20 + Math.random() * 80}%`,
                        ]
                      }}
                      transition={{ 
                        duration: 0.5 + Math.random(),
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/95 border-2 border-red-500 rounded-xl p-3 text-xs whitespace-nowrap">
                  <div className="text-gray-400">ID: {drift.id.slice(0, 20)}...</div>
                  <div className="text-gray-400">
                    {new Date(drift.timestamp).toLocaleString('de-DE')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
