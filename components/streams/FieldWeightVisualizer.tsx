'use client'

import { motion } from 'framer-motion'

interface FieldWeightVisualizerProps {
  fields: Record<string, number>
  editable?: boolean
  onChange?: (fields: Record<string, number>) => void
}

export function FieldWeightVisualizer({ 
  fields, 
  editable = false,
  onChange 
}: FieldWeightVisualizerProps) {
  const handleChange = (field: string, value: number) => {
    if (onChange) {
      onChange({ ...fields, [field]: value })
    }
  }
  
  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([field, weight], idx) => (
        <motion.div
          key={field}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{field}</span>
            <span className="font-mono text-cyan-400">{weight.toFixed(2)}</span>
          </div>
          
          {editable ? (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weight}
              onChange={(e) => handleChange(field, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-cyan-400
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
          ) : (
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400
                  shadow-inner shadow-cyan-500/30"
                initial={{ width: 0 }}
                animate={{ width: `${weight * 100}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
