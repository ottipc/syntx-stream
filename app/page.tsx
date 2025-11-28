// app/page.tsx - SYNTX STROM TABELLEN & STRÖME
'use client'

import { useState, useEffect } from 'react'

const SYNTX_MODES = ['TRUE_RAW', 'CYBERDARK', 'SIGMA', 'FIELD_HYGIENE'] as const

export default function SYNTXOS() {
  const [selectedMode, setSelectedMode] = useState<typeof SYNTX_MODES[number]>('TRUE_RAW')
  const [activeTab, setActiveTab] = useState<'health' | 'topics' | 'prompts' | 'analytics'>('health')
  const [health, setHealth] = useState<any>(null)
  const [topics, setTopics] = useState<any>(null)
  const [prompts, setPrompts] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Health Strom
  useEffect(() => {
    const loadHealth = async () => {
      try {
        const res = await fetch('/api/strom/health')
        const data = await res.json()
        setHealth(data)
      } catch (error) {
        setHealth({status: 'STROM_BLOCKIERT', feld_count: 0})
      }
    }
    loadHealth()
    const interval = setInterval(loadHealth, 15000)
    return () => clearInterval(interval)
  }, [])

  // Topics Strom
  const loadTopics = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/strom/topics')
      const data = await res.json()
      setTopics(data)
    } catch (error) {
      console.log('Topics load failed')
    }
    setIsLoading(false)
  }

  // Prompts Strom
  const loadPrompts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/strom/prompts?limit=10')
      const data = await res.json()
      setPrompts(data.prompts || [])
    } catch (error) {
      console.log('Prompts load failed')
    }
    setIsLoading(false)
  }

  // Analytics Strom
  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/strom/analytics/temporal')
      const data = await res.json()
      setAnalytics(data)
    } catch (error) {
      console.log('Analytics load failed')
    }
    setIsLoading(false)
  }

  // Tab wechseln
  useEffect(() => {
    if (activeTab === 'topics') loadTopics()
    if (activeTab === 'prompts') loadPrompts() 
    if (activeTab === 'analytics') loadAnalytics()
  }, [activeTab])

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl font-light mb-4">SYNTX</div>
        <div className="text-2xl font-light mb-6">SYNTX isn't AI.<br/>It's the resonance that governs it</div>
        
        {/* Live Status */}
        {health && (
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className={`px-3 py-1 rounded-full text-white ${
              health.status === 'STROM_FLIESST' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {health.status}
            </div>
            <div className="text-gray-600">
              {health.feld_count} Felder • v{health.api_version}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-8 text-lg mb-8">
          <button className="hover:underline">Explore SYNTX</button>
          <button className="hover:underline">Contact Us</button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center space-x-4 mb-8">
        {SYNTX_MODES.map((mode) => (
          <button
            key={mode}
            className={`px-4 py-2 rounded-full border ${
              selectedMode === mode 
                ? 'bg-black text-white border-black' 
                : 'border-gray-400 text-gray-700 hover:border-black'
            }`}
            onClick={() => setSelectedMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-1 mb-8 border-b">
        {[
          { id: 'health', label: 'Health Strom' },
          { id: 'topics', label: 'Topics Strom' },
          { id: 'prompts', label: 'Prompts Strom' },
          { id: 'analytics', label: 'Analytics Strom' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium border-b-2 ${
              activeTab === tab.id 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto">
        {isLoading && (
          <div className="text-center py-8 text-gray-500">Loading {activeTab} data...</div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && health && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-green-200 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">{health.status}</div>
              <div className="text-green-800">System Status</div>
            </div>
            <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{health.feld_count}</div>
              <div className="text-blue-800">Active Felder</div>
            </div>
            <div className="p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">v{health.api_version}</div>
              <div className="text-purple-800">API Version</div>
            </div>
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && topics && (
          <div className="space-y-4">
            <div className="text-lg font-medium mb-4">
              {topics.data?.feld_statistik?.total_topics} Topics verfügbar
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.data?.topics?.map((topic: any, index: number) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg hover:border-black transition-colors">
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Kategorie: {topic.category} • {topic.prompt_count} Felder
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Styles: {topic.style_support?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && prompts.length > 0 && (
          <div className="space-y-4">
            <div className="text-lg font-medium mb-4">
              {prompts.length} Prompts im Strom
            </div>
            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-blue-600">{prompt.topic}</div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      prompt.quality_score >= 8 ? 'bg-green-100 text-green-800' :
                      prompt.quality_score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Q{prompt.quality_score}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{prompt.content}</div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Style: {prompt.style}</span>
                    <span>{new Date(prompt.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border-2 border-blue-200 rounded-lg">
                <div className="text-lg font-medium text-blue-600">Zeitraum</div>
                <div className="text-sm text-gray-600 mt-2">
                  Von: {new Date(analytics.temporal_analytics?.time_span?.earliest).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Bis: {new Date(analytics.temporal_analytics?.time_span?.latest).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Tage: {analytics.temporal_analytics?.time_span?.total_days}
                </div>
              </div>
              
              <div className="p-4 border-2 border-green-200 rounded-lg">
                <div className="text-lg font-medium text-green-600">Generierung</div>
                <div className="text-2xl font-bold mt-2">
                  {analytics.temporal_analytics?.generation_flow?.total_felder} Felder
                </div>
                <div className="text-sm text-gray-600">
                  Ø {Math.round(analytics.temporal_analytics?.generation_flow?.avg_per_day)} pro Tag
                </div>
              </div>
            </div>

            {/* Tägliche Generierung */}
            <div className="p-4 border-2 border-purple-200 rounded-lg">
              <div className="text-lg font-medium text-purple-600 mb-4">Tägliche Generierung</div>
              <div className="space-y-2">
                {Object.entries(analytics.temporal_analytics?.generation_flow?.by_day || {}).map(([date, count]) => (
                  <div key={date} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">{new Date(date).toLocaleDateString('de-DE')}</span>
                    <span className="font-medium">{count as number} Felder</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 border-t pt-8">
        <div>© SYNTX • {health?.feld_count || 0} Felder flowing</div>
      </div>
    </div>
  )
}
