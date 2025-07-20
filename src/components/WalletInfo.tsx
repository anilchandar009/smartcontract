import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ExternalLink, LogOut } from 'lucide-react'
import { useBNBBalance } from '../hooks/useContract'

export function WalletInfo() {
  const { address, connector } = useAccount()
  const { balance, symbol } = useBNBBalance(address)
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getWalletIcon = (connectorName?: string) => {
    switch (connectorName?.toLowerCase()) {
      case 'metamask':
        return '🦊'
      case 'walletconnect':
        return '🔗'
      default:
        return '👛'
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Connected Wallet</h2>
        <button
          onClick={() => disconnect()}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          title="Disconnect Wallet"
        >
          <LogOut className="w-5 h-5 text-red-400" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">
            {getWalletIcon(connector?.name)}
          </div>
          <div>
            <div className="text-white font-medium">{connector?.name}</div>
            <div className="text-white/60 text-sm">Connected to BSC Testnet</div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Address:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono">{formatAddress(address!)}</span>
              <a
                href={`https://testnet.bscscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/80">{symbol} Balance:</span>
            <span className="text-white font-medium">
              {parseFloat(balance).toFixed(4)} {symbol}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/80">Network:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">BSC Testnet (Live)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}