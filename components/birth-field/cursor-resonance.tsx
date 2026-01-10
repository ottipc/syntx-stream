'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

export function CursorResonance() {
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0);
  const [trail, setTrail] = useState<Array<Point & { id: number }>>([]);
  const [lastPos, setLastPos] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      const newSpeed = Math.hypot(newPos.x - lastPos.x, newPos.y - lastPos.y);
      
      setSpeed(Math.min(newSpeed, 50));
      setPos(newPos);
      setLastPos(newPos);
      
      setTrail(prev => [...prev.slice(-15), { ...newPos, id: Date.now() }]);
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [lastPos]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Trail */}
      <AnimatePresence>
        {trail.map(point => (
          <motion.div
            key={point.id}
            className="absolute rounded-full bg-cyan-400"
            style={{
              left: point.x,
              top: point.y,
              width: 2,
              height: 2,
              boxShadow: '0 0 5px rgba(0,255,255,0.8)'
            }}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

      {/* Glow */}
      <motion.div
        className="absolute"
        style={{
          left: pos.x,
          top: pos.y,
          width: 100 + speed * 2,
          height: 100 + speed * 2,
          background: `radial-gradient(circle, rgba(0,255,255,${0.3 + speed * 0.01}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
