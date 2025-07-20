import React from 'react'
import { CheckCircle, ExternalLink, ArrowRight } from 'lucide-react'
import { PAYMENT_AMOUNTS, RECIPIENTS } from '../config/contract'

interface SuccessPageProps {
  txHash: string
  onReset: () => void
}

export function SuccessPage({ txHash, onReset }: SuccessPageProps) {
  const explorerUrl = `https://testnet.bscscan.com/tx/${txHash}`

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-500/20 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-white/80">Your BNB payment has been distributed successfully</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4 text-center">Payment Summary</h3>
        
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {PAYMENT_AMOUNTS.total} BNB
            </div>
            <div className="text-white/60 text-sm">Total Paid</div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-white/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400 mb-1">
                  {PAYMENT_AMOUNTS.recipient1} BNB
                </div>
                <div className="text-white/60 text-xs font-mono break-all">
                  {RECIPIENTS.address1}
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400 mb-1">
                  {PAYMENT_AMOUNTS.recipient2} BNB
                </div>
                <div className="text-white/60 text-xs font-mono break-all">
                  {RECIPIENTS.address2}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-3">Transaction Details</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Transaction Hash:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono text-sm">
                {txHash.slice(0, 8)}...{txHash.slice(-8)}
              </span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Network:</span>
            <span className="text-white">BSC Testnet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Currency:</span>
            <span className="text-yellow-400">BNB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Status:</span>
            <span className="text-green-400 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Confirmed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                   rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ExternalLink className="w-5 h-5" />
          <span>View on BSCScan</span>
        </a>
        
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 
                   text-white font-medium rounded-xl transition-all duration-200"
        >
          Make Another Payment
        </button>
      </div>
    </div>
  )
}