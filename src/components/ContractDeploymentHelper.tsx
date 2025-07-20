import React, { useState } from 'react'
import { Copy, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

export function ContractDeploymentHelper() {
  const [contractAddress, setContractAddress] = useState('')
  const [isDeployed, setIsDeployed] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BNBDistributor {
    address public constant RECIPIENT1 = 0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444;
    address public constant RECIPIENT2 = 0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E;
    
    uint256 public constant TOTAL_AMOUNT = 50000000000000000; // 0.05 BNB (18 decimals)
    uint256 public constant AMOUNT1 = 20000000000000000;     // 0.02 BNB (18 decimals)
    uint256 public constant AMOUNT2 = 30000000000000000;     // 0.03 BNB (18 decimals)
    
    event PaymentDistributed(
        address indexed payer,
        uint256 totalAmount,
        uint256 amount1,
        uint256 amount2,
        uint256 timestamp
    );
    
    function distribute() external payable {
        // Check if the sent amount matches the required total
        require(msg.value == TOTAL_AMOUNT, "Incorrect BNB amount sent");
        
        // Transfer to recipients
        (bool success1, ) = payable(RECIPIENT1).call{value: AMOUNT1}("");
        require(success1, "Transfer to recipient 1 failed");
        
        (bool success2, ) = payable(RECIPIENT2).call{value: AMOUNT2}("");
        require(success2, "Transfer to recipient 2 failed");
        
        emit PaymentDistributed(
            msg.sender,
            TOTAL_AMOUNT,
            AMOUNT1,
            AMOUNT2,
            block.timestamp
        );
    }
    
    function getContractInfo() external pure returns (
        address recipient1,
        address recipient2,
        uint256 totalAmount,
        uint256 amount1,
        uint256 amount2
    ) {
        return (RECIPIENT1, RECIPIENT2, TOTAL_AMOUNT, AMOUNT1, AMOUNT2);
    }
    
    // Emergency function to withdraw any stuck BNB (only for testing)
    function emergencyWithdraw() external {
        require(msg.sender == RECIPIENT1 || msg.sender == RECIPIENT2, "Not authorized");
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // Function to check contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}`

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">BNB Smart Contract Deployment</h2>
      
      {!isDeployed ? (
        <div className="space-y-6">
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Contract Not Deployed</span>
            </div>
            <p className="text-yellow-300 text-sm">
              You need to deploy the BNB distributor smart contract to BSC Testnet before using the payment portal.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-medium">Step 1: Deploy BNB Contract</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">BNB Distributor Contract:</span>
                <button
                  onClick={() => copyToClipboard(contractCode)}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">Copy</span>
                </button>
              </div>
              <pre className="text-xs text-white/60 bg-black/20 p-3 rounded overflow-x-auto max-h-40">
                {contractCode}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-white/80 text-sm">Deploy using Remix IDE:</p>
              <ol className="text-white/60 text-sm space-y-1 ml-4">
                <li>1. Go to <a href="https://remix.ethereum.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">remix.ethereum.org</a></li>
                <li>2. Create new file: BNBDistributor.sol</li>
                <li>3. Paste the contract code above</li>
                <li>4. Compile with Solidity 0.8.19</li>
                <li>5. Deploy to BSC Testnet using MetaMask</li>
                <li>6. Copy the deployed contract address</li>
                <li>7. Update CONTRACT_ADDRESS in src/config/contract.ts</li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-medium">Step 2: Update Contract Address</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter deployed contract address (0x...)"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
              <button
                onClick={() => {
                  if (contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
                    setIsDeployed(true)
                    // Here you would update the contract address in your config
                    console.log('Contract address set:', contractAddress)
                  }
                }}
                disabled={!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Set Address
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Contract Deployed Successfully</span>
            </div>
            <p className="text-green-300 text-sm">
              Contract Address: <span className="font-mono">{contractAddress}</span>
            </p>
          </div>

          <div className="flex space-x-4">
            <a
              href={`https://testnet.bscscan.com/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on BSCScan</span>
            </a>
            
            <button
              onClick={() => setIsDeployed(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
            >
              Change Address
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h4 className="text-blue-400 font-medium mb-2">BNB Payment Benefits:</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• No token approval required</li>
          <li>• Single transaction process</li>
          <li>• Direct BNB transfers</li>
          <li>• Lower gas fees</li>
          <li>• Instant distribution</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
        <h4 className="text-green-400 font-medium mb-2">Prerequisites:</h4>
        <ul className="text-green-300 text-sm space-y-1">
          <li>• MetaMask connected to BSC Testnet</li>
          <li>• Test BNB for payment (0.05 BNB + gas fees)</li>
          <li>• Get test BNB from: <a href="https://testnet.binance.org/faucet-smart" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">BSC Faucet</a></li>
        </ul>
      </div>
    </div>
  )
}