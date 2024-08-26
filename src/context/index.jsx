import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useAddress,
  useContract,
  useContractWrite,
  useDisconnect,
  useMetamask,
  useBalance,
  useContractEvents,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const COIN_FLIP_CONTRACT_ADDRESS = import.meta.env.VITE_COIN_FLIP_CONTRACT_ADDRESS;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(COIN_FLIP_CONTRACT_ADDRESS);
  const address = useAddress();
  const { data: balance } = useBalance();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  // User's betting history
  const [userBets, setUserBets] = useState([]);

  // House balance
  const [houseBalance, setHouseBalance] = useState("0");

  // UI effects
  const [shouldShowConfetti, setShouldShowConfetti] = useState(false);
  const [shouldShowNextTime, setShouldShowNextTime] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  // Fetch house balance from the contract
  const fetchHouseBalance = async () => {
    try {
      const balance = await contract.call("getHouseBalance");
      setHouseBalance(ethers.utils.formatEther(balance.toString()));
    } catch (err) {
      console.error("Failed to fetch house balance:", err);
    }
  };

  // Fetch contract owner
  const fetchContractOwner = async () => {
    try {
      const owner = await contract.call("owner");
      return owner;
    } catch (err) {
      console.error("Failed to fetch contract owner:", err);
      return null;
    }
  };

  const { mutateAsync: placeBet } = useContractWrite(contract, "placeBet");

  const handlePlaceBet = async (amount, choice) => {
    try {
      await placeBet({
        args: [choice],
        overrides: { value: ethers.utils.parseEther(amount) },
      });
      fetchHouseBalance();

      useContractEvents(contract, "BetResult", (event) => {
        if (event.data) {
          const { win, amount, payout, timestamp, transactionHash } = event.data;
          const newBet = {
            amount: ethers.utils.formatEther(amount.toString()),
            choice: win ? "Heads" : "Tails",
            win: win ? "Win" : "Lose",
            payout: ethers.utils.formatEther(payout.toString()),
            timestamp: new Date(timestamp * 1000).toLocaleString(),
            transactionLink: `https://sepolia-optimism.etherscan.io/tx/${transactionHash}`, 
          };
          setUserBets((prevBets) => [newBet, ...prevBets]); 

          if (win) {
            setWinAmount(ethers.utils.formatEther(payout.toString()));
            setShouldShowConfetti(true);
          } else {
            setShouldShowNextTime(true);
          }
        }
      });

    } catch (err) {
      setErrorMessage("Failed to place bet. Please try again.");
      setShowErrorPopup(true);
      console.error("Failed to place bet:", err);
    }
  };

  useContractEvents(contract, "BetResult", (event) => {
    if (event.data) {
      const { win, amount, payout, timestamp, transactionHash } = event.data;
      console.log(transactionHash,"transaction")
      const newBet = {
        amount: ethers.utils.formatEther(amount.toString()),
        choice: win ? "Heads" : "Tails",
        win: win ? "Win" : "Lose",
        payout: ethers.utils.formatEther(payout.toString()),
        timestamp: new Date(timestamp * 1000).toLocaleString(),
        transactionLink: `https://sepolia-optimism.etherscan.io/tx/${transactionHash}`, 
      };
      setUserBets((prevBets) => [newBet, ...prevBets]); // Add latest bet at the beginning

      if (win) {
        setWinAmount(ethers.utils.formatEther(payout.toString()));
        setShouldShowConfetti(true);
      } else {
        setShouldShowNextTime(true);
      }
    }
  });



// Function to fetch user bets
const fetchUserBets = async () => {
  if (!contract || !address) {
    console.error("Contract or address not initialized");
    return;
  }

  try {
    const eventName = "BetResult";  

    
    const options = {
      fromBlock: 0,             
      toBlock: "latest",        
      order: "desc",            
      filters: {
        user: address,          
      },
    };

    // Fetch events from the contract
    const events = await contract.events.getEvents(eventName, options);

    // Use Thirdweb RPC for Sepolia testnet
    const provider = new ethers.providers.JsonRpcProvider(`https://11155420.rpc.thirdweb.com/${import.meta.env.VITE_COIN_FLIP_CLIENT_ID}`); // Thirdweb RPC URL for Sepolia

    // Process the events to extract data and timestamps
    const betsPromises = events.map(async (event) => {
      // Fetch the block to get the timestamp using the separate provider
      const block = await provider.getBlock(event.transaction.blockNumber);

      return {
        amount: event.data?.amount ? ethers.utils.formatEther(event.data.amount.toString()) : null,
        choice: event.data?.choice ? "Heads" : "Tails",
        win: event.data?.win || false,
        payout: event.data?.payout ? ethers.utils.formatEther(event.data.payout.toString()) : null,
        timestamp: new Date(block.timestamp * 1000).toLocaleString(),
        transactionLink: `https://sepolia-optimism.etherscan.io/tx/${event.transaction.transactionHash}`, // Add transaction link
      };
    });

    // Wait for all promises to resolve
    const formattedBets = await Promise.all(betsPromises);

    // Reverse the order to show latest bets first
    setUserBets(formattedBets.reverse());

  } catch (error) {
    console.error("Error fetching user bets:", error);
  }
};


  const { mutateAsync: depositFunds } = useContractWrite(contract, "depositFunds");

  const handleDepositFunds = async (amount) => {
    try {
      await depositFunds({
        args: [],
        overrides: { value: ethers.utils.parseEther(amount) },
      });
      fetchHouseBalance();
    } catch (err) {
      setErrorMessage("Failed to deposit funds. Please try again.");
      setShowErrorPopup(true);
      console.error("Error depositing funds:", err);
    }
  };

  const { mutateAsync: withdrawFunds } = useContractWrite(contract, "withdrawFunds");

  const handleWithdrawFunds = async (amount) => {
    try {
      await withdrawFunds({ args: [ethers.utils.parseEther(amount)] });
      fetchHouseBalance();
    } catch (err) {
      setErrorMessage("Failed to withdraw funds. Please try again.");
      setShowErrorPopup(true);
      console.error("Error withdrawing funds:", err);
    }
  };

  // Fetch house balance and user bets on component mount
  useEffect(() => {
    if (contract) {
      fetchHouseBalance();
      fetchUserBets();
    }
  }, [contract]);

  const formattedWalletBalance = balance ? String(balance.displayValue).slice(0, 8) + '...' : "0";

  return (
    <StateContext.Provider
      value={{
        contract,
        address,
        connectWithMetamask,
        disconnect,
        houseBalance,
        placeBet: handlePlaceBet,
        depositFunds: handleDepositFunds,
        withdrawFunds: handleWithdrawFunds,
        fetchUserBets,
        fetchContractOwner,
        userBets,
        balance,
        shouldShowConfetti,
        setShouldShowConfetti,
        shouldShowNextTime,
        setShouldShowNextTime,
        errorMessage,
        showErrorPopup,
        setShowErrorPopup,
        winAmount,
        formattedWalletBalance
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
