import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/index";
import "../components/Coin/Coin.css";

import Button from "../components/Button";
import { ethers } from "ethers";

import { Store } from "react-notifications-component";

import { Gift } from "lucide-react";
import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import "../components/Goldtext.css";

const CoinFlip = () => {
  const {
    address,
    connectWithMetamask,
    disconnect,
    houseBalance,
    placeBet,
    userBets,
    balance,
    shouldShowConfetti,
    setShouldShowConfetti,
    shouldShowNextTime,
    setShouldShowNextTime,
    formattedWalletBalance,
    fetchUserBets,
  } = useStateContext();

  const [betAmount, setBetAmount] = useState("0.0001");
  const [loading, setLoading] = useState(false);
  const [flipResult, setFlipResult] = useState("");
  const [flipEvent, setFlipEvent] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  const [showCoin, setShowCoin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [state, setState] = useState("heads");

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {shouldShowConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-[50%] sm:top-[60%] left-1/2 rounded-xl items-center flex flex-col justify-center bg-[url(/public/win.gif)] z-10 w-[250px] h-[400px] sm:h-[500px] sm:w-[500px] bg-black border border-white">
            <p className="text-white font-lufga font-bold text-[32px]">
              WOHOOOO!!!
            </p>
            <p className="text-white font-lufga font-bold text-[24px]">
              You won {flipResult} ETH
            </p>
            <div onClick={() => setShouldShowConfetti(false)}>
              <Button text="close"></Button>
            </div>
          </div>
        </div>
      )}

      {shouldShowNextTime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-[50%] sm:top-[60%] left-1/2 rounded-xl items-center flex flex-col justify-center z-10 w-[250px] h-[400px] sm:h-[500px] sm:w-[500px] bg-black border border-white">
            <p className="text-white font-lufga font-bold text-[32px]">
              Better Luck Next Time
            </p>
            <img src={"/lost.gif"} />
            <div onClick={() => setShouldShowNextTime(false)}>
              <Button text="close"></Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex-col pt-8 pl-5 pr-5  sm:pl-10 sm:pr-10 justify-between">
        <div className="flex justify-between font-gilroy pb-8 font-medium relative p-2 items-center">
          <div
            className="absolute top-0 right-0 -z-10 -mt-9 mr-9 h-[250px] w-[350px] rounded-full overflow-hidden"
            style={{ filter: "blur(120px)" }}
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(5, 1, 45, 1), #314dad, rgba(5, 1, 45, 1))",
                opacity: "0.7",
              }}
            ></div>
          </div>
          <button className="pt-4 pb-4 pl-6 pr-6 text-[20px] hidden sm:flex border border-gray-600 text-white rounded-[50px] gap-2  flex-row justify-center items-center">
            <Gift className="text-[#FFDB93]" />
            Rewards
          </button>
          <span className="gold-text__highlight" data-text="CoinFlip">
                CoinFlip
              </span>
          <div className="sm:flex hidden flex-row gap-2">
            <button className="p-2 pl-4 text-20px border border-gray-600 text-white rounded-[50px] gap-2 flex flex-row justify-center items-center">
              <img src="/op.png" width={22} height={22} />
              {formattedWalletBalance}
              <button
                className="flex flex-row justify-center pl-6 pr-6 pt-2 pb-2 items-center rounded-[50px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FEF2D0, #C18F5B)",
                  color: "black",
                }}
              >
                Balance
              </button>
            </button>
          </div>
          <button>
            <ConnectWallet
              switchToActiveChain={true}
              hideTestnetFaucet={false}
              btnTitle="Login"
            />
          </button>
        </div>

        <div className="border hidden  rounded-[50px] mt-4 sm:flex flex-col pt-20 pb-20 pl-20 pr-20 justify-center items-center border-[#FEF2D0]">
          <div className="flex flex-row h-[600px] rounded-[20px] w-full gap-8 justify-between bg-[#141135]">
            <div className="flex flex-col justify-start rounded-l-[20px] items-center gap-4 bg-[#211c55] pt-10 pl-4 pr-4">
              <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                House Balance
              </p>
              <span className="gold-text__highlight" data-text={houseBalance}>
                {houseBalance}
              </span>
              <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                Enter the Bet Amount
              </p>

              <input
                className="bg-[#141135] p-4 rounded-xl sm:w-[400px] sm:h-[70px] w-full h-[50px] text-white font-lufga font-bold text-[24px]"
                type="text"
                placeholder="Bet Amount in ETH"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={loading}
              />
              <p className="text-white font-gilroy font-regular sm:text-[16px] text-[12px]">
                Maintain the bet between the House Balance
              </p>
              <p className="text-white font-gilroy font-regular sm:text-[16px] text-[12px]">
                Minimum bet 0.0001 ETH
              </p>
              <div className="flex flex-row justify-center items-center gap-2 p-2">
                <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                  Heads = Ethereum
                </p>
                <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                  Tails = Bitcoin
                </p>
              </div>
              <Web3Button
                className="flex flex-row justify-center pl-6 pr-6 pt-2 pb-2 w-full mb-4 font-gilroy font-medium text-[20px] items-center rounded-[20px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FEF2D0, #C18F5B)",
                  color: "black",
                }}
                contractAddress={
                  import.meta.env.VITE_COIN_FLIP_CONTRACT_ADDRESS
                }
                action={async (contract) => {
                  setShowCoin(true);
                  setIsFlipping(true);
                  const args = true;

                  const tx = await contract.call("placeBet", [args], {
                    value: ethers.utils.parseEther(betAmount),
                  });
                  console.log(tx);
                  // Return the transaction to use it in onSuccess
                  return tx;
                }}
                onSuccess={async (tx) => {
                  try {
                    // Wait for the transaction to be confirmed
                    const receipt = await tx.receipt;

                    // Loop through the events in the receipt
                    const BetEvent = receipt.events?.find(
                      (e) => e.event === "BetResult"
                    );

                    if (BetEvent) {
                      const payout = BetEvent.args.payout.toString();
                      const win = BetEvent.args.win;

                      const formattedReward = ethers.utils.formatEther(payout);

                      setIsFlipping(false);
                      if (win) {
                        setState("heads");
                        setShouldShowConfetti(true);
                        setFlipEvent("Heads");
                      } else {
                        setShouldShowNextTime(true);
                        setFlipEvent("Tails");
                      }
                      setIsFlipping(false);
                      setFlipResult(formattedReward);
                      console.log(flipResult);

                      setShowCoin(false);
                      await fetchUserBets();
                    } else {
                      console.error(
                        "Betresult event not found in the transaction receipt."
                      );
                    }
                  } catch (error) {
                    console.error("Error processing the  event:", error);
                  }
                }}
                onError={(error) => {
                  setIsFlipping(false);
                  setErrorMessage(
                    "There was an error processing your transaction. Please try again."
                  );
                  Store.addNotification({
                    title: "Error",
                    message:
                      "There was an error processing your transaction. Please try again.",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                    },
                    slidingExit: {
                      duration: 800,
                      timingFunction: "ease-out",
                      delay: 0,
                    },
                    width: 500,
                  });
                  setIsSpinning(false);
                  console.error("Error spinning the wheel:", error);
                }}
              >
                Bet Heads
              </Web3Button>
              <Web3Button
                className="flex flex-row justify-center pl-6 pr-6 pt-2 pb-2 w-full mb-4 font-gilroy font-medium text-[20px] items-center rounded-[20px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FEF2D0, #C18F5B)",
                  color: "black",
                }}
                contractAddress={
                  import.meta.env.VITE_COIN_FLIP_CONTRACT_ADDRESS
                }
                action={async (contract) => {
                  setShowCoin(true);
                  setIsFlipping(true);
                  const args = false;

                  const tx = await contract.call("placeBet", [args], {
                    value: ethers.utils.parseEther(betAmount),
                  });
                  console.log(tx);
                  // Return the transaction to use it in onSuccess
                  return tx;
                }}
                onSuccess={async (tx) => {
                  try {
                    // Wait for the transaction to be confirmed
                    const receipt = await tx.receipt;

                    // Loop through the events in the receipt
                    const BetEvent = receipt.events?.find(
                      (e) => e.event === "BetResult"
                    );

                    if (BetEvent) {
                      const payout = BetEvent.args.payout.toString();
                      const win = BetEvent.args.win;

                      const formattedReward = ethers.utils.formatEther(payout);

                      if (win) {
                        setState("tails");
                        setShouldShowConfetti(true);
                        setFlipEvent("Tails");
                      } else {
                        setShouldShowNextTime(true);
                        setFlipEvent("Heads");
                      }
                      setIsFlipping(false);
                      setFlipResult(formattedReward);
                      console.log(flipResult);

                      setShowCoin(false);
                      await fetchUserBets();
                    } else {
                      console.error(
                        "Bet result event not found in the transaction receipt."
                      );
                    }
                  } catch (error) {
                    console.error("Error processing the  event:", error);
                  }
                }}
                onError={(error) => {
                  setIsFlipping(false);
                  setErrorMessage(
                    "There was an error processing your transaction. Please try again."
                  );
                  Store.addNotification({
                    title: "Error",
                    message:
                      "There was an error processing your transaction. Please try again.",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                    },
                    slidingExit: {
                      duration: 800,
                      timingFunction: "ease-out",
                      delay: 0,
                    },
                    width: 500,
                  });
                  setIsSpinning(false);
                  console.error("Error spinning the wheel:", error);
                }}
              >
                Bet Tails
              </Web3Button>
            </div>
            <div className="flex flex-col mr-40 mt-20 ">
              {showCoin && (
                <div className="coin-animation text-white">
                  <div
                    id="coin"
                    className={`${state} ${isFlipping ? "spin" : ""}`}
                    key={+new Date()}
                  >
                    <div class="side-a">
                      <img className="coin-image" src="/coin1.png" />
                    </div>
                    <div className="side-b">
                      <img className="coin-image" src="/coin2.png" />
                    </div>{" "}
                  </div>{" "}
                </div>
              )}
              {!isFlipping && flipResult && !showCoin && (
                <div className="coin-result text-white">
                  {flipEvent === "Heads" ? (
                    <img className="coin-image" src="/coin1.png" />
                  ) : (
                    <img className="coin-image" src="/coin2.png" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border rounded-[20px] h-[780px]  flex flex-col p-2  border-[#FEF2D0] sm:hidden">
          <div className="flex flex-col  rounded-[20px] w-full gap-8 justify-between bg-[#141135]">
          <div className="flex flex-col p-2 pt-4 ">
              {showCoin && (
                <div className="coin-animation text-white">
                  <div
                    id="coin"
                    className={`${state} ${isFlipping ? "spin" : ""}`}
                    key={+new Date()}
                  >
                    <div class="side-a">
                      <img className="coin-image" src="/coin1.png" />
                    </div>
                    <div className="side-b">
                      <img className="coin-image" src="/coin2.png" />
                    </div>{" "}
                  </div>{" "}
                </div>
              )}
              {!isFlipping && flipResult && !showCoin && (
                <div className="coin-result items-center justify-center flex text-white">
                  {flipEvent === "Heads" ? (
                    <img className="coin-image" src="/coin1.png" />
                  ) : (
                    <img className="coin-image" src="/coin2.png" />
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-start rounded-[20px] items-center gap-4 bg-[#211c55] pt-10 pl-4 pr-4 pb-4">
              <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                House Balance
              </p>
              <span className="gold-text__highlight" data-text={houseBalance}>
                {houseBalance}
              </span>
              <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                Enter the Bet Amount
              </p>

              <input
                className="bg-[#141135] p-4 rounded-xl sm:w-[400px] sm:h-[70px] w-full h-[50px] text-white font-lufga font-bold text-[24px]"
                type="text"
                placeholder="Bet Amount in ETH"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={loading}
              />
              <p className="text-white font-gilroy font-regular sm:text-[16px] text-[12px]">
                Maintain the bet between the House Balance
              </p>
              <p className="text-white font-gilroy font-regular sm:text-[16px] text-[12px]">
                Minimum bet 0.0001 ETH
              </p>
              <div className="flex flex-row justify-center items-center gap-2 p-2">
                <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                  Heads = Ethereum
                </p>
                <p className="text-white font-gilroy font-regular sm:text-[18px] text-[12px]">
                  Tails = Bitcoin
                </p>
              </div>
              <Web3Button
                className="flex flex-row justify-center pl-6 pr-6 pt-2 pb-2 w-full mb-4 font-gilroy font-medium text-[20px] items-center rounded-[20px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FEF2D0, #C18F5B)",
                  color: "black",
                }}
                contractAddress={
                  import.meta.env.VITE_COIN_FLIP_CONTRACT_ADDRESS
                }
                action={async (contract) => {
                  setShowCoin(true);
                  setIsFlipping(true);
                  const args = true;

                  const tx = await contract.call("placeBet", [args], {
                    value: ethers.utils.parseEther(betAmount),
                  });
                  console.log(tx);
                  // Return the transaction to use it in onSuccess
                  return tx;
                }}
                onSuccess={async (tx) => {
                  try {
                    // Wait for the transaction to be confirmed
                    const receipt = await tx.receipt;

                    // Loop through the events in the receipt
                    const BetEvent = receipt.events?.find(
                      (e) => e.event === "BetResult"
                    );

                    if (BetEvent) {
                      const payout = BetEvent.args.payout.toString();
                      const win = BetEvent.args.win;

                      const formattedReward = ethers.utils.formatEther(payout);

                      setIsFlipping(false);
                      if (win) {
                        setState("heads");
                        setShouldShowConfetti(true);
                        setFlipEvent("Heads");
                      } else {
                        setShouldShowNextTime(true);
                        setFlipEvent("Tails");
                      }
                      setIsFlipping(false);
                      setFlipResult(formattedReward);
                      console.log(flipResult);

                      setShowCoin(false);
                      await fetchUserBets();
                    } else {
                      console.error(
                        "Betresult event not found in the transaction receipt."
                      );
                    }
                  } catch (error) {
                    console.error("Error processing the  event:", error);
                  }
                }}
                onError={(error) => {
                  setIsFlipping(false);
                  setErrorMessage(
                    "There was an error processing your transaction. Please try again."
                  );
                  Store.addNotification({
                    title: "Error",
                    message:
                      "There was an error processing your transaction. Please try again.",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                    },
                    slidingExit: {
                      duration: 800,
                      timingFunction: "ease-out",
                      delay: 0,
                    },
                    width: 500,
                  });
                  setIsSpinning(false);
                  console.error("Error spinning the wheel:", error);
                }}
              >
                Bet Heads
              </Web3Button>
              <Web3Button
                className="flex flex-row justify-center pl-6 pr-6 pt-2 pb-2 w-full mb-4 font-gilroy font-medium text-[20px] items-center rounded-[20px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FEF2D0, #C18F5B)",
                  color: "black",
                }}
                contractAddress={
                  import.meta.env.VITE_COIN_FLIP_CONTRACT_ADDRESS
                }
                action={async (contract) => {
                  setShowCoin(true);
                  setIsFlipping(true);
                  const args = false;

                  const tx = await contract.call("placeBet", [args], {
                    value: ethers.utils.parseEther(betAmount),
                  });
                  console.log(tx);
                  // Return the transaction to use it in onSuccess
                  return tx;
                }}
                onSuccess={async (tx) => {
                  try {
                    // Wait for the transaction to be confirmed
                    const receipt = await tx.receipt;

                    // Loop through the events in the receipt
                    const BetEvent = receipt.events?.find(
                      (e) => e.event === "BetResult"
                    );

                    if (BetEvent) {
                      const payout = BetEvent.args.payout.toString();
                      const win = BetEvent.args.win;

                      const formattedReward = ethers.utils.formatEther(payout);

                      if (win) {
                        setState("tails");
                        setShouldShowConfetti(true);
                        setFlipEvent("Tails");
                      } else {
                        setShouldShowNextTime(true);
                        setFlipEvent("Heads");
                      }
                      setIsFlipping(false);
                      setFlipResult(formattedReward);
                      console.log(flipResult);

                      setShowCoin(false);
                      await fetchUserBets();
                    } else {
                      console.error(
                        "Bet result event not found in the transaction receipt."
                      );
                    }
                  } catch (error) {
                    console.error("Error processing the  event:", error);
                  }
                }}
                onError={(error) => {
                  setIsFlipping(false);
                  setErrorMessage(
                    "There was an error processing your transaction. Please try again."
                  );
                  Store.addNotification({
                    title: "Error",
                    message:
                      "There was an error processing your transaction. Please try again.",
                    type: "danger",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                    },
                    slidingExit: {
                      duration: 800,
                      timingFunction: "ease-out",
                      delay: 0,
                    },
                    width: 500,
                  });
                  setIsSpinning(false);
                  console.error("Error spinning the wheel:", error);
                }}
              >
                Bet Tails
              </Web3Button>
            </div>
            
          </div>
        </div>

        <div className="flex justify-start gap-2 flex-col h-[700px] sm:rounded-[50px] rounded-[20px]  mt-8 items-center border-white border sm:p-10 p-4">
          <h3 className="text-white font-lufga font-bold text-[24px]">
            Your Bets
          </h3>
          <ul className="text-white font-lufga sm:p-4 p-2 rounded-xl w-full overflow-y-auto sm:max-h-[700px] max-h-[580px]">
            {userBets.map((bet, index) => (
              <div
                key={index}
                className="flex p-4 rounded-xl  mt-4 mb-4 bg-[#d9d9d960] sm:flex-col  flex-col justify-evenly text-white font-lufga font-bold gap-y-2 sm:text-[18px] text-[10px]"
              ><div>
                <li className="font-lufga">Amount: {bet.amount} ETH</li>
                <li className="font-lufga" >Choice: {bet.choice}</li>
                <li className="font-lufga">Win: {bet.win ? "Yes" : "No"}</li>
                <li className="font-lufga">Payout: {bet.payout} ETH</li>
                <li className="font-lufga">Time: {bet.timestamp}</li>
                </div>
                <div className="bg-blue-400 p-2  rounded-lg">
                <li>
                  <a
                    href={bet.transactionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-bold font-lufga "
                  >
                    View Transaction
                  </a>
                </li>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
