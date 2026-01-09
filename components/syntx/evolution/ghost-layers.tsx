'use client';

import { motion } from 'framer-motion';
import { Ghost, Lock, TrendingUp, GitBranch, Calendar } from 'lucide-react';

export function GhostLayers() {
  const ghostFeatures = [
    {
      icon: TrendingUp,
      title: 'Topic Weight History',
      description: 'Timeline der Weight-Änderungen pro Topic',
      eta: 'Phase 2'
    },
    {
      icon: GitBranch,
      title: 'Mutation Events',
      description: 'Wann und warum Weights sich geändert haben',
      eta: 'Phase 2'
    },
    {
      icon: Calendar,
      title: 'Semantic Age',
      description: 'Alter: 27 Tage, letzte Drift: vor 5h',
      eta: 'Phase 3'
    },
    {
      icon: Lock,
      title: 'Resonanz Field Map',
      description: 'Welche Topics sich gegenseitig beeinflussen',
      eta: 'Phase 3'
    }
  ];

  return (
    <div className="relative bg-black/40 rounded-3xl border-4 border-gray-700/30 border-dashed overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black/20" />
      
      <div className="relative p-8">
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Ghost className="text-gray-600" size={32} />
          </motion.div>
          <div>
            <h3 className="text-gray-600 font-black text-3xl tracking-wider uppercase">
              COMING SOON
            </h3>
            <p className="text-gray-700 text-sm">
              Future evolution features · In development
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {ghostFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-black/30 border-2 border-gray-700/30 border-dashed rounded-2xl p-6 group"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-gray-600 text-xs font-mono">
                  {feature.eta}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <feature.icon className="text-gray-600" size={24} />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-gray-500 font-bold text-lg mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-gray-600/0 group-hover:border-gray-600/30"
                whileHover={{ scale: 1.02 }}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-6 py-3 bg-gray-900/30 border-2 border-gray-700/30 border-dashed rounded-xl"
          >
            <p className="text-gray-600 font-mono text-sm">
              💭 "Evolution is felt before it's tracked. SYNTX macht sie sichtbar."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
