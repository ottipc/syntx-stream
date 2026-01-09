'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Zap } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  autoClose?: number; // milliseconds
}

export function SuccessToast({ 
  isVisible, 
  message, 
  onClose, 
  autoClose = 3000 
}: SuccessToastProps) {
  
  useEffect(() => {
    if (isVisible && autoClose > 0) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-24 right-6 z-[60] max-w-md"
        >
          <div className="relative bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl border-2 border-green-500/50 shadow-2xl shadow-green-500/30 p-4">
            
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl animate-pulse" />
            
            {/* Neural Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 rounded-xl" />
            
            {/* Content */}
            <div className="relative flex items-start gap-4">
              {/* Icon with pulse animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              
              {/* Message */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                    Success
                  </h3>
                </div>
                <p className="text-white font-medium">{message}</p>
              </div>
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </motion.button>
            </div>
            
            {/* Progress Bar */}
            {autoClose > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoClose / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-b-xl"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
