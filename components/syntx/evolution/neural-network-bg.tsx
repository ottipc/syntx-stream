'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'core' | 'edge';
}

export function NeuralNetworkBackground() {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    const initialNodes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03,
      type: Math.random() > 0.7 ? 'core' : 'edge' as 'core' | 'edge'
    }));
    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        x: (node.x + node.vx + 100) % 100,
        y: (node.y + node.vy + 100) % 100
      })));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 20) {
        connections.push({
          from: nodes[i],
          to: nodes[j],
          opacity: 1 - (distance / 20),
          color: nodes[i].type === 'core' || nodes[j].type === 'core' ? '168,85,247' : '6,182,212'
        });
      }
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-25">
      <svg className="w-full h-full">
        <defs>
          <filter id="neuralGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6,182,212,0)" />
            <stop offset="50%" stopColor="rgba(6,182,212,0.5)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </linearGradient>
        </defs>

        {connections.map((conn, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke={`rgba(${conn.color},${conn.opacity * 0.4})`}
            strokeWidth="1.5"
            filter="url(#neuralGlow)"
            animate={{
              strokeDasharray: ['0, 1000', '1000, 0'],
              opacity: [conn.opacity * 0.3, conn.opacity * 0.6, conn.opacity * 0.3]
            }}
            transition={{
              strokeDasharray: { duration: 3, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity }
            }}
          />
        ))}

        {nodes.map((node) => (
          <g key={`node-${node.id}`}>
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.type === 'core' ? 4 : 2}
              fill={node.type === 'core' ? 'rgba(168,85,247,0.8)' : 'rgba(6,182,212,0.6)'}
              filter="url(#neuralGlow)"
              animate={{
                r: node.type === 'core' ? [4, 6, 4] : [2, 3, 2],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: node.type === 'core' ? 3 : 2,
                repeat: Infinity,
                delay: node.id * 0.05
              }}
            />
            {node.type === 'core' && (
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="8"
                fill="none"
                stroke="rgba(168,85,247,0.3)"
                strokeWidth="1"
                animate={{
                  r: [8, 16, 8],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: node.id * 0.05
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
