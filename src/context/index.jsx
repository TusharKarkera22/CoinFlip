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

  // user's betting history
  const [userBets, setUserBets] = useState([]);

  // To store house balance
  const [houseBalance, setHouseBalance] = useState("0");

  // To manage UI effects
  const [shouldShowConfetti, setShouldShowConfetti] = useState(false);
  const [shouldShowNextTime, setShouldShowNextTime] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  //To Fetch house balance from the contract
  const fetchHouseBalance = async () => {
    try {
      const balance = await contract.call("getHouseBalance");
      setHouseBalance(ethers.utils.formatEther(balance.toString()));
    } catch (err) {
      console.error("Failed to fetch house balance:", err);
    }
  };
  console.log("contract",contract,COIN_FLIP_CONTRACT_ADDRESS)
  console.log(import.meta.env.VITE_COIN_FLIP_CONTRACT_ADDRESS)

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
          const { win, amount, payout, timestamp } = event.data;
          console.log(event.data)
          const newBet = {
            amount: ethers.utils.formatEther(amount.toString()),
            choice: win ? "Win" : "Lose",
            win: win ? "Win" : "Lose",
            payout: ethers.utils.formatEther(payout.toString()),
            timestamp: new Date(timestamp * 1000).toLocaleString(),
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
      const { win, amount, payout, timestamp } = event.data;
      console.log(event.data)
      const newBet = {
        amount: ethers.utils.formatEther(amount.toString()),
        choice: win ? "Win" : "Lose",
        win: win ? "Win" : "Lose",
        payout: ethers.utils.formatEther(payout.toString()),
        timestamp: new Date(timestamp * 1000).toLocaleString(),
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


  const fetchUserBets = async () => {
    if (!contract || !address) {
      console.error("Contract or address not initialized");
      return;
    }
  
    try {
      const bets = await contract.call("getUserBets", [address]); // Note the array around address
      const formattedBets = bets.map((bet) => ({
        amount: ethers.utils.formatEther(bet.amount.toString()),
        choice: bet.choice ? "Heads" : "Tails",
        win: bet.win ,
        payout: ethers.utils.formatEther(bet.payout.toString()),
        timestamp: new Date(bet.timestamp * 1000).toLocaleString(),
      }));
      setUserBets(formattedBets);
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
  const formattedWalletBalance = balance ?  String(balance.displayValue).slice(0, 8) + '...':"0";
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
