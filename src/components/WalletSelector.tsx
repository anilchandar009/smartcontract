import React from 'react'
import { useConnect } from 'wagmi'
import { Wallet, Loader2 } from 'lucide-react'

interface WalletSelectorProps {
  onConnected: () => void
}

export function WalletSelector({ onConnected }: WalletSelectorProps) {
  const { connectors, connect, isPending } = useConnect({
    mutation: {
      onSuccess: () => {
        onConnected()
      }
    }
  })

  const getWalletIcon = (connectorName: string) => {
    switch (connectorName.toLowerCase()) {
      case 'metamask':
        return '🦊'
      case 'walletconnect':
        return '🔗'
      default:
        return <Wallet className="w-6 h-6" />
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Connect Your Wallet
      </h2>
      <div className="space-y-4">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 
                     border border-white/20 rounded-xl transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getWalletIcon(connector.name)}
              </div>
              <span className="text-white font-medium">{connector.name}</span>
            </div>
            {isPending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <div className="text-white/60 group-hover:text-white transition-colors">
                Connect
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-white/60 text-sm text-center mt-6">
        Make sure you're connected to BSC Testnet
      </p>
    </div>
  )
}