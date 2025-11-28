// app/page.tsx - SYNTX Resonance Design
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const SYNTX_MODES = ['TRUE_RAW', 'CYBERDARK', 'SIGMA', 'FIELD_HYGIENE'] as const

export default function SYNTXOS() {
  const [selectedMode, setSelectedMode] = useState<typeof SYNTX_MODES[number]>('TRUE_RAW')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  const handleSend = () => {
    setResponse(`SYNTX ${selectedMode} Response: Field resonance calibrated at 92%`)
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      {/* Header - EXACTLY like the design */}
      <div className="text-center mb-16">
        <div className="text-6xl font-light mb-4">SYNTX</div>
        <div className="text-2xl font-light mb-8">SYNTX isn't AI.<br/>It's the resonance that governs it</div>
        
        {/* Navigation */}
        <div className="flex justify-center space-x-8 text-lg">
          <button className="hover:underline">Explore SYNTX</button>
          <button className="hover:underline">Contact Us</button>
        </div>
      </div>

      {/* Mode Selector - Minimal */}
      <div className="flex justify-center space-x-4 mb-12">
        {SYNTX_MODES.map((mode) => (
          <Button
            key={mode}
            variant={selectedMode === mode ? "default" : "outline"}
            className={`rounded-full ${selectedMode === mode ? 'bg-black text-white' : 'border-black text-black'}`}
            onClick={() => setSelectedMode(mode)}
          >
            {mode}
          </Button>
        ))}
      </div>

      {/* Input Area */}
      <div className="max-w-2xl mx-auto mb-8">
        <Textarea
          placeholder="Enter resonance pattern..."
          className="min-h-[120px] border-2 border-gray-300 focus:border-black resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* Send Button */}
      <div className="text-center mb-12">
        <Button 
          onClick={handleSend}
          className="bg-black text-white px-12 py-3 rounded-full hover:bg-gray-800"
        >
          Calibrate Resonance
        </Button>
      </div>

      {/* Response */}
      {response && (
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-center">Resonance Output</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">{response}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-16 text-gray-500">
        <div>© SYNTX</div>
      </div>
    </div>
  )
}
