'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Brain, Clock, Globe, Dna, Save, Calendar, Edit3 } from 'lucide-react';
import { useCronStreamStore } from '@/lib/stores/cron-stream-store';
import type { StromConfig, StromUpdateData } from '@/types/strom';
import { SuccessToast } from '@/components/syntx/SuccessToast';

interface StreamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: StromConfig | null;
}

const DAYS = [
  { key: 1, label: 'Mo', full: 'Monday', color: 'cyan' },
  { key: 2, label: 'Di', full: 'Tuesday', color: 'blue' },
  { key: 3, label: 'Mi', full: 'Wednesday', color: 'purple' },
  { key: 4, label: 'Do', full: 'Thursday', color: 'pink' },
  { key: 5, label: 'Fr', full: 'Friday', color: 'cyan' },
  { key: 6, label: 'Sa', full: 'Saturday', color: 'green' },
  { key: 0, label: 'So', full: 'Sunday', color: 'red' },
];

export function StreamEditModal({ isOpen, onClose, stream }: StreamEditModalProps) {
  const { updateStream } = useCronStreamStore();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [modell, setModell] = useState('gpt-4o');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [sprachen, setSprachen] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);

  const parseCron = (cron: string) => {
    const parts = cron.split(' ');
    if (parts.length >= 5) {
      const min = parseInt(parts[0]) || 0;
      const hr = parseInt(parts[1]) || 8;
      const dayStr = parts[4];
      
      let days: number[] = [];
      if (dayStr === '*') {
        days = [0, 1, 2, 3, 4, 5, 6];
      } else {
        days = dayStr.split(',').map(d => parseInt(d));
      }
      
      return { minute: min, hour: hr, days };
    }
    return { minute: 0, hour: 8, days: [1, 2, 3, 4, 5] };
  };

  useEffect(() => {
    if (stream) {
      setName(stream.name);
      setModell(stream.modell);
      setSprachen(stream.sprachen || ['de']);
      setStyles(stream.styles || ['technisch']);
      
      const { minute: min, hour: hr, days } = parseCron(stream.zeitplan);
      setMinute(min);
      setHour(hr);
      setSelectedDays(days);
    }
  }, [stream]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const toggleLanguage = (lang: string) => {
    setSprachen(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleStyle = (style: string) => {
    setStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const generateCron = () => {
    const dayStr = selectedDays.length === 7 ? '*' : selectedDays.join(',');
    return `${minute} ${hour} * * ${dayStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stream) return;
    
    setLoading(true);
    
    try {
      const formData: StromUpdateData = {
        name,
        zeitplan: generateCron(),
        modell,
        felder_topics: stream.felder_topics || { systemstruktur: 0.7, humansprache: 0.5 },
        styles,
        sprachen,
        aktiv: stream.aktiv,
      };
      
      await updateStream(stream.strom_id, formData);
      
      // Show success toast
      setShowSuccess(true);
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to update stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-slate-900/30 border-slate-700 text-slate-500 hover:border-slate-600';
    }
    
    const colors = {
      cyan: 'bg-gradient-to-br from-cyan-500/40 to-cyan-600/40 border-cyan-400 text-cyan-200 shadow-cyan-500/50',
      blue: 'bg-gradient-to-br from-blue-500/40 to-blue-600/40 border-blue-400 text-blue-200 shadow-blue-500/50',
      purple: 'bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-400 text-purple-200 shadow-purple-500/50',
      pink: 'bg-gradient-to-br from-pink-500/40 to-pink-600/40 border-pink-400 text-pink-200 shadow-pink-500/50',
      green: 'bg-gradient-to-br from-green-500/40 to-green-600/40 border-green-400 text-green-200 shadow-green-500/50',
      red: 'bg-gradient-to-br from-red-500/40 to-red-600/40 border-red-400 text-red-200 shadow-red-500/50',
    };
    
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  if (!stream) return null;

  return (
    <>
      <SuccessToast
        isVisible={showSuccess}
        message={`Stream "${name}" successfully updated! 🌊⚡`}
        onClose={() => setShowSuccess(false)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="relative w-full max-w-3xl bg-slate-950 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden my-8"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                  
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-purple-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                  
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
                        >
                          <Edit3 className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Edit Neural Stream
                          </h2>
                          <p className="text-sm text-slate-400 mt-1">Recalibrate field resonance flow</p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-400" />
                      </motion.button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2 text-purple-400 mb-3">
                          <Brain className="w-5 h-5" />
                          <span className="text-sm font-bold uppercase tracking-wider">Stream Identity</span>
                        </div>
                        
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                          placeholder="Evening Call"
                          required
                        />

                        <select
                          value={modell}
                          onChange={(e) => setModell(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        >
                          <option value="gpt-4o">⚡ GPT-4o</option>
                          <option value="gpt-4-turbo">🚀 GPT-4 Turbo</option>
                          <option value="claude-3-opus">🧠 Claude 3 Opus</option>
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2 text-purple-400 mb-3">
                          <Calendar className="w-5 h-5" />
                          <span className="text-sm font-bold uppercase tracking-wider">Temporal Matrix</span>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {DAYS.map((day, idx) => {
                            const isSelected = selectedDays.includes(day.key);
                            return (
                              <motion.button
                                key={day.key}
                                type="button"
                                onClick={() => toggleDay(day.key)}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isSelected ? {
                                  boxShadow: [
                                    `0 0 20px rgba(var(--tw-shadow-color), 0.3)`,
                                    `0 0 40px rgba(var(--tw-shadow-color), 0.6)`,
                                    `0 0 20px rgba(var(--tw-shadow-color), 0.3)`,
                                  ],
                                  scale: [1, 1.05, 1],
                                } : {}}
                                transition={{ 
                                  boxShadow: { duration: 2, repeat: Infinity },
                                  scale: { duration: 2, repeat: Infinity },
                                  delay: idx * 0.1 
                                }}
                                className={`relative aspect-square rounded-lg border-2 transition-all ${getColorClasses(day.color, isSelected)}`}
                              >
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-sm font-bold">{day.label}</span>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ 
                                      scale: [1, 1.1, 1],
                                      opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-lg bg-white/10"
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        <div className="flex gap-4 items-center">
                          <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-2 block">Hour</label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                              <input
                                type="number"
                                min="0"
                                max="23"
                                value={hour}
                                onChange={(e) => setHour(parseInt(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="text-2xl text-purple-400 mt-6">:</div>
                          <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-2 block">Minute</label>
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={minute}
                              onChange={(e) => setMinute(parseInt(e.target.value))}
                              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 font-mono bg-slate-900/30 px-3 py-2 rounded border border-slate-800">
                          Cron: {generateCron()}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 text-purple-400">
                          <Globe className="w-5 h-5" />
                          <span className="text-sm font-bold uppercase tracking-wider">Language Resonance</span>
                        </div>
                        <div className="flex gap-2">
                          {['de', 'en', 'es', 'fr'].map((lang, idx) => (
                            <motion.button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + idx * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-6 py-3 rounded-lg transition-all font-bold ${
                                sprachen.includes(lang)
                                  ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border-2 border-purple-500 shadow-lg shadow-purple-500/30'
                                  : 'bg-slate-800/50 text-slate-400 border-2 border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              {lang.toUpperCase()}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 text-pink-400">
                          <Dna className="w-5 h-5" />
                          <span className="text-sm font-bold uppercase tracking-wider">Style Alchemy</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['technisch', 'akademisch', 'literarisch', 'poetisch'].map((style, idx) => (
                            <motion.button
                              key={style}
                              type="button"
                              onClick={() => toggleStyle(style)}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + idx * 0.05 }}
                              whileHover={{ scale: 1.1, rotate: 2 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-5 py-2 rounded-full transition-all text-sm font-semibold ${
                                styles.includes(style)
                                  ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300 border-2 border-pink-500 shadow-lg shadow-pink-500/30'
                                  : 'bg-slate-800/50 text-slate-400 border-2 border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              {style}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-4 pt-6 border-t border-slate-800"
                      >
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 px-6 py-4 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-bold shadow-lg shadow-purple-500/30"
                        >
                          <Save className="w-5 h-5" />
                          {loading ? 'Updating Stream...' : 'Update Stream'}
                        </motion.button>
                      </motion.div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
