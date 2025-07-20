import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { useState } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI, USDT_ADDRESS, USDT_ABI } from '../config/contract'

export function useUSDTContract() {
  const { writeContract: writeUSDT, data: approveHash, isPending: isApproving, error: approveError } = useWriteContract()
  
  const approveUSDT = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 18)
      console.log('Approving USDT:', {
        amount,
        amountWei: amountWei.toString(),
        usdtAddress: USDT_ADDRESS,
        contractAddress: CONTRACT_ADDRESS
      })
      
      return writeUSDT({
        address: USDT_ADDRESS as `0x${string}`,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amountWei],
      })
    } catch (error) {
      console.error('Approval error:', error)
      throw error
    }
  }

  return {
    approveUSDT,
    approveHash,
    isApproving,
    approveError
  }
}

export function useDistributorContract() {
  const { writeContract: writeContract, data: distributeHash, isPending: isDistributing, error: distributeError } = useWriteContract()
  
  const distribute = async () => {
    try {
      console.log('Executing distribute function on contract:', CONTRACT_ADDRESS)
      return writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'distribute',
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

export function useUSDTBalance(address: `0x${string}` | undefined) {
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USDT_ADDRESS as `0x${string}`,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  return {
    balance: balance ? formatUnits(balance as bigint, 18) : '0',
    refetchBalance
  }
}

export function useUSDTAllowance(owner: `0x${string}` | undefined) {
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDT_ADDRESS as `0x${string}`,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: owner ? [owner, CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!owner,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  return {
    allowance: allowance ? formatUnits(allowance as bigint, 18) : '0',
    refetchAllowance
  }
}

// Mock contract for testing UI without blockchain interaction
export function useMockContract() {
  const [isApproving, setIsApproving] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [approveHash, setApproveHash] = useState<string>()
  const [distributeHash, setDistributeHash] = useState<string>()

  const mockApprove = async () => {
    setIsApproving(true)
    // Simulate approval transaction
    setTimeout(() => {
      setApproveHash('0x' + Math.random().toString(16).substr(2, 64))
      setIsApproving(false)
    }, 3000)
  }

  const mockDistribute = async () => {
    setIsDistributing(true)
    // Simulate distribution transaction
    setTimeout(() => {
      setDistributeHash('0x' + Math.random().toString(16).substr(2, 64))
      setIsDistributing(false)
    }, 3000)
  }

  return {
    approveUSDT: mockApprove,
    distribute: mockDistribute,
    approveHash,
    distributeHash,
    isApproving,
    isDistributing
  }
}