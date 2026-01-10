'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Zap, Activity, AlertTriangle } from 'lucide-react';

interface NeuroResultDisplayProps {
  show: boolean;
  success: boolean;
  operation: 'create' | 'update' | 'delete';
  streamName?: string;
  message: string;
  onClose: () => void;
}

export function NeuroResultDisplay({ 
  show, 
  success, 
  operation, 
  streamName, 
  message, 
  onClose 
}: NeuroResultDisplayProps) {
  if (!show) return null;

  const operationText = {
    create: 'STREAM BIRTH',
    update: 'STREAM RECALIBRATION',
    delete: 'STREAM TERMINATION'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Main panel */}
        <motion.div
          className="relative z-10 w-full max-w-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Outer pulse */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: success 
                ? [
                    '0 0 60px rgba(0,255,255,0.3)',
                    '0 0 120px rgba(0,255,255,0.6)',
                    '0 0 60px rgba(0,255,255,0.3)'
                  ]
                : [
                    '0 0 60px rgba(255,0,100,0.3)',
                    '0 0 120px rgba(255,0,100,0.6)',
                    '0 0 60px rgba(255,0,100,0.3)'
                  ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Panel */}
          <div className="relative bg-black/95 rounded-3xl overflow-hidden">
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: success 
                  ? 'conic-gradient(from 0deg, transparent, rgba(0,255,255,0.6), transparent)'
                  : 'conic-gradient(from 0deg, transparent, rgba(255,0,100,0.6), transparent)'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Content */}
            <div className="relative p-12">
              {/* Top section - Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {/* Rotating rings */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0"
                      style={{
                        width: 120 + i * 40,
                        height: 120 + i * 40,
                        left: -(i * 20),
                        top: -(i * 20),
                        borderRadius: '50%',
                        border: `2px solid ${success ? 'rgba(0,255,255,0.2)' : 'rgba(255,0,100,0.2)'}`
                      }}
                      animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                      transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                    />
                  ))}

                  {/* Main icon */}
                  <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
                    success ? 'bg-cyan-500/20' : 'bg-red-500/20'
                  }`}>
                    {success ? (
                      <CheckCircle2 className="w-20 h-20 text-cyan-400" />
                    ) : (
                      <XCircle className="w-20 h-20 text-red-400" />
                    )}

                    {/* Pulsing glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: success
                          ? [
                              '0 0 20px rgba(0,255,255,0.4)',
                              '0 0 60px rgba(0,255,255,0.8)',
                              '0 0 20px rgba(0,255,255,0.4)'
                            ]
                          : [
                              '0 0 20px rgba(255,0,100,0.4)',
                              '0 0 60px rgba(255,0,100,0.8)',
                              '0 0 20px rgba(255,0,100,0.4)'
                            ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Orbiting particles */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-3 h-3 rounded-full ${success ? 'bg-cyan-400' : 'bg-red-400'}`}
                      style={{
                        left: '50%',
                        top: '50%'
                      }}
                      animate={{
                        x: Math.cos(i * 60 * Math.PI / 180) * 80,
                        y: Math.sin(i * 60 * Math.PI / 180) * 80,
                        rotate: 360
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Operation type */}
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Activity className={`w-6 h-6 ${success ? 'text-cyan-400' : 'text-red-400'}`} />
                  <motion.span 
                    className={`text-sm font-black tracking-widest ${success ? 'text-cyan-400' : 'text-red-400'}`}
                    animate={{
                      textShadow: success
                        ? [
                            '0 0 10px rgba(0,255,255,0.5)',
                            '0 0 20px rgba(0,255,255,1)',
                            '0 0 10px rgba(0,255,255,0.5)'
                          ]
                        : [
                            '0 0 10px rgba(255,0,100,0.5)',
                            '0 0 20px rgba(255,0,100,1)',
                            '0 0 10px rgba(255,0,100,0.5)'
                          ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {operationText[operation]}
                  </motion.span>
                  <Activity className={`w-6 h-6 ${success ? 'text-cyan-400' : 'text-red-400'}`} />
                </div>
              </motion.div>

              {/* Status */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.h2 
                  className={`text-6xl font-black mb-4 ${success ? 'text-cyan-400' : 'text-red-400'}`}
                  animate={{
                    textShadow: success
                      ? [
                          '0 0 20px rgba(0,255,255,0.5)',
                          '0 0 40px rgba(0,255,255,1)',
                          '0 0 20px rgba(0,255,255,0.5)'
                        ]
                      : [
                          '0 0 20px rgba(255,0,100,0.5)',
                          '0 0 40px rgba(255,0,100,1)',
                          '0 0 20px rgba(255,0,100,0.5)'
                        ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {success ? 'SUCCESS' : 'FAILURE'}
                </motion.h2>

                {/* Stream name */}
                {streamName && (
                  <motion.div 
                    className="mb-4 p-4 bg-black/50 rounded-xl"
                    animate={{
                      boxShadow: success
                        ? '0 0 20px rgba(0,255,255,0.2)'
                        : '0 0 20px rgba(255,0,100,0.2)'
                    }}
                  >
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stream Identity</div>
                    <div className="text-xl font-bold text-white">{streamName}</div>
                  </motion.div>
                )}

                {/* Message */}
                <motion.div 
                  className={`text-lg font-mono ${success ? 'text-cyan-300' : 'text-red-300'}`}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {message}
                </motion.div>
              </motion.div>

              {/* Neural activity visualization */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-1 h-20">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 rounded-full ${success ? 'bg-cyan-400' : 'bg-red-400'}`}
                      animate={{
                        height: [
                          '20%',
                          `${Math.random() * 80 + 20}%`,
                          '20%'
                        ],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 1 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.03
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* System status */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div 
                  className="text-center p-3 bg-black/50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-xs text-slate-500 mb-1">FIELD STATUS</div>
                  <motion.div 
                    className={`text-lg font-black ${success ? 'text-green-400' : 'text-red-400'}`}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {success ? 'COHERENT' : 'DISRUPTED'}
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="text-center p-3 bg-black/50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-xs text-slate-500 mb-1">RESONANCE</div>
                  <motion.div 
                    className={`text-lg font-black ${success ? 'text-cyan-400' : 'text-orange-400'}`}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {success ? '98.7%' : '12.3%'}
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="text-center p-3 bg-black/50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-xs text-slate-500 mb-1">STABILITY</div>
                  <motion.div 
                    className={`text-lg font-black ${success ? 'text-blue-400' : 'text-red-400'}`}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {success ? 'LOCKED' : 'VOLATILE'}
                  </motion.div>
                </motion.div>
              </div>

              {/* Acknowledge button */}
              <motion.button
                onClick={onClose}
                className={`w-full py-5 rounded-xl font-black text-xl relative overflow-hidden ${
                  success 
                    ? 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40'
                    : 'bg-red-600/20 text-red-400 hover:bg-red-600/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  boxShadow: success 
                    ? '0 0 30px rgba(0,255,255,0.4)'
                    : '0 0 30px rgba(255,0,100,0.4)'
                }}
              >
                {/* Flowing background */}
                <motion.div
                  className={`absolute inset-0 ${success ? 'bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-red-500/20 to-transparent'}`}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" />
                  ACKNOWLEDGE & CONTINUE
                  <Zap className="w-6 h-6" />
                </div>
              </motion.button>

              {/* Corner brackets */}
              <div className={`absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 ${success ? 'border-cyan-400' : 'border-red-400'}`} />
              <div className={`absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 ${success ? 'border-cyan-400' : 'border-red-400'}`} />
              <div className={`absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 ${success ? 'border-cyan-400' : 'border-red-400'}`} />
              <div className={`absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 ${success ? 'border-cyan-400' : 'border-red-400'}`} />
            </div>

            {/* Particle stream background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-px h-2 ${success ? 'bg-cyan-400' : 'bg-red-400'}`}
                  style={{
                    left: `${i * 3.33}%`,
                  }}
                  animate={{
                    y: ['-10%', '110%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
