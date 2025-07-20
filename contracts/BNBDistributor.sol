// SPDX-License-Identifier: MIT
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
}