import React, { useState } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { ArrowRight, CheckCircle, Loader2, AlertTriangle, TestTube } from 'lucide-react'
import { 
  useBNBDistributorContract,
  useMockBNBContract,
  useBNBBalance
} from '../hooks/useContract'
import { PAYMENT_AMOUNTS, RECIPIENTS } from '../config/contract'

interface PaymentExecutorWithTestModeProps {
  onSuccess: (txHash: string) => void
  isTestMode?: boolean
}

export function PaymentExecutorWithTestMode({ onSuccess, isTestMode = false }: PaymentExecutorWithTestModeProps) {
  const { address } = useAccount()
  const [error, setError] = useState<string>('')

  const { balance: bnbBalance, refetchBalance } = useBNBBalance(address)
  
  // Choose contract hooks based on test mode
  const realContract = useBNBDistributorContract()
  const mockContract = useMockBNBContract()

  const contract = isTestMode ? mockContract : realContract

  const { isLoading: isDistributeConfirming } = useWaitForTransactionReceipt({
    hash: contract.distributeHash,
    query: {
      enabled: !!contract.distributeHash && !isTestMode,
    },
  })

  React.useEffect(() => {
    if (contract.distributeHash && !isDistributeConfirming) {
      // Refetch balance after distribution
      if (!isTestMode) {
        refetchBalance()
      }
      onSuccess(contract.distributeHash)
    }
  }, [contract.distributeHash, isDistributeConfirming, onSuccess, isTestMode, refetchBalance])

  const handleDistribute = async () => {
    try {
      setError('')
      console.log('Starting BNB distribution process...', { isTestMode })
      await contract.distribute()
    } catch (err: any) {
      console.error('Distribution failed:', err)
      setError(err.shortMessage || err.message || 'Distribution failed')
    }
  }

  const hasInsufficientBalance = !isTestMode && parseFloat(bnbBalance) < parseFloat(PAYMENT_AMOUNTS.total)
  const isProcessing = contract.isDistributing || isDistributeConfirming

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          BNB Payment Distribution
        </h2>
        {isTestMode && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <TestTube className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Test Mode</span>
          </div>
        )}
      </div>

      {/* Balance Check */}
      {!isTestMode && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80">Your BNB Balance:</span>
            <span className={`font-medium ${hasInsufficientBalance ? 'text-red-400' : 'text-green-400'}`}>
              {parseFloat(bnbBalance).toFixed(4)} BNB
            </span>
          </div>
          {hasInsufficientBalance && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Insufficient BNB balance for payment (need {PAYMENT_AMOUNTS.total} BNB + gas fees)</span>
            </div>
          )}
        </div>
      )}

      {/* Test Mode Info */}
      {isTestMode && (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <TestTube className="w-5 h-5" />
            <span className="font-medium">Development Testing</span>
          </div>
          <p className="text-blue-300 text-sm">
            This is a simulated BNB transaction flow. No real blockchain interaction will occur.
            Perfect for testing the UI and user experience.
          </p>
        </div>
      )}

      {/* Real Mode Info */}
      {!isTestMode && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-green-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Live BSC Testnet</span>
          </div>
          <p className="text-green-300 text-sm">
            Real blockchain transactions on BSC Testnet. Make sure you have sufficient test BNB for payment and gas fees.
          </p>
        </div>
      )}

      {/* Payment Distribution Preview */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-medium mb-3">BNB Payment Distribution:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Total Payment:</span>
            <span className="text-white font-medium">{PAYMENT_AMOUNTS.total} BNB</span>
          </div>
          <div className="flex justify-between items-center text-blue-400">
            <span>→ {RECIPIENTS.address1.slice(0, 8)}...{RECIPIENTS.address1.slice(-6)}</span>
            <span>{PAYMENT_AMOUNTS.recipient1} BNB</span>
          </div>
          <div className="flex justify-between items-center text-green-400">
            <span>→ {RECIPIENTS.address2.slice(0, 8)}...{RECIPIENTS.address2.slice(-6)}</span>
            <span>{PAYMENT_AMOUNTS.recipient2} BNB</span>
          </div>
        </div>
      </div>

      {/* Single Step Process */}
      <div className="flex items-center justify-center mb-6">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
          isProcessing
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>Send BNB & Distribute</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4">
        <button
          onClick={handleDistribute}
          disabled={isProcessing || (!isTestMode && hasInsufficientBalance)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 
                   disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed 
                   text-white font-medium rounded-xl transition-all duration-200 
                   flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{contract.isDistributing ? 'Processing...' : 'Confirming...'}</span>
            </>
          ) : (
            <>
              <span>{isTestMode ? 'Simulate' : 'Send'} {PAYMENT_AMOUNTS.total} BNB</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Benefits of BNB Payment */}
      <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
        <h4 className="text-green-400 font-medium mb-2">BNB Payment Benefits:</h4>
        <ul className="text-green-300 text-sm space-y-1">
          <li>• No token approval required</li>
          <li>• Single transaction process</li>
          <li>• Lower gas fees</li>
          <li>• Instant distribution</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <div className="text-sm">
              <div className="font-medium">Transaction Error:</div>
              <div className="mt-1 text-red-300">{error}</div>
              <div className="mt-2 text-xs text-red-200">
                {isTestMode ? 'This is a simulated error for testing' : 'Check console for detailed error information'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      {!isTestMode && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg text-xs text-white/60">
          <div>Debug Info:</div>
          <div>BNB Balance: {bnbBalance}</div>
          <div>Required: {PAYMENT_AMOUNTS.total} BNB</div>
          <div>Distribute Hash: {contract.distributeHash || 'None'}</div>
          <div>Is Processing: {isProcessing.toString()}</div>
        </div>
      )}
    </div>
  )
}