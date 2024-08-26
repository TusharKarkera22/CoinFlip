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
    <div className="flex flex-col h-screen p-4 md:p-8">
      {shouldShowConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-[50%] sm:top-[60%] left-1/2 rounded-xl items-center flex flex-col justify-center bg-[url(/public/win.gif)] z-10 w-[250px] h-[400px] sm:h-[500px] sm:w-[500px] bg-black border border-white">
            <p className="text-white font-lufga font-bold text-[24px] sm:text-[32px]">
              WOHOOOO!!!
            </p>
            <p className="text-white font-lufga font-bold text-[18px] sm:text-[24px]">
              You won {flipResult} ETH
            </p>
            <div onClick={() => setShouldShowConfetti(false)}>
              <Button text="close" />
            </div>
          </div>
        </div>
      )}

      {shouldShowNextTime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-[50%] sm:top-[60%] left-1/2 rounded-xl items-center flex flex-col justify-center z-10 w-[250px] h-[400px] sm:h-[500px] sm:w-[500px] bg-black border border-white">
            <p className="text-white font-lufga font-bold text-[24px] sm:text-[32px]">
              Better Luck Next Time
            </p>
            <img src={"/lost.gif"} className="w-1/2 h-auto mt-2" />
            <div onClick={() => setShouldShowNextTime(false)}>
              <Button text="close" />
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col pt-4 md:pt-8 px-4 md:px-8">
        <div className="flex justify-between font-gilroy font-medium relative p-2 items-center">
          <div
            className="absolute top-0 right-0 -z-10 -mt-9 mr-9 h-[150px] w-[200px] sm:h-[250px] sm:w-[350px] rounded-full overflow-hidden"
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
          <button className="pt-2 pb-2 px-4 text-[16px] sm:text-[20px] border border-gray-600 text-white rounded-[50px] gap-2 flex flex-row justify-center items-center">
            <Gift className="text-[#FFDB93]" />
            Rewards
          </button>
          <div className="flex flex-row gap-2">
            <button className="p-2 px-4 text-[16px] sm:text-[20px] border border-gray-600 text-white rounded-[50px] flex flex-row justify-center items-center">
              <img src="/op.png" width={22} height={22} />
              {formattedWalletBalance}
              <button
                className="flex flex-row justify-center px-4 py-2 items-center rounded-[50px] ml-2"
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

        <div className="border rounded-[20px] mt-4 flex flex-col pt-4 pb-4 px-4 md:px-8 justify-center items-center border-[#FEF2D0]">
          <div className="flex flex-col md:flex-row h-auto rounded-[20px] w-full gap-4 md:gap-8 justify-between bg-[#141135]">
            <div className="flex flex-col justify-start rounded-t-[20px] md:rounded-l-[20px] items-center gap-4 bg-[#211c55] pt-4 px-4">
              <p className="text-white font-gilroy font-regular text-[12px] md:text-[18px]">
                House Balance
              </p>
              <span className="gold-text__highlight text-[16px] md:text-[24px]" data-text={houseBalance}>
                {houseBalance}
              </span>
              <p className="text-white font-gilroy font-regular text-[12px] md:text-[16px]">
                Enter the Bet Amount
              </p>

              <input
                className="bg-[#141135] p-2 rounded-xl sm:w-[300px] md:w-[400px] w-full h-[40px] text-white font-lufga font-bold text-[16px] md:text-[24px]"
                type="text"
                placeholder="Bet Amount in Telos"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={loading}
              />
              <p className="text-white font-gilroy font-regular text-[12px] md:text-[16px]">
                Maintain the bet between the House Balance
              </p>
              <p className="text-white font-gilroy font-regular text-[12px] md:text-[16px]">
                Minimum bet 0.0001 ETH
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-2 p-2">
                <p className="text-white font-gilroy font-regular text-[12px] md:text-[18px]">
                  Heads = Ethereum
                </p>
                <p className="text-white font-gilroy font-regular text-[12px] md:text-[18px]">
                  Tails = Bitcoin
                </p>
              </div>
              <Web3Button
                className="flex flex-row justify-center px-4 py-2 w-full mb-2 font-gilroy font-medium text-[16px] md:text-[20px] items-center rounded-[20px]"
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
                  return tx;
                }}
                onSuccess={async (tx) => {
                  try {
                    const receipt = await tx.receipt;

                    const BetEvent = receipt.events?.find(
                      (e) => e.event === "BetResult"
                    );

                    const { result, betAmount } = BetEvent?.args;

                    if (result) {
                      setFlipResult(
                        Number(ethers.utils.formatEther(betAmount))
                      );
                      setShouldShowConfetti(true);
                      await fetchUserBets();
                    } else {
                      setShouldShowNextTime(true);
                    }

                    setIsFlipping(false);
                  } catch (error) {
                    console.error("Error processing transaction:", error);
                    setErrorMessage(
                      "An error occurred while processing the transaction. Please try again."
                    );
                    setIsFlipping(false);
                  }
                }}
                onError={(error) => {
                  setErrorMessage(
                    "An error occurred while processing the transaction. Please try again."
                  );
                  setIsFlipping(false);
                  console.error("Error:", error);
                }}
              >
                {isFlipping ? "Placing Bet..." : "Place Bet"}
              </Web3Button>
              {errorMessage && (
                <div className="text-red-500 font-medium mt-2">
                  {errorMessage}
                </div>
              )}
            </div>

            {showCoin && (
              <div className="flex flex-col justify-center items-center p-4 md:p-8">
                <img
                  src="/coin.gif"
                  alt="coin"
                  className="h-[150px] sm:h-[200px] md:h-[250px]"
                />
                <p className="text-white font-gilroy font-bold text-[18px] md:text-[24px]">
                  Flip Coin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
