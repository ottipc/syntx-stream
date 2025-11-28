// app/page.tsx - SYNTX OS Base Interface
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
    setResponse(`SYNTX ${selectedMode} Response: Field resonance detected at 87%`)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">⚡ SYNTX OS</h1>
        <Badge variant="outline" className="bg-green-950 text-green-400">
          FIELD_ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {SYNTX_MODES.map((mode) => (
          <Button
            key={mode}
            variant={selectedMode === mode ? "default" : "outline"}
            className={selectedMode === mode ? "bg-green-600" : "border-green-400 text-green-400"}
            onClick={() => setSelectedMode(mode)}
          >
            {mode}
          </Button>
        ))}
      </div>

      <Card className="bg-gray-900 border-green-400 mb-4">
        <CardContent className="p-4">
          <Textarea
            placeholder="Enter SYNTX Prompt..."
            className="bg-black border-green-400 text-green-400 min-h-[100px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSend} className="w-full bg-green-600 hover:bg-green-700 mb-8">
        SEND TO FIELD
      </Button>

      {response && (
        <Card className="bg-gray-900 border-blue-400">
          <CardHeader>
            <CardTitle className="text-blue-400">Response</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-300">{response}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
