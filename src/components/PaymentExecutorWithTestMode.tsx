import React, { useState } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { ArrowRight, CheckCircle, Loader2, AlertTriangle, TestTube, ExternalLink } from 'lucide-react'
import { 
  useBNBDistributorContract,
  useMockBNBContract,
  useBNBBalance,
  useContractValidation
} from '../hooks/useContract'
import { PAYMENT_AMOUNTS, RECIPIENTS, CONTRACT_ADDRESS } from '../config/contract'

interface PaymentExecutorWithTestModeProps {
  onSuccess: (txHash: string) => void
  isTestMode?: boolean
}

export function PaymentExecutorWithTestMode({ onSuccess, isTestMode = false }: PaymentExecutorWithTestModeProps) {
  const { address } = useAccount()
  const [error, setError] = useState<string>('')

  const { balance: bnbBalance, refetchBalance } = useBNBBalance(address)
  const { isContractValid, isPlaceholderAddress, validationError } = useContractValidation()
  
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

  const hasInsufficientBalance = !isTestMode && parseFloat(bnbBalance) < (parseFloat(PAYMENT_AMOUNTS.total) + 0.001) // Add buffer for gas
  const isProcessing = contract.isDistributing || isDistributeConfirming
  const canExecute = isTestMode || (contract.canExecute && isContractValid && !isPlaceholderAddress)

  // Show contract deployment warning if needed
  if (!isTestMode && isPlaceholderAddress) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-red-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-medium text-lg">Contract Not Deployed</span>
            </div>
            <p className="text-red-300 text-sm mb-4">
              You need to deploy the BNB distributor smart contract first and update the CONTRACT_ADDRESS in the configuration.
            </p>
            <div className="space-y-2 text-left">
              <p className="text-red-200 text-xs">Steps to deploy:</p>
              <ol className="text-red-200 text-xs space-y-1 ml-4">
                <li>1. Deploy contracts/BNBDistributor.sol to BSC Testnet</li>
                <li>2. Update CONTRACT_ADDRESS in src/config/contract.ts</li>
                <li>3. Refresh the application</li>
              </ol>
            </div>
          </div>
          <a
            href="https://remix.ethereum.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Deploy with Remix IDE</span>
          </a>
        </div>
      </div>
    )
  }

  // Show contract validation error
  if (!isTestMode && !isContractValid && !isPlaceholderAddress) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="text-center space-y-4">
          <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-medium text-lg">Contract Validation Failed</span>
            </div>
            <p className="text-yellow-300 text-sm mb-2">
              Cannot connect to the smart contract. Please check:
            </p>
            <ul className="text-yellow-200 text-xs space-y-1 text-left">
              <li>• Contract is deployed to BSC Testnet</li>
              <li>• Contract address is correct</li>
              <li>• You're connected to BSC Testnet</li>
              <li>• Contract is verified and accessible</li>
            </ul>
            {validationError && (
              <div className="mt-3 p-2 bg-red-500/20 rounded text-red-300 text-xs">
                Error: {validationError.message}
              </div>
            )}
          </div>
          <div className="text-white/60 text-sm">
            Contract Address: <span className="font-mono">{CONTRACT_ADDRESS}</span>
          </div>
        </div>
      </div>
    )
  }

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
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">Required (+ gas):</span>
            <span className="text-white/80 text-sm">~{(parseFloat(PAYMENT_AMOUNTS.total) + 0.001).toFixed(3)} BNB</span>
          </div>
          {hasInsufficientBalance && (
            <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Insufficient BNB balance for payment + gas fees</span>
            </div>
          )}
        </div>
      )}

      {/* Contract Status */}
      {!isTestMode && isContractValid && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-green-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Contract Ready</span>
          </div>
          <p className="text-green-300 text-sm">
            Smart contract validated and ready for BNB distribution on BSC Testnet.
          </p>
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
            : canExecute
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : canExecute ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>Send BNB & Distribute</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4">
        <button
          onClick={handleDistribute}
          disabled={isProcessing || (!isTestMode && (hasInsufficientBalance || !canExecute))}
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
          <div>Contract Valid: {isContractValid.toString()}</div>
          <div>Can Execute: {canExecute.toString()}</div>
          <div>Distribute Hash: {contract.distributeHash || 'None'}</div>
          <div>Is Processing: {isProcessing.toString()}</div>
        </div>
      )}
    </div>
  )
}