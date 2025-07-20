import { useWriteContract, useReadContract, useBalance, useSimulateContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { useState } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI, PAYMENT_AMOUNTS, GAS_SETTINGS } from '../config/contract'

export function useBNBDistributorContract() {
  const { writeContract, data: distributeHash, isPending: isDistributing, error: distributeError } = useWriteContract()
  
  // Simulate the contract call first to check if it will succeed
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'distribute',
    value: parseUnits(PAYMENT_AMOUNTS.total, 18),
    gas: GAS_SETTINGS.gasLimit,
    query: {
      enabled: CONTRACT_ADDRESS !== "0x1234567890123456789012345678901234567890",
    },
  })
  
  const distribute = async () => {
    try {
      const amountWei = parseUnits(PAYMENT_AMOUNTS.total, 18)
      console.log('Executing BNB distribute function:', {
        contractAddress: CONTRACT_ADDRESS,
        amount: PAYMENT_AMOUNTS.total,
        amountWei: amountWei.toString(),
        gasLimit: GAS_SETTINGS.gasLimit.toString()
      })

      // Check if contract address is valid
      if (CONTRACT_ADDRESS === "0x1234567890123456789012345678901234567890") {
        throw new Error('Please deploy the contract and update CONTRACT_ADDRESS in src/config/contract.ts')
      }
      
      return writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'distribute',
        value: amountWei,
        gas: GAS_SETTINGS.gasLimit,
      })
    } catch (error) {
      console.error('Distribution error:', error)
      throw error
    }
  }

  return {
    distribute,
    distributeHash,
    isDistributing,
    distributeError,
    simulateError,
    canExecute: !!simulateData && !simulateError
  }
}

export function useBNBBalance(address: `0x${string}` | undefined) {
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    chainId: 97, // BSC Testnet
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  return {
    balance: balance ? formatUnits(balance.value, 18) : '0',
    symbol: balance?.symbol || 'BNB',
    refetchBalance
  }
}

export function useContractInfo() {
  const { data: contractInfo, error: contractError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getContractInfo',
    query: {
      enabled: !!CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x1234567890123456789012345678901234567890",
    },
  })

  return {
    contractInfo: contractInfo as [string, string, bigint, bigint, bigint] | undefined,
    contractError
  }
}

// Check if contract is deployed and accessible
export function useContractValidation() {
  const { data: totalAmount, error: validationError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'TOTAL_AMOUNT',
    query: {
      enabled: !!CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x1234567890123456789012345678901234567890",
    },
  })

  const isContractValid = !!totalAmount && !validationError
  const isPlaceholderAddress = CONTRACT_ADDRESS === "0x1234567890123456789012345678901234567890"

  return {
    isContractValid,
    isPlaceholderAddress,
    validationError,
    totalAmount: totalAmount ? formatUnits(totalAmount, 18) : null
  }
}

// Mock contract for testing UI without blockchain interaction
export function useMockBNBContract() {
  const [isDistributing, setIsDistributing] = useState(false)
  const [distributeHash, setDistributeHash] = useState<string>()

  const mockDistribute = async () => {
    setIsDistributing(true)
    // Simulate distribution transaction
    setTimeout(() => {
      setDistributeHash('0x' + Math.random().toString(16).substr(2, 64))
      setIsDistributing(false)
    }, 3000)
  }

  return {
    distribute: mockDistribute,
    distributeHash,
    isDistributing,
    canExecute: true
  }
}

// Legacy exports for backward compatibility
export const useUSDTContract = useBNBDistributorContract
export const useDistributorContract = useBNBDistributorContract
export const useUSDTBalance = useBNBBalance
export const useUSDTAllowance = () => ({ allowance: '999999', refetchAllowance: () => {} })
export const useMockContract = useMockBNBContract