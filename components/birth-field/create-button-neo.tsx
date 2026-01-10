'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function CreateButtonNeo({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Rotating border */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(0,255,255,0.5), transparent)',
          padding: '2px'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Button content */}
      <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl overflow-hidden">
        {/* Animated shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <Plus className="w-5 h-5 text-white relative z-10" />
        <span className="text-white font-bold relative z-10">Create Stream</span>
      </div>

      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          boxShadow: '0 0 30px rgba(0,255,255,0.5)',
          filter: 'blur(10px)'
        }}
      />
    </motion.button>
  );
}
