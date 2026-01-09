'use client'

import { motion } from 'framer-motion'

interface ResonanceIndicatorProps {
  active: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ResonanceIndicator({ active, size = 'md' }: ResonanceIndicatorProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }
  
  if (!active) {
    return <div className={`${sizes[size]} rounded-full bg-gray-600`} />
  }
  
  return (
    <div className={`relative ${sizes[size]}`}>
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-400"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.8, 0, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {/* Core */}
      <div className="absolute inset-0 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
    </div>
  )
}
