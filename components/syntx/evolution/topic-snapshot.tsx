'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
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

export function TopicSnapshotTrending() {
  const [data, setData] = useState<TopicsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dev.syntx-system.com/api/strom/analytics/topics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black/80 border-2 border-orange-500/30 rounded-3xl p-8">
        <BarChart3 className="w-8 h-8 text-orange-400 animate-pulse mx-auto" />
      </div>
    );
  }

  if (!data?.topics) return null;

  const maxCount = Math.max(...Object.values(data.topics).map(t => t.count));

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'from-green-400 to-emerald-500';
    if (score >= 40) return 'from-yellow-400 to-orange-400';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div className="relative bg-black rounded-3xl border-4 border-orange-400 overflow-hidden shadow-[0_0_40px_rgba(orange,0.4)]">
      <div className="relative p-8">
        <div className="flex items-center gap-4 mb-8">
          <BarChart3 className="text-orange-400" size={32} />
          <h3 className="text-orange-400 font-black text-3xl tracking-wider uppercase">
            TOPIC SNAPSHOT TRENDING
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(data.topics).map(([topic, stats], idx) => {
            const widthPercent = (stats.count / maxCount) * 100;
            
            return (
              <motion.div
                key={topic}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                className="group"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl">{getKategorieIcon(topic)}</span>
                  <span className="text-white font-bold text-lg capitalize min-w-[140px]">
                    {topic}
                  </span>
                  <div className="flex-1 relative h-12 bg-black/60 rounded-xl overflow-hidden border-2 border-orange-500/20">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getScoreColor(stats.avg_score)} relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, type: "spring" }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          backgroundSize: '200% 100%'
                        }}
                        animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                    
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-white font-black text-sm">
                        {stats.count} prompts
                      </span>
                      <span className="text-white font-black text-xl">
                        {stats.avg_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="bg-black/60 rounded-xl px-4 py-2 border-2 border-orange-500/30 min-w-[100px] text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-gray-400 text-xs">RANGE</div>
                    <div className="text-white font-bold">
                      {stats.min_score}-{stats.max_score}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Total: {data.total_topics} topic categories · {Object.values(data.topics).reduce((sum, t) => sum + t.count, 0)} prompts
        </div>
      </div>
    </div>
  );
}
