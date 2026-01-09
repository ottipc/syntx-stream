'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface Prompt {
  id: string;
  timestamp: string;
  topic: string;
  score: number;
  wrapper?: string;
  style?: string;
  prompt_text?: string;
}

export function PromptTimeline() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPrompt, setHoveredPrompt] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://dev.syntx-system.com/api/strom/prompts/complete-export?page=1&page_size=100')
      .then(res => res.json())
      .then(data => {
        console.log('Prompt data:', data); // DEBUG
        if (data.exports) {
          setPrompts(data.exports);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black/80 border-2 border-cyan-500/30 rounded-3xl p-8">
        <Clock className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="bg-black/80 border-2 border-cyan-500/30 rounded-3xl p-8 text-center">
        <div className="text-cyan-400 font-bold">No prompts available</div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Group by day
  const groupedByDay = prompts.reduce((acc, prompt) => {
    const day = new Date(prompt.timestamp).toLocaleDateString('de-DE');
    if (!acc[day]) acc[day] = [];
    acc[day].push(prompt);
    return acc;
  }, {} as Record<string, Prompt[]>);

  return (
    <div className="relative bg-black rounded-3xl border-4 border-cyan-400 overflow-hidden shadow-2xl shadow-cyan-500/50">
      <div className="relative p-8">
        <div className="flex items-center gap-4 mb-8">
          <Clock className="text-cyan-400" size={32} />
          <h3 className="text-cyan-400 font-black text-3xl tracking-wider uppercase">
            PROMPT TIMELINE
          </h3>
        </div>

        <div className="relative">
          {/* Timeline axis */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-900/30" />

          <div className="space-y-8 pl-12">
            {Object.entries(groupedByDay).map(([day, dayPrompts], dayIdx) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIdx * 0.1 }}
              >
                {/* Day marker */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 border-4 border-black -translate-x-1.5" />
                  <div className="text-cyan-400 font-bold text-lg">{day}</div>
                  <div className="text-gray-500 text-sm">({dayPrompts.length} prompts)</div>
                </div>

                {/* Prompts for this day */}
                <div className="flex flex-wrap gap-2">
                  {dayPrompts.map((prompt, idx) => {
                    const isHovered = hoveredPrompt === prompt.id;
                    
                    return (
                      <motion.div
                        key={prompt.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: dayIdx * 0.1 + idx * 0.02, type: "spring" }}
                        whileHover={{ scale: 1.8, zIndex: 100 }}
                        onMouseEnter={() => setHoveredPrompt(prompt.id)}
                        onMouseLeave={() => setHoveredPrompt(null)}
                        className={`relative w-3 h-3 rounded-full ${getScoreColor(prompt.score || 0)} 
                                   border-2 border-white cursor-pointer shadow-lg`}
                        style={{
                          boxShadow: isHovered ? '0 0 20px rgba(6,182,212,1)' : '0 0 5px rgba(0,0,0,0.5)'
                        }}
                      >
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 
                                     bg-black/98 border-4 border-cyan-500 rounded-2xl p-4 
                                     shadow-2xl z-[200] min-w-[280px] max-w-[400px]"
                            style={{
                              boxShadow: '0 0 40px rgba(6,182,212,0.8)'
                            }}
                          >
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between gap-6 pb-2 border-b-2 border-cyan-900">
                                <span className="text-gray-500 font-mono text-xs">PROMPT ID</span>
                                <span className="text-cyan-400 font-mono text-xs truncate max-w-[180px]">
                                  {prompt.id.slice(0, 20)}...
                                </span>
                              </div>

                              <div className="flex justify-between gap-4">
                                <span className="text-gray-400 font-bold">Topic:</span>
                                <span className="text-cyan-400 font-black capitalize">{prompt.topic || 'N/A'}</span>
                              </div>

                              <div className="flex justify-between gap-4">
                                <span className="text-gray-400 font-bold">Score:</span>
                                <span className={`font-black text-2xl ${
                                  (prompt.score || 0) >= 80 ? 'text-green-400' :
                                  (prompt.score || 0) >= 60 ? 'text-yellow-400' :
                                  (prompt.score || 0) >= 40 ? 'text-orange-400' : 'text-red-400'
                                }`}>
                                  {prompt.score || 0}
                                </span>
                              </div>

                              {prompt.wrapper && (
                                <div className="flex justify-between gap-4">
                                  <span className="text-gray-400 font-bold">Wrapper:</span>
                                  <span className="text-white font-bold">{prompt.wrapper}</span>
                                </div>
                              )}

                              {prompt.style && (
                                <div className="flex justify-between gap-4">
                                  <span className="text-gray-400 font-bold">Style:</span>
                                  <span className="text-white font-bold">{prompt.style}</span>
                                </div>
                              )}

                              <div className="text-gray-500 pt-3 border-t-2 border-cyan-900 font-mono text-xs">
                                {new Date(prompt.timestamp).toLocaleString('de-DE')}
                              </div>

                              {prompt.prompt_text && (
                                <div className="pt-3 border-t-2 border-cyan-900">
                                  <div className="text-gray-500 text-xs mb-2 font-bold">PREVIEW:</div>
                                  <div className="text-gray-400 text-[10px] leading-relaxed max-h-24 overflow-y-auto bg-black/50 p-2 rounded border border-cyan-900">
                                    {prompt.prompt_text.slice(0, 200)}
                                    {prompt.prompt_text.length > 200 ? '...' : ''}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Corner decorations */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            <span className="text-gray-400 font-mono">80-100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white" />
            <span className="text-gray-400 font-mono">60-80</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white" />
            <span className="text-gray-400 font-mono">40-60</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
            <span className="text-gray-400 font-mono">0-40</span>
          </div>
        </div>
      </div>
    </div>
  );
}
