# Smart Contract Payment Portal

A React-based application that integrates with a BNB BEP-20 smart contract on BSC Testnet for automated USDT payment distribution.

## Features

- **Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and other Web3 wallets
- **BSC Testnet Integration**: Full support for Binance Smart Chain Testnet
- **Smart Contract Automation**: Automatically distributes USDT payments to multiple recipients
- **Real-time Balance Tracking**: Monitor USDT balance and transaction status
- **Responsive Design**: Beautiful, mobile-friendly interface with smooth animations
- **Transaction Transparency**: Direct links to BSCScan for transaction verification

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Web3**: Wagmi + Ethers.js + Viem
- **Blockchain**: BSC Testnet
- **Smart Contract**: Solidity 0.8.19

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Deploy Smart Contract**
   - Use Remix IDE or Hardhat to deploy `contracts/USDTDistributor.sol`
   - Update `CONTRACT_ADDRESS` in `src/config/contract.ts`

4. **Configure MetaMask**
   - Add BSC Testnet network
   - Get test BNB and USDT from faucets

## Smart Contract Details

**Contract Address**: `0x1234567890123456789012345678901234567890` (Update after deployment)

**Functions**:
- `distribute()`: Distributes 0.05 USDT to two recipients (0.02 + 0.03)
- `getContractInfo()`: Returns contract configuration details

**Recipients**:
- Address 1: `0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444` → 0.02 USDT
- Address 2: `0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E` → 0.03 USDT

## Payment Flow

1. **Connect Wallet**: Choose from available Web3 wallets
2. **Wallet Verification**: Check BNB balance and network connection
3. **USDT Approval**: Approve 0.05 USDT spending to the smart contract
4. **Payment Execution**: Execute the `distribute()` function
5. **Success Confirmation**: View transaction details and BSCScan link

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── WalletSelector.tsx
│   ├── WalletInfo.tsx
│   ├── PaymentExecutor.tsx
│   └── SuccessPage.tsx
├── config/             # Configuration files
│   ├── contract.ts     # Smart contract addresses and ABIs
│   └── wagmi.ts        # Wagmi configuration
├── hooks/              # Custom React hooks
│   └── useContract.ts  # Smart contract interaction hooks
└── App.tsx             # Main application component
```

### Key Technologies
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons

## Configuration

### Smart Contract Configuration (`src/config/contract.ts`)
- Contract addresses for both the distributor and USDT
- Contract ABIs for interaction
- BSC Testnet configuration
- Payment amounts and recipient addresses

### Wallet Configuration (`src/config/wagmi.ts`)
- Supported wallet connectors
- BSC Testnet RPC configuration
- WalletConnect project settings

## Security

- **Row Level Security**: Smart contract validates all inputs
- **Balance Verification**: Checks sufficient USDT balance before execution
- **Allowance Management**: Secure approval mechanism
- **Network Validation**: Ensures BSC Testnet connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on BSC Testnet
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Check the troubleshooting section in DEPLOYMENT.md
- Review BSCScan for transaction details
- Ensure proper BSC Testnet configuration