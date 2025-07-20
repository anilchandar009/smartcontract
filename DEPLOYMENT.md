# Smart Contract Payment Portal - Deployment Guide

## Prerequisites

1. **MetaMask Browser Extension**
   - Install MetaMask from https://metamask.io/
   - Add BSC Testnet network with these settings:
     - Network Name: BSC Testnet
     - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
     - Chain ID: 97
     - Currency Symbol: tBNB
     - Block Explorer: https://testnet.bscscan.com

2. **Test BNB & USDT**
   - Get test BNB from BSC Testnet faucet: https://testnet.binance.org/faucet-smart
   - Get test USDT from: https://testnet.bscscan.com/token/0x337610d27c682e347c9cd60bd4b3b107c9d34ddd

## Smart Contract Deployment

1. **Using Remix IDE (Recommended)**
   - Go to https://remix.ethereum.org/
   - Create a new file `USDTDistributor.sol`
   - Copy the contract code from `contracts/USDTDistributor.sol`
   - Compile with Solidity 0.8.19
   - Deploy to BSC Testnet using MetaMask
   - Copy the deployed contract address

2. **Using Hardhat (Advanced)**
   ```bash
   npx hardhat init
   # Copy contract to contracts/ folder
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network bscTestnet
   ```

## Frontend Configuration

1. **Update Contract Address**
   - Open `src/config/contract.ts`
   - Replace `CONTRACT_ADDRESS` with your deployed contract address

2. **WalletConnect Project ID (Optional)**
   - Visit https://cloud.walletconnect.com/
   - Create a new project
   - Copy the project ID
   - Update `projectId` in `src/config/wagmi.ts`

## Testing the Application

1. **Connect MetaMask**
   - Ensure you're on BSC Testnet
   - Have some test BNB for gas fees
   - Have at least 0.05 USDT for testing

2. **Test Payment Flow**
   - Connect your wallet
   - Approve USDT spending
   - Execute the payment distribution
   - Verify transactions on BSCScan

## Smart Contract Verification (Optional)

1. **Verify on BSCScan**
   - Go to https://testnet.bscscan.com/
   - Search for your contract address
   - Click "Verify and Publish"
   - Upload the contract source code

## Production Deployment

1. **Deploy to Vercel/Netlify**
   ```bash
   npm run build
   # Deploy the dist/ folder
   ```

2. **Environment Variables**
   - No environment variables needed for frontend
   - All configuration is in the config files

## Troubleshooting

- **"Insufficient funds"**: Ensure you have enough test BNB for gas
- **"Approval failed"**: Check USDT balance and try again
- **"Transaction failed"**: Verify contract address and network
- **Wallet not connecting**: Refresh page and try again

## Security Notes

- This is for BSC Testnet only
- Never use real funds on testnet contracts
- Always verify contract addresses before transactions
- Keep private keys secure