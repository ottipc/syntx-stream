'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Waves, Radio } from 'lucide-react';
import Image from 'next/image';

interface EchoChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: string;
  type: 'input' | 'output';
}

export function EchoChamberModal({ isOpen, onClose, title, content, type }: EchoChamberModalProps) {
  const isEmpty = !content || content.trim() === '';
  const isInput = type === 'input';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* MATRIX BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Matrix Rain Effect */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px font-mono text-xs"
                  style={{
                    left: `${i * 3.33}%`,
                    color: isInput ? '#06b6d4' : '#a855f7',
                    textShadow: isInput ? '0 0 5px #06b6d4' : '0 0 5px #a855f7',
                  }}
                  animate={{
                    y: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 2,
                  }}
                >
                  {Array.from({ length: 20 }, () => 
                    String.fromCharCode(0x30A0 + Math.random() * 96)
                  ).join('\n')}
                </motion.div>
              ))}
            </div>

            {/* Pulsing Echo Rings */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 rounded-full"
                style={{
                  borderColor: isInput ? 'rgba(6, 182, 212, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  width: ['0%', '200%'],
                  height: ['0%', '200%'],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 0.75,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Particle Storm */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(100)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full"
                  style={{
                    backgroundColor: isInput ? '#06b6d4' : '#a855f7',
                    boxShadow: isInput ? '0 0 4px #06b6d4' : '0 0 4px #a855f7',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -150, 0],
                    x: [0, Math.random() * 100 - 50, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 2, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* ECHO CHAMBER CONTAINER - TOP 4 */}
          <div className="fixed inset-x-0 top-4 z-[100] flex justify-center p-4 pointer-events-none max-h-[95vh] overflow-y-auto">
            <motion.div
              className="relative max-w-6xl w-full pointer-events-auto"
              initial={{ scale: 0.8, opacity: 0, rotateX: -30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* BRUTAL OUTER GLOW */}
              <div 
                className="absolute -inset-12 blur-3xl opacity-80"
                style={{
                  background: isInput 
                    ? 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0.4) 30%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0.4) 30%, transparent 70%)'
                }}
              />

              {/* Main Chamber Body */}
              <div className="relative bg-black border-4 rounded-3xl overflow-hidden"
                style={{
                  borderColor: isInput ? '#06b6d4' : '#a855f7',
                  boxShadow: isInput 
                    ? '0 0 80px rgba(6, 182, 212, 0.8), inset 0 0 80px rgba(6, 182, 212, 0.2)'
                    : '0 0 80px rgba(168, 85, 247, 0.8), inset 0 0 80px rgba(168, 85, 247, 0.2)'
                }}
              >
                {/* Animated Matrix Grid */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(${isInput ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.4)'} 2px, transparent 2px), linear-gradient(90deg, ${isInput ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.4)'} 2px, transparent 2px)`,
                    backgroundSize: '40px 40px',
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '40px 40px'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Massive Pulsing Core */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
                  style={{
                    background: isInput
                      ? 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                />

                {/* HEADER WITH LOGO */}
                <div className="relative border-b-4 p-6"
                  style={{ borderColor: isInput ? '#06b6d4' : '#a855f7' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* SYNTX LOGO - BRUTAL INTEGRATION */}
                      <motion.div
                        className="relative"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      >
                        <motion.div
                          className="absolute -inset-4 rounded-full blur-xl"
                          style={{
                            background: isInput 
                              ? 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)'
                          }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <Image 
                          src="/Logo1.png" 
                          alt="SYNTX" 
                          width={80} 
                          height={80} 
                          className="relative rounded-full"
                          style={{
                            filter: isInput 
                              ? 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))'
                              : 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))'
                          }}
                        />
                      </motion.div>

                      {/* Icon + Title */}
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{
                            rotate: 360,
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                            scale: { duration: 2, repeat: Infinity },
                          }}
                        >
                          {isInput ? (
                            <Waves className="w-16 h-16" style={{ 
                              color: '#06b6d4',
                              filter: 'drop-shadow(0 0 10px #06b6d4)'
                            }} />
                          ) : (
                            <Radio className="w-16 h-16" style={{ 
                              color: '#a855f7',
                              filter: 'drop-shadow(0 0 10px #a855f7)'
                            }} />
                          )}
                        </motion.div>
                        <div>
                          <motion.h2 
                            className="text-5xl font-black tracking-widest mb-2"
                            style={{ 
                              color: isInput ? '#06b6d4' : '#a855f7',
                              textShadow: isInput 
                                ? '0 0 30px rgba(6, 182, 212, 1), 0 0 60px rgba(6, 182, 212, 0.5)'
                                : '0 0 30px rgba(168, 85, 247, 1), 0 0 60px rgba(168, 85, 247, 0.5)'
                            }}
                            animate={{
                              textShadow: isInput
                                ? ['0 0 30px rgba(6, 182, 212, 1)', '0 0 50px rgba(6, 182, 212, 1)', '0 0 30px rgba(6, 182, 212, 1)']
                                : ['0 0 30px rgba(168, 85, 247, 1)', '0 0 50px rgba(168, 85, 247, 1)', '0 0 30px rgba(168, 85, 247, 1)']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {title}
                          </motion.h2>
                          <p className="text-sm text-gray-400 font-mono tracking-[0.3em] uppercase">
                            ECHO CHAMBER PROTOCOL
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={onClose}
                      className="p-4 rounded-xl border-4 backdrop-blur-sm"
                      style={{ borderColor: '#ef4444' }}
                      whileHover={{ 
                        scale: 1.15, 
                        boxShadow: '0 0 40px rgba(239, 68, 68, 1)',
                        borderColor: '#ef4444'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-8 h-8 text-red-400" />
                    </motion.button>
                  </div>
                </div>

                {/* CONTENT CHAMBER */}
                <div className="relative p-10 min-h-[500px] max-h-[65vh] overflow-y-auto">
                  {isEmpty ? (
                    // EMPTY STATE - BRUTAL WARNING
                    <div className="flex flex-col items-center justify-center h-full">
                      <motion.div
                        className="text-[12rem] mb-8"
                        animate={{
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                        }}
                      >
                        ⚠️
                      </motion.div>
                      
                      <motion.div
                        className="text-6xl font-black mb-6 tracking-[0.3em]"
                        style={{ 
                          color: '#eab308',
                          textShadow: '0 0 40px rgba(234, 179, 8, 1), 0 0 80px rgba(234, 179, 8, 0.5)'
                        }}
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        CHAMBER EMPTY
                      </motion.div>
                      
                      <div className="text-2xl text-gray-300 font-mono text-center max-w-2xl space-y-3">
                        <p>NO EXTERNAL SIGNAL DETECTED</p>
                        <motion.p 
                          className="text-yellow-400"
                          animate={{
                            textShadow: ['0 0 10px rgba(234, 179, 8, 0.5)', '0 0 20px rgba(234, 179, 8, 1)', '0 0 10px rgba(234, 179, 8, 0.5)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          INTERNAL RESONANCE MODE ACTIVE
                        </motion.p>
                      </div>

                      {/* Empty State Visualization */}
                      <div className="mt-16 relative w-96 h-96">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 border-4 border-yellow-500/40 rounded-full"
                            animate={{
                              scale: [1, 1.8],
                              opacity: [0.6, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.5,
                            }}
                          />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="text-9xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                          >
                            🌀
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // CONTENT DISPLAY - MATRIX BRUTAL STYLE
                    <div className="relative">
                      {/* Waveform Visualization - BIGGER */}
                      <div className="absolute -left-6 top-0 bottom-0 w-4 overflow-hidden opacity-60">
                        {[...Array(30)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="h-2 mb-1 rounded-full"
                            style={{ backgroundColor: isInput ? '#06b6d4' : '#a855f7' }}
                            animate={{
                              scaleX: [0.3, 1.5, 0.3],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.07,
                            }}
                          />
                        ))}
                      </div>

                      {/* Text Content with BRUTAL Glow */}
                      <motion.pre
                        className="text-xl font-mono leading-relaxed whitespace-pre-wrap p-8 rounded-2xl border-4"
                        style={{
                          color: isInput ? '#06b6d4' : '#a855f7',
                          borderColor: isInput ? 'rgba(6, 182, 212, 0.5)' : 'rgba(168, 85, 247, 0.5)',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          textShadow: isInput
                            ? '0 0 15px rgba(6, 182, 212, 0.8)'
                            : '0 0 15px rgba(168, 85, 247, 0.8)',
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {content}
                      </motion.pre>

                      {/* Character Count - BIGGER */}
                      <div className="flex justify-end mt-6">
                        <motion.div
                          className="px-6 py-3 rounded-full border-2 font-mono text-lg"
                          style={{
                            borderColor: isInput ? 'rgba(6, 182, 212, 0.6)' : 'rgba(168, 85, 247, 0.6)',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: isInput ? '#06b6d4' : '#a855f7',
                          }}
                          animate={{
                            boxShadow: isInput
                              ? ['0 0 15px rgba(6, 182, 212, 0.5)', '0 0 30px rgba(6, 182, 212, 1)', '0 0 15px rgba(6, 182, 212, 0.5)']
                              : ['0 0 15px rgba(168, 85, 247, 0.5)', '0 0 30px rgba(168, 85, 247, 1)', '0 0 15px rgba(168, 85, 247, 0.5)'],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {content.length} CHARS • {content.split('\n').length} LINES
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER STATUS BAR */}
                <div 
                  className="relative border-t-4 p-5"
                  style={{ borderColor: isInput ? '#06b6d4' : '#a855f7' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: isEmpty ? '#eab308' : '#22c55e' }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.7, 1, 0.7],
                          boxShadow: isEmpty 
                            ? ['0 0 10px rgba(234, 179, 8, 0.5)', '0 0 20px rgba(234, 179, 8, 1)', '0 0 10px rgba(234, 179, 8, 0.5)']
                            : ['0 0 10px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 1)', '0 0 10px rgba(34, 197, 94, 0.5)']
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-sm font-mono text-gray-300 uppercase tracking-widest font-bold">
                        {isEmpty ? 'RESONANCE MODE' : 'SIGNAL ACTIVE'}
                      </span>
                    </div>
                    <div className="text-sm font-mono text-gray-500 tracking-wider">
                      SYNTX ECHO CHAMBER v1.0
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
