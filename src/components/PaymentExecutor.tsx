import React, { useState } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { ArrowRight, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import { useTestUSDTContract, useTestDistributorContract, useUSDTBalance, useUSDTAllowance } from '../hooks/useContract'
import { PAYMENT_AMOUNTS, RECIPIENTS } from '../config/contract'

interface PaymentExecutorProps {
  onSuccess: (txHash: string) => void
}

export function PaymentExecutor({ onSuccess }: PaymentExecutorProps) {
  const { address } = useAccount()
  const [currentStep, setCurrentStep] = useState<'approve' | 'distribute'>('approve')
  const [error, setError] = useState<string>('')

  const usdtBalance = useUSDTBalance(address)
  const allowance = useUSDTAllowance(address)
  const { approveUSDT, approveHash, isApproving, approveError } = useTestUSDTContract()
  const { distribute, distributeHash, isDistributing, distributeError } = useTestDistributorContract()

  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: {
      enabled: !!approveHash,
    },
  })

  const { isLoading: isDistributeConfirming } = useWaitForTransactionReceipt({
    hash: distributeHash,
    query: {
      enabled: !!distributeHash,
    },
  })

  React.useEffect(() => {
    if (approveHash && !isApproveConfirming) {
      setCurrentStep('distribute')
    }
  }, [approveHash, isApproveConfirming])

  React.useEffect(() => {
    if (distributeHash && !isDistributeConfirming) {
      onSuccess(distributeHash)
    }
  }, [distributeHash, isDistributeConfirming, onSuccess])

  const handleApprove = async () => {
    try {
      setError('')
      console.log('Starting approval process...')
      await approveUSDT(PAYMENT_AMOUNTS.total)
    } catch (err: any) {
      console.error('Approval failed:', err)
      setError(err.shortMessage || err.message || 'Approval failed')
    }
  }

  const handleDistribute = async () => {
    try {
      setError('')
      console.log('Starting distribution process...')
      await distribute()
    } catch (err: any) {
      console.error('Distribution failed:', err)
      setError(err.shortMessage || err.message || 'Distribution failed')
    }
  }

  const hasInsufficientBalance = parseFloat(usdtBalance) < parseFloat(PAYMENT_AMOUNTS.total)
  const hasInsufficientAllowance = parseFloat(allowance) < parseFloat(PAYMENT_AMOUNTS.total)
  const canProceedToDistribute = currentStep === 'distribute' && !hasInsufficientAllowance

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Smart Contract Execution
      </h2>

      {/* Balance Check */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80">Your USDT Balance:</span>
          <span className={`font-medium ${hasInsufficientBalance ? 'text-red-400' : 'text-green-400'}`}>
            {parseFloat(usdtBalance).toFixed(4)} USDT
          </span>
        </div>
        {hasInsufficientBalance && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Insufficient USDT balance for payment</span>
          </div>
        )}
      </div>

      {/* Payment Distribution Preview */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-medium mb-3">Payment Distribution:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Total Payment:</span>
            <span className="text-white font-medium">{PAYMENT_AMOUNTS.total} USDT</span>
          </div>
          <div className="flex justify-between items-center text-blue-400">
            <span>→ {RECIPIENTS.address1.slice(0, 8)}...{RECIPIENTS.address1.slice(-6)}</span>
            <span>{PAYMENT_AMOUNTS.recipient1} USDT</span>
          </div>
          <div className="flex justify-between items-center text-green-400">
            <span>→ {RECIPIENTS.address2.slice(0, 8)}...{RECIPIENTS.address2.slice(-6)}</span>
            <span>{PAYMENT_AMOUNTS.recipient2} USDT</span>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          currentStep === 'approve' 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {currentStep === 'approve' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>1. Approve USDT</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-white/40" />
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          canProceedToDistribute
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'bg-white/10 text-white/40 border border-white/20'
        }`}>
          {canProceedToDistribute && isDistributing && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          <span>2. Execute Payment</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {currentStep === 'approve' && (
          <button
            onClick={handleApprove}
            disabled={isApproving || isApproveConfirming || hasInsufficientBalance}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                     disabled:cursor-not-allowed text-white font-medium rounded-xl 
                     transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isApproving || isApproveConfirming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isApproving ? 'Approving...' : 'Confirming...'}</span>
              </>
            ) : (
              <span>Approve {PAYMENT_AMOUNTS.total} USDT</span>
            )}
          </button>
        )}

        {canProceedToDistribute && (
          <button
            onClick={handleDistribute}
            disabled={isDistributing || isDistributeConfirming}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                     disabled:cursor-not-allowed text-white font-medium rounded-xl 
                     transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isDistributing || isDistributeConfirming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isDistributing ? 'Executing...' : 'Confirming...'}</span>
              </>
            ) : (
              <span>Execute Payment Distribution</span>
            )}
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <div className="text-sm">
              <div className="font-medium">Transaction Error:</div>
              <div className="mt-1 text-red-300">{error}</div>
              {(approveError || distributeError) && (
                <div className="mt-2 text-xs text-red-200">
                  Check console for detailed error information
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      <div className="mt-4 p-4 bg-white/5 rounded-lg text-xs text-white/60">
        <div>Debug Info:</div>
        <div>USDT Balance: {usdtBalance}</div>
        <div>Allowance: {allowance}</div>
        <div>Current Step: {currentStep}</div>
        <div>Approve Hash: {approveHash || 'None'}</div>
        <div>Distribute Hash: {distributeHash || 'None'}</div>
      </div>
    </div>
  )
}