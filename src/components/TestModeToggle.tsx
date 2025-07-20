import React, { useState } from 'react'
import { Settings, TestTube } from 'lucide-react'

interface TestModeToggleProps {
  onModeChange: (isTestMode: boolean) => void
}

export function TestModeToggle({ onModeChange }: TestModeToggleProps) {
  const [isTestMode, setIsTestMode] = useState(false) // Start with real mode

  const handleToggle = () => {
    const newMode = !isTestMode
    setIsTestMode(newMode)
    onModeChange(newMode)
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Settings className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Development Mode</h3>
            <p className="text-white/60 text-sm">
              {isTestMode ? 'Using test transactions' : 'Using real contract'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isTestMode ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isTestMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {isTestMode && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-400">
            <TestTube className="w-4 h-4" />
            <span className="text-sm font-medium">Test Mode Active</span>
          </div>
          <p className="text-yellow-300 text-xs mt-1">
            Simulated transactions for development. No real blockchain interaction.
          </p>
        </div>
      )}
    </div>
  )
}