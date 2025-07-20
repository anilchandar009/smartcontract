import React, { useState } from 'react'
import { Copy, ExternalLink, AlertCircle, CheckCircle, FileText } from 'lucide-react'
import { CONTRACT_ADDRESS } from '../config/contract'

export function ContractDeploymentHelper() {
  const [newContractAddress, setNewContractAddress] = useState('')
  const [showInstructions, setShowInstructions] = useState(true)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const isPlaceholderAddress = CONTRACT_ADDRESS === "0x1234567890123456789012345678901234567890"

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Smart Contract Setup</h2>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5 text-blue-400" />
        </button>
      </div>
      
      {isPlaceholderAddress ? (
        <div className="space-y-6">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Contract Not Deployed</span>
            </div>
            <p className="text-red-300 text-sm">
              You need to deploy the BNB distributor smart contract to BSC Testnet before using the payment portal.
            </p>
          </div>

          {showInstructions && (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Quick Deployment Guide:</h3>
              
              {/* Step 1: Get Test BNB */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Step 1: Get Test BNB</h4>
                <p className="text-blue-300 text-sm mb-2">
                  You need test BNB for deployment gas fees:
                </p>
                <a
                  href="https://testnet.binance.org/faucet-smart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Get Test BNB</span>
                </a>
              </div>

              {/* Step 2: Deploy Contract */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-medium mb-2">Step 2: Deploy Contract</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 text-sm">Use Remix IDE for easy deployment:</span>
                    <a
                      href="https://remix.ethereum.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Remix</span>
                    </a>
                  </div>
                  
                  <div className="bg-black/20 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-xs">BNBDistributor.sol</span>
                      <button
                        onClick={() => copyToClipboard(contractCode)}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span className="text-xs">Copy</span>
                      </button>
                    </div>
                    <pre className="text-xs text-white/60 overflow-x-auto max-h-32">
                      {contractCode.slice(0, 500)}...
                    </pre>
                  </div>

                  <div className="text-green-300 text-xs space-y-1">
                    <p>• Create new file: BNBDistributor.sol</p>
                    <p>• Paste the contract code</p>
                    <p>• Compile with Solidity 0.8.19</p>
                    <p>• Deploy to BSC Testnet (Chain ID: 97)</p>
                    <p>• Copy the deployed contract address</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Update Configuration */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-400 font-medium mb-2">Step 3: Update Configuration</h4>
                <div className="space-y-2">
                  <p className="text-purple-300 text-sm">
                    After deployment, update the contract address:
                  </p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter deployed contract address (0x...)"
                      value={newContractAddress}
                      onChange={(e) => setNewContractAddress(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 text-sm"
                    />
                    <button
                      onClick={() => {
                        if (newContractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
                          copyToClipboard(`export const CONTRACT_ADDRESS = "${newContractAddress}";`)
                          alert('Configuration copied! Update src/config/contract.ts')
                        }
                      }}
                      disabled={!newContractAddress.match(/^0x[a-fA-F0-9]{40}$/)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                    >
                      Copy Config
                    </button>
                  </div>
                  <p className="text-purple-200 text-xs">
                    Update CONTRACT_ADDRESS in src/config/contract.ts and refresh the page
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Contract Configured</span>
            </div>
            <p className="text-green-300 text-sm mb-2">
              Contract Address: <span className="font-mono text-xs">{CONTRACT_ADDRESS}</span>
            </p>
            <div className="flex space-x-4">
              <a
                href={`https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on BSCScan</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Network Requirements */}
      <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <h4 className="text-yellow-400 font-medium mb-2">Network Requirements:</h4>
        <ul className="text-yellow-300 text-sm space-y-1">
          <li>• BSC Testnet (Chain ID: 97)</li>
          <li>• RPC: https://data-seed-prebsc-1-s1.binance.org:8545</li>
          <li>• Test BNB for gas fees</li>
          <li>• MetaMask or compatible wallet</li>
        </ul>
      </div>

      {/* Payment Details */}
      <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <h4 className="text-blue-400 font-medium mb-2">Payment Distribution:</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• Total: 0.05 BNB per transaction</li>
          <li>• Recipient 1: 0.02 BNB (0xf52f...9444)</li>
          <li>• Recipient 2: 0.03 BNB (0x73D5...894E)</li>
          <li>• Automatic distribution in single transaction</li>
        </ul>
      </div>
    </div>
  )
}