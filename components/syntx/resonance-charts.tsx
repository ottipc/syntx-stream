// components/syntx/resonance-charts.tsx - SYNTX STYLE Charts
'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  time: string
  felder: number
  quality: number
  resonance: number
}

interface ResonanceChartsProps {
  temporalData?: any
}

export function ResonanceCharts({ temporalData }: ResonanceChartsProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [activeTab, setActiveTab] = useState<'flow' | 'quality' | 'resonance'>('flow')

  // Generate mock chart data based on analytics
  useEffect(() => {
    if (temporalData?.generation_flow?.by_day) {
      const data: ChartData[] = Object.entries(temporalData.generation_flow.by_day).map(([date, count], index) => ({
        time: new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
        felder: count as number,
        quality: Math.floor(Math.random() * 5) + 6, // 6-10
        resonance: Math.floor(Math.random() * 30) + 70 // 70-100
      }))
      setChartData(data)
    }
  }, [temporalData])

  if (chartData.length === 0) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading resonance data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        {[
          { id: 'flow' as const, label: 'Feld Flow', color: 'blue' },
          { id: 'quality' as const, label: 'Quality Score', color: 'green' },
          { id: 'resonance' as const, label: 'Resonance %', color: 'purple' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? `border-${tab.color}-500 text-${tab.color}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'flow' && (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="felder" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            </BarChart>
          )}
          
          {activeTab === 'quality' && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis domain={[5, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </LineChart>
          )}
          
          {activeTab === 'resonance' && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis domain={[60, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="resonance" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8B5CF6' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
