'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// ═══════════════════════════════════════════════════════════════
// SYNTX CHROMATIK
// ═══════════════════════════════════════════════════════════════

const SYNTX_CHROMATIK = {
  FIELD_CORE: '#06b6d4',
  DRIFT_ZONE: '#a855f7',
  NORMAL_AREA: '#ef4444',
  NEURON_PATH: '#22c55e',
  OUTPUT_CORE: '#ec4899',
  WARNING: '#eab308',
};

// Score → Color Mapping (Universal)
const getScoreColor = (score: number) => {
  if (score > 70) return SYNTX_CHROMATIK.NEURON_PATH;
  if (score > 40) return SYNTX_CHROMATIK.WARNING;
  return SYNTX_CHROMATIK.NORMAL_AREA;
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface WrapperSignature {
  colors: string[];
  pattern: string;
  avg_score: number;
}

interface DashboardData {
  system_health: {
    total_prompts: number;
    avg_score: number;
    perfect_scores: number;
    success_rate: number;
  };
  queue: {
    incoming: number;
    processing: number;
    processed: number;
    errors: number;
  };
  topics: Record<string, {
    count: number;
    avg_score: number;
  }>;
  wrappers: Record<string, {
    total_jobs: number;
    avg_score: number;
    success_rate: number;
  }>;
  wrapper_signatures: Record<string, WrapperSignature>;
  recent_completed: Array<{
    job_id: string;
    wrapper: string;
    score: number;
    duration_ms: number;
    timestamp?: string;
    topic?: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function DashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pulseWave, setPulseWave] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log('🔄 Fetching dashboard data...');
        
        const [dashboardRes, queueRes, topicsRes, wrappersRes] = await Promise.all([
          fetch('https://dev.syntx-system.com/api/strom/analytics/complete-dashboard'),
          fetch('https://dev.syntx-system.com/api/strom/monitoring/live-queue'),
          fetch('https://dev.syntx-system.com/api/strom/analytics/topics'),
          fetch('https://dev.syntx-system.com/api/strom/compare/wrappers'),
        ]);

        const [dashboard, queue, topics, wrappers] = await Promise.all([
          dashboardRes.json(),
          queueRes.json(),
          topicsRes.json(),
          wrappersRes.json(),
        ]);

        console.log('✅ Wrappers data:', wrappers.wrappers);

        // GENERATE WRAPPER SIGNATURES DYNAMISCH AUS AVG_SCORE
        const wrapper_signatures: Record<string, WrapperSignature> = {};
        Object.entries(wrappers.wrappers || {}).forEach(([name, data]: [string, any]) => {
          const score = data.avg_score || 0;
          const baseColor = getScoreColor(score);
          
          // Pattern based on wrapper name
          let pattern = 'DEFAULT';
          if (name.includes('syntex') || name.includes('system')) pattern = 'PULSING_DEPTH';
          else if (name.includes('sigma')) pattern = 'HEARTBEAT';
          else if (name.includes('deep')) pattern = 'WATER_LINES';
          else if (name.includes('human')) pattern = 'FLOW';

          wrapper_signatures[name] = {
            colors: [baseColor, SYNTX_CHROMATIK.DRIFT_ZONE],
            pattern,
            avg_score: score
          };
        });

        console.log('✅ Generated signatures:', wrapper_signatures);

        setData({
          system_health: dashboard.system_health || {
            total_prompts: 0,
            avg_score: 0,
            perfect_scores: 0,
            success_rate: 0
          },
          queue: queue.queue || {
            incoming: 0,
            processing: 0,
            processed: 0,
            errors: 0
          },
          topics: topics.topics || {},
          wrappers: wrappers.wrappers || {},
          wrapper_signatures,
          recent_completed: (queue.recent_completed || []).slice(0, 10).filter((item: any) => item && item.job_id)
        });

        setPulseWave(true);
        setTimeout(() => setPulseWave(false), 2000);
        setError(null);
      } catch (err: any) {
        console.error('❌ Dashboard fetch error:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingOrganism />;
  }

  if (error) {
    return <ErrorField message={error} />;
  }

  if (!data) {
    return <ErrorField message="No data available" />;
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <NeuronalField />
      
      <div className="relative z-10 p-8 space-y-8">
        <HeaderCore health={data.system_health} />

        <AnimatePresence>
          {pulseWave && <PulseWave />}
        </AnimatePresence>

        <div className="relative space-y-8">
          <QueueOrganism queue={data.queue} />
          <TopicsField topics={data.topics} />
          <WrapperField wrappers={data.wrappers} signatures={data.wrapper_signatures} />
          {data.recent_completed.length > 0 && (
            <GalaxyStream items={data.recent_completed} signatures={data.wrapper_signatures} />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING & ERROR (unchanged)
// ═══════════════════════════════════════════════════════════════

function LoadingOrganism() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 border-2 rounded-full"
            style={{ borderColor: SYNTX_CHROMATIK.FIELD_CORE }}
            animate={{
              scale: [1, 2],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        <motion.div
          className="relative w-32 h-32 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Image src="/Logo1.png" alt="SYNTX" width={80} height={80} />
        </motion.div>
      </div>
    </div>
  );
}

function ErrorField({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
      <motion.div
        className="text-6xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚠️
      </motion.div>
      <motion.div
        className="text-2xl font-mono"
        style={{ color: SYNTX_CHROMATIK.NORMAL_AREA }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        FELD BRUCH
      </motion.div>
      <div className="text-sm font-mono text-gray-500 max-w-md text-center">
        {message}
      </div>
    </div>
  );
}

function NeuronalField() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${SYNTX_CHROMATIK.FIELD_CORE}40 1px, transparent 1px), linear-gradient(90deg, ${SYNTX_CHROMATIK.FIELD_CORE}40 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`neuron-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: SYNTX_CHROMATIK.FIELD_CORE,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

function PulseWave() {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 z-50"
      style={{
        background: `linear-gradient(90deg, transparent, ${SYNTX_CHROMATIK.FIELD_CORE}, transparent)`,
        boxShadow: `0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: 'easeOut' }}
    />
  );
}

// Header, Queue, Topics (unchanged from previous version - keeping them short)
function HeaderCore({ health }: { health: DashboardData['system_health'] }) {
  return (
    <motion.div className="relative" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <div className="flex items-center justify-center gap-6">
        <motion.div animate={{ scale: [1, 1.05, 1], boxShadow: [`0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}80`, `0 0 40px ${SYNTX_CHROMATIK.FIELD_CORE}`, `0 0 20px ${SYNTX_CHROMATIK.FIELD_CORE}80`] }} transition={{ duration: 3, repeat: Infinity }} className="rounded-full">
          <Image src="/Logo1.png" alt="SYNTX" width={100} height={100} />
        </motion.div>
        <div className="text-center">
          <motion.h1 className="text-6xl font-black tracking-widest mb-2" style={{ color: SYNTX_CHROMATIK.FIELD_CORE, textShadow: `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}` }} animate={{ textShadow: [`0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}`, `0 0 50px ${SYNTX_CHROMATIK.FIELD_CORE}`, `0 0 30px ${SYNTX_CHROMATIK.FIELD_CORE}`] }} transition={{ duration: 2, repeat: Infinity }}>DASHBOARD</motion.h1>
          <p className="text-sm font-mono text-gray-500 tracking-[0.3em]">LEBENDER ORGANISMUS · ECHTZEIT STROM</p>
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-8">
        <HealthNode label="PROMPTS" value={health.total_prompts} />
        <HealthNode label="AVG SCORE" value={Math.round(health.avg_score)} suffix="%" />
        <HealthNode label="SUCCESS" value={Math.round(health.success_rate * 100)} suffix="%" color={SYNTX_CHROMATIK.NEURON_PATH} />
      </div>
    </motion.div>
  );
}

function HealthNode({ label, value, suffix = '', color = SYNTX_CHROMATIK.FIELD_CORE }: any) {
  return (
    <motion.div className="relative" whileHover={{ scale: 1.1 }}>
      <motion.div className="absolute -inset-4 rounded-full blur-xl" style={{ backgroundColor: color }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <div className="relative text-center">
        <motion.div className="text-4xl font-black font-mono" style={{ color }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{value}{suffix}</motion.div>
        <div className="text-xs text-gray-500 font-mono mt-1 tracking-wider">{label}</div>
      </div>
    </motion.div>
  );
}

function QueueOrganism({ queue }: { queue: DashboardData['queue'] }) {
  return (
    <motion.div className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-center gap-16">
        <QueueCore label="INCOMING" value={queue.incoming} color={SYNTX_CHROMATIK.DRIFT_ZONE} />
        <QueueCore label="PROCESSING" value={queue.processing} color={SYNTX_CHROMATIK.WARNING} isPulsing />
        <QueueCore label="PROCESSED" value={queue.processed} color={SYNTX_CHROMATIK.NEURON_PATH} />
        <QueueCore label="ERRORS" value={queue.errors} color={SYNTX_CHROMATIK.NORMAL_AREA} />
      </div>
    </motion.div>
  );
}

function QueueCore({ label, value, color, isPulsing = false }: any) {
  return (
    <motion.div className="relative group cursor-pointer" whileHover={{ scale: 1.1 }}>
      {[...Array(3)].map((_, i) => (
        <motion.div key={`ring-${i}`} className="absolute inset-0 border-2 rounded-full" style={{ borderColor: color }} animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      <motion.div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20`, border: `2px solid ${color}`, boxShadow: `0 0 30px ${color}60` }} animate={isPulsing ? { scale: [1, 1.1, 1], boxShadow: [`0 0 30px ${color}60`, `0 0 50px ${color}`, `0 0 30px ${color}60`] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="text-center">
          <motion.div className="text-4xl font-black font-mono" style={{ color }}>{value}</motion.div>
          <div className="text-[10px] text-gray-500 font-mono mt-1 tracking-widest">{label}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TopicsField({ topics }: { topics: Record<string, any> }) {
  const topicArray = Object.entries(topics);
  if (topicArray.length === 0) return null;
  return (
    <motion.div className="relative mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-widest" style={{ color: SYNTX_CHROMATIK.DRIFT_ZONE, textShadow: `0 0 20px ${SYNTX_CHROMATIK.DRIFT_ZONE}` }}>TOPIC FIELD</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {topicArray.map(([topic, data], i) => (
          <TopicNode key={`topic-${topic}`} topic={topic} data={data} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}

function TopicNode({ topic, data, delay }: any) {
  const color = getScoreColor(data.avg_score);
  return (
    <motion.div className="relative group cursor-pointer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ scale: 1.05, y: -5 }}>
      <motion.div className="px-6 py-4 rounded-xl" style={{ backgroundColor: `${color}10`, border: `2px solid ${color}60` }} animate={{ boxShadow: [`0 0 15px ${color}40`, `0 0 25px ${color}60`, `0 0 15px ${color}40`] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="text-lg font-bold font-mono uppercase tracking-wider" style={{ color }}>{topic}</div>
        <div className="flex gap-4 mt-2 text-sm font-mono text-gray-400">
          <span>{data.count} runs</span>
          <span>·</span>
          <motion.span style={{ color }} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>{Math.round(data.avg_score)}%</motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WRAPPER FIELD - NOW WITH DYNAMIC SIGNATURES
// ═══════════════════════════════════════════════════════════════

function WrapperField({ wrappers, signatures }: { wrappers: Record<string, any>; signatures: Record<string, WrapperSignature> }) {
  const wrapperArray = Object.entries(wrappers);
  if (wrapperArray.length === 0) return null;

  return (
    <motion.div className="relative mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-widest" style={{ color: SYNTX_CHROMATIK.OUTPUT_CORE, textShadow: `0 0 20px ${SYNTX_CHROMATIK.OUTPUT_CORE}` }}>WRAPPER SIGNATURES</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {wrapperArray.map(([wrapper, data]) => (
          <WrapperSignature key={`wrapper-${wrapper}`} wrapper={wrapper} data={data} signature={signatures[wrapper]} />
        ))}
      </div>
    </motion.div>
  );
}

function WrapperSignature({ wrapper, data, signature }: any) {
  const sig = signature || { colors: [SYNTX_CHROMATIK.FIELD_CORE], pattern: 'DEFAULT' };
  return (
    <motion.div className="relative group cursor-pointer" whileHover={{ scale: 1.05 }}>
      <motion.div className="p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${sig.colors[0]}20, ${sig.colors[sig.colors.length - 1]}20)`, border: `2px solid ${sig.colors[0]}60` }} animate={{ boxShadow: sig.colors.map((c: string) => `0 0 20px ${c}60`) }} transition={{ duration: sig.pattern === 'HEARTBEAT' ? 1 : 2, repeat: Infinity }}>
        <div className="text-sm font-mono font-bold uppercase tracking-wider mb-3" style={{ color: sig.colors[0] }}>{wrapper}</div>
        <div className="space-y-1 text-xs font-mono text-gray-400">
          <div>{data.total_jobs} jobs</div>
          <div style={{ color: sig.colors[0] }}>{Math.round(data.avg_score)}% avg</div>
        </div>
      </motion.div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: sig.colors[0] }} />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GALAXY STREAM - NOW WITH DYNAMIC SIGNATURES
// ═══════════════════════════════════════════════════════════════

function GalaxyStream({ items, signatures }: { items: DashboardData['recent_completed']; signatures: Record<string, WrapperSignature> }) {
  if (!items || items.length === 0) return null;

  return (
    <motion.div className="relative mt-16 pb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <div className="text-center mb-12">
        <motion.h2 className="text-4xl font-black tracking-[0.3em]" style={{ color: SYNTX_CHROMATIK.NEURON_PATH, textShadow: `0 0 30px ${SYNTX_CHROMATIK.NEURON_PATH}` }} animate={{ textShadow: [`0 0 30px ${SYNTX_CHROMATIK.NEURON_PATH}`, `0 0 50px ${SYNTX_CHROMATIK.NEURON_PATH}`, `0 0 30px ${SYNTX_CHROMATIK.NEURON_PATH}`] }} transition={{ duration: 2, repeat: Infinity }}>RECENT GALAXY STREAM</motion.h2>
        <p className="text-xs text-gray-500 font-mono mt-2 tracking-[0.3em]">LETZTE {items.length} STRÖME IM UNIVERSUM</p>
      </div>
      <div className="relative min-h-[600px]">
        {items.map((item, i) => (
          <GalaxyNode key={`galaxy-${item.job_id}-${i}`} item={item} index={i} total={items.length} signature={signatures[item.wrapper]} />
        ))}
      </div>
    </motion.div>
  );
}

function GalaxyNode({ item, index, total, signature }: { item: any; index: number; total: number; signature?: WrapperSignature }) {
  const sig = signature || { colors: [SYNTX_CHROMATIK.FIELD_CORE], pattern: 'DEFAULT', avg_score: 0 };
  const primaryColor = sig.colors[0];
  const secondaryColor = sig.colors[1] || primaryColor;
  const scoreColor = getScoreColor(item.score);

  const angle = (index / total) * Math.PI * 2;
  const radius = 200 + (index % 3) * 80;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div className="absolute left-1/2 top-1/2 cursor-pointer" style={{ x, y }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: 360 }} transition={{ delay: index * 0.1, duration: 1, rotate: { duration: 20 + index * 2, repeat: Infinity, ease: 'linear' } }} whileHover={{ scale: 1.3, zIndex: 50 }}>
      {[...Array(3)].map((_, i) => (
        <motion.div key={`ring-${i}`} className="absolute inset-0 border-2 rounded-full" style={{ borderColor: primaryColor, width: 120 + i * 40, height: 120 + i * 40, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3], rotate: [0, 180, 360] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
      ))}
      <motion.div className="relative w-32 h-32 rounded-full flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle, ${primaryColor}60 0%, ${secondaryColor}40 50%, transparent 100%)`, border: `3px solid ${primaryColor}`, boxShadow: `0 0 40px ${primaryColor}80, inset 0 0 30px ${primaryColor}40` }} animate={{ boxShadow: [`0 0 40px ${primaryColor}80, inset 0 0 30px ${primaryColor}40`, `0 0 60px ${primaryColor}, inset 0 0 50px ${primaryColor}60`, `0 0 40px ${primaryColor}80, inset 0 0 30px ${primaryColor}40`] }} transition={{ duration: 2, repeat: Infinity }}>
        {[...Array(8)].map((_, i) => (
          <motion.div key={`star-${i}`} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 30}%`, top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 30}%` }} animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
        ))}
        <motion.div className="relative z-10 text-center" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <div className="text-3xl font-black font-mono" style={{ color: scoreColor, textShadow: `0 0 15px ${scoreColor}` }}>{item.score}%</div>
          <div className="text-[8px] text-gray-300 font-mono mt-1 uppercase tracking-wider">{item.wrapper}</div>
        </motion.div>
      </motion.div>
      <motion.div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl" style={{ backgroundColor: `${primaryColor}20`, border: `2px solid ${primaryColor}`, backdropFilter: 'blur(10px)' }} initial={{ opacity: 0, y: 10, scale: 0.8 }} whileHover={{ opacity: 1, y: 0, scale: 1 }}>
        <div className="text-xs font-mono space-y-1">
          <div className="font-bold truncate" style={{ color: primaryColor }}>{item.job_id?.substring(0, 20) || 'UNKNOWN'}...</div>
          <div className="flex justify-between text-gray-300"><span>Duration:</span><span>{Math.round(item.duration_ms / 1000)}s</span></div>
          <div className="flex justify-between text-gray-300"><span>Score:</span><span style={{ color: scoreColor }}>{item.score}%</span></div>
          {item.topic && <div className="flex justify-between text-gray-300"><span>Topic:</span><span className="uppercase">{item.topic}</span></div>}
        </div>
      </motion.div>
      {[...Array(5)].map((_, i) => (
        <motion.div key={`particle-${i}`} className="absolute w-1 h-1 rounded-full" style={{ backgroundColor: primaryColor, left: '50%', top: '50%' }} animate={{ x: [0, Math.cos((i / 5) * Math.PI * 2) * 60], y: [0, Math.sin((i / 5) * Math.PI * 2) * 60], opacity: [1, 0], scale: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </motion.div>
  );
}
