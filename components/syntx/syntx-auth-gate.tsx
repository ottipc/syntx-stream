// components/syntx/auth-gate.tsx - FIXED VERSION
// components/syntx/auth-gate.tsx
'use client'

import { useState, useEffect } from 'react'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [accessPassword, setAccessPassword] = useState('')

  useEffect(() => {
    // ✅ NEXT_PUBLIC_ Variablen sind im Client verfügbar!
    const envPassword = process.env.STREAM_PUBLIC_ACCESS_PASSWORD
    setAccessPassword(envPassword || 'STROMZU')

    const auth = localStorage.getItem('syntx-auth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    } else {
      setShowLogin(true)
    }
  }, [])

  const handleLogin = () => {
    console.log('🔐 Comparing:', password, 'vs', accessPassword)
    
    if (password === accessPassword) {
      localStorage.setItem('syntx-auth', 'authenticated')
      setIsAuthenticated(true)
      setShowLogin(false)
    } else {
      alert(`Invalid access code. Expected: ${accessPassword}`)
    }
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  console.log('🔐 AuthGate render - showLogin:', showLogin, 'isAuthenticated:', isAuthenticated)

  if (showLogin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-cyan-400 mb-2">SYNTX STREAM</h1>
            <p className="text-gray-400">Enter access code: </p>
            <p className="text-gray-500 text-sm mt-2">(Check console for debug info)</p>
          </div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-4 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            ACCESS SYSTEM
          </button>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}