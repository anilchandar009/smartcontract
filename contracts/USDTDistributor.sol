// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract USDTDistributor {
    address public constant USDT = 0x337610d27c682E347C9cD60BD4b3b107C9d34dDd; // BSC Testnet USDT
    address public constant RECIPIENT1 = 0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444;
    address public constant RECIPIENT2 = 0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E;
    
    uint256 public constant TOTAL_AMOUNT = 50000000000000000; // 0.05 USDT (18 decimals)
    uint256 public constant AMOUNT1 = 20000000000000000;     // 0.02 USDT (18 decimals)
    uint256 public constant AMOUNT2 = 30000000000000000;     // 0.03 USDT (18 decimals)
    
    event PaymentDistributed(
        address indexed payer,
        uint256 totalAmount,
        uint256 amount1,
        uint256 amount2,
        uint256 timestamp
    );
    
    function distribute() external {
        IERC20 token = IERC20(USDT);
        
        // Check allowance
        require(
            token.allowance(msg.sender, address(this)) >= TOTAL_AMOUNT,
            "Insufficient allowance"
        );
        
        // Check balance
        require(
            token.balanceOf(msg.sender) >= TOTAL_AMOUNT,
            "Insufficient balance"
        );
        
        // Transfer total amount to contract first
        require(
            token.transferFrom(msg.sender, address(this), TOTAL_AMOUNT),
            "Transfer to contract failed"
        );
        
        // Distribute to recipients
        require(
            token.transfer(RECIPIENT1, AMOUNT1),
            "Transfer to recipient 1 failed"
        );
        
        require(
            token.transfer(RECIPIENT2, AMOUNT2),
            "Transfer to recipient 2 failed"
        );
        
        emit PaymentDistributed(
            msg.sender,
            TOTAL_AMOUNT,
            AMOUNT1,
            AMOUNT2,
            block.timestamp
        );
    }
    
    function getContractInfo() external pure returns (
        address usdtAddress,
        address recipient1,
        address recipient2,
        uint256 totalAmount,
        uint256 amount1,
        uint256 amount2
    ) {
        return (USDT, RECIPIENT1, RECIPIENT2, TOTAL_AMOUNT, AMOUNT1, AMOUNT2);
    }
}