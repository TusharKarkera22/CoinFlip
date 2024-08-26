// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;
    uint256 public minimumBet;
    uint256 public houseBalance;

    struct Bet {
        uint256 amount;
        bool choice;
        bool win;
        uint256 payout;
        uint256 timestamp; 
    }

    mapping(address => Bet[]) public userBets;

    event BetPlaced(address indexed user, uint256 amount, bool choice, uint256 timestamp);
    event BetResult(address indexed user, bool win, uint256 amount, uint256 payout, uint256 timestamp);
    event FundsDeposited(uint256 amount);
    event FundsWithdrawn(uint256 amount);

    constructor() {
        owner = msg.sender;
        minimumBet = 0.0001 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    receive() external payable {
        houseBalance += msg.value;
        emit FundsDeposited(msg.value);
    }

    function depositFunds() external payable onlyOwner {
        houseBalance += msg.value;
        emit FundsDeposited(msg.value);
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount <= houseBalance, "Insufficient funds");
        houseBalance -= amount;
        payable(owner).transfer(amount);
        emit FundsWithdrawn(amount);
    }

    function placeBet(bool _choice) external payable {
        require(msg.value >= minimumBet, "Bet is below minimum");
        require(msg.value * 2 <= houseBalance, "Insufficient house balance");

        houseBalance += msg.value;
        bool win = (pseudoRandom() % 2 == 0) == _choice;
        uint256 payout = 0;
        uint256 timestamp = block.timestamp; 

        if (win) {
            payout = msg.value * 2;
            require(payout <= houseBalance, "Insufficient house balance for payout");
            houseBalance -= payout;
            payable(msg.sender).transfer(payout);
        }

        userBets[msg.sender].push(Bet({
            amount: msg.value,
            choice: _choice,
            win: win,
            payout: payout,
            timestamp: timestamp 
        }));

        emit BetPlaced(msg.sender, msg.value, _choice, timestamp);
        emit BetResult(msg.sender, win, msg.value, payout, timestamp);
    }

    function pseudoRandom() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, address(this))));
    }

    function adjustHouseBalance() external onlyOwner {
        houseBalance = address(this).balance;
    }

    function getHouseBalance() public view returns (uint256) {
        return houseBalance;
    }

    function getUserBets(address user) public view returns (Bet[] memory) {
        return userBets[user];
    }
}
