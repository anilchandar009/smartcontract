import React, { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { config } from './config/wagmi'
import { WalletSelector } from './components/WalletSelector'
import { WalletInfo } from './components/WalletInfo'
import { PaymentExecutorWithTestMode } from './components/PaymentExecutorWithTestMode'
import { TestModeToggle } from './components/TestModeToggle'
import { SuccessPage } from './components/SuccessPage'
import { ContractDeploymentHelper } from './components/ContractDeploymentHelper'
import { PAYMENT_AMOUNTS } from './config/contract'

const queryClient = new QueryClient()

function AppContent() {
  const { isConnected } = useAccount()
  const [showWalletSelector, setShowWalletSelector] = useState(!isConnected)
  const [successTxHash, setSuccessTxHash] = useState<string>('')
  const [isTestMode, setIsTestMode] = useState(false) // Real blockchain mode by default
  const [showContractHelper, setShowContractHelper] = useState(false) // Hide by default for real usage

  React.useEffect(() => {
    setShowWalletSelector(!isConnected)
  }, [isConnected])

  const handleWalletConnected = () => {
    setShowWalletSelector(false)
  }

  const handlePaymentSuccess = (txHash: string) => {
    setSuccessTxHash(txHash)
  }

  const handleReset = () => {
    setSuccessTxHash('')
  }
  
  const handleModeChange = (testMode: boolean) => {
    setIsTestMode(testMode)
  }

  if (successTxHash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto space-y-8 py-8">
          <SuccessPage txHash={successTxHash} onReset={handleReset} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            BNB Payment Distribution Portal
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-2xl font-semibold text-white">
              Total Payment Required: <span className="text-yellow-400">{PAYMENT_AMOUNTS.total} BNB</span>
            </div>
            <div className="text-white/60 mt-2">
              BSC Testnet • Automatic Distribution {isTestMode && '• Test Mode'}
            </div>
          </div>
        </div>

        {/* Test Mode Toggle */}
        <TestModeToggle onModeChange={handleModeChange} />

        {/* Contract Deployment Helper */}
        {showContractHelper && !isTestMode && (
          <ContractDeploymentHelper />
        )}

        {/* Wallet Connection */}
        {showWalletSelector && (
          <WalletSelector onConnected={handleWalletConnected} />
        )}

        {/* Connected Wallet Info */}
        {isConnected && !showWalletSelector && (
          <WalletInfo />
        )}

        {/* Payment Executor */}
        {isConnected && !showWalletSelector && (
          <PaymentExecutorWithTestMode onSuccess={handlePaymentSuccess} isTestMode={isTestMode} />
        )}

        {/* Footer */}
        <div className="text-center text-white/40 text-sm">
          <p>Make sure you're connected to BSC Testnet</p>
          <p className="mt-1">
            Contract Address: <span className="font-mono">0x1234...7890</span>
          </p>
          {isTestMode && (
            <p className="mt-2 text-yellow-400 text-xs">
              🧪 Development Mode: Simulated transactions for testing
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App