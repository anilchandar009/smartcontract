import { createConfig, http } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

const projectId = 'your-walletconnect-project-id' // Replace with your WalletConnect project ID

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Smart Contract Payment Portal',
        description: 'BSC Testnet USDT Payment Distribution',
        url: 'https://your-app.com',
        icons: ['https://your-app.com/icon.png']
      }
    }),
  ],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
})