'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Zap } from 'lucide-react';

interface ResultBladeRunnerProps {
  show: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
}

export function ResultBladeRunner({ show, success, message, onClose }: ResultBladeRunnerProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Result panel */}
        <motion.div
          className="relative"
          initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateX: -90 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: success 
                ? [
                    '0 0 40px rgba(0,255,0,0.3)',
                    '0 0 80px rgba(0,255,0,0.6)',
                    '0 0 40px rgba(0,255,0,0.3)'
                  ]
                : [
                    '0 0 40px rgba(255,0,0,0.3)',
                    '0 0 80px rgba(255,0,0,0.6)',
                    '0 0 40px rgba(255,0,0,0.3)'
                  ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main panel */}
          <div className="relative w-[500px] bg-black/95 rounded-3xl overflow-hidden">
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: success 
                  ? 'conic-gradient(from 0deg, transparent, rgba(0,255,0,0.5), transparent)'
                  : 'conic-gradient(from 0deg, transparent, rgba(255,0,0,0.5), transparent)'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Content */}
            <div className="relative p-12">
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
              >
                {success ? (
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <CheckCircle2 className="w-24 h-24 text-green-400" />
                    
                    {/* Success particles */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full"
                        animate={{
                          x: [0, Math.cos(i * 30 * Math.PI / 180) * 80],
                          y: [0, Math.sin(i * 30 * Math.PI / 180) * 80],
                          opacity: [1, 0],
                          scale: [1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 1 },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <XCircle className="w-24 h-24 text-red-400" />
                    
                    {/* Error sparks */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1 h-4 bg-red-400"
                        style={{
                          transformOrigin: 'bottom center'
                        }}
                        animate={{
                          rotate: i * 45,
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Status text */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.h2 
                  className={`text-4xl font-black mb-2 ${success ? 'text-green-400' : 'text-red-400'}`}
                  animate={{
                    textShadow: success
                      ? [
                          '0 0 10px rgba(0,255,0,0.5)',
                          '0 0 30px rgba(0,255,0,1)',
                          '0 0 10px rgba(0,255,0,0.5)'
                        ]
                      : [
                          '0 0 10px rgba(255,0,0,0.5)',
                          '0 0 30px rgba(255,0,0,1)',
                          '0 0 10px rgba(255,0,0,0.5)'
                        ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {success ? 'SUCCESS' : 'ERROR'}
                </motion.h2>
                
                <motion.p 
                  className="text-slate-400 text-lg"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {message}
                </motion.p>
              </motion.div>

              {/* Scanning line effect */}
              <div className="relative h-1 bg-slate-900 rounded-full overflow-hidden mb-8">
                <motion.div
                  className={`absolute inset-0 h-full ${success ? 'bg-green-400' : 'bg-red-400'}`}
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    boxShadow: success 
                      ? '0 0 20px rgba(0,255,0,1)'
                      : '0 0 20px rgba(255,0,0,1)'
                  }}
                />
              </div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className={`w-full py-4 rounded-xl font-black text-lg ${
                  success 
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/40'
                    : 'bg-red-600/20 text-red-400 hover:bg-red-600/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: success 
                    ? '0 0 20px rgba(0,255,0,0.3)'
                    : '0 0 20px rgba(255,0,0,0.3)'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  ACKNOWLEDGE
                </div>
              </motion.button>

              {/* Corner brackets */}
              <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 ${success ? 'border-green-400' : 'border-red-400'}`} />
              <div className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 ${success ? 'border-green-400' : 'border-red-400'}`} />
              <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 ${success ? 'border-green-400' : 'border-red-400'}`} />
              <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 ${success ? 'border-green-400' : 'border-red-400'}`} />
            </div>

            {/* Digital rain effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-px ${success ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{
                    left: `${i * 5}%`,
                    height: '2px'
                  }}
                  animate={{
                    y: ['-100%', '100vh'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
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
