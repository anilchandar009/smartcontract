import { useWriteContract, useReadContract, useBalance } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { useState } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI, PAYMENT_AMOUNTS } from '../config/contract'

export function useBNBDistributorContract() {
  const { writeContract, data: distributeHash, isPending: isDistributing, error: distributeError } = useWriteContract()
  
  const distribute = async () => {
    try {
      const amountWei = parseUnits(PAYMENT_AMOUNTS.total, 18)
      console.log('Executing BNB distribute function:', {
        contractAddress: CONTRACT_ADDRESS,
        amount: PAYMENT_AMOUNTS.total,
        amountWei: amountWei.toString()
      })
      
      return writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'distribute',
        value: amountWei,
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
    distributeError
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
  const { data: contractInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getContractInfo',
    query: {
      enabled: !!CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x1234567890123456789012345678901234567890",
    },
  })

  return {
    contractInfo: contractInfo as [string, string, bigint, bigint, bigint] | undefined
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
    isDistributing
  }
}

// Legacy exports for backward compatibility
export const useUSDTContract = useBNBDistributorContract
export const useDistributorContract = useBNBDistributorContract
export const useUSDTBalance = useBNBBalance
export const useUSDTAllowance = () => ({ allowance: '999999', refetchAllowance: () => {} })
export const useMockContract = useMockBNBContract