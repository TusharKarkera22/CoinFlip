import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context/index'; 
import { Store } from 'react-notifications-component'; 

const AdminComponent = () => {
  const {
    contract,
    address,
    houseBalance,
    depositFunds,
    withdrawFunds,
    fetchContractOwner,
  } = useStateContext();

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      if (contract && address) {
        try {
          const owner = await fetchContractOwner();
          setIsOwner(owner === address);
        } catch (error) {
          console.error("Failed to fetch contract owner:", error);
        }
      }
    };
    checkOwner();
  }, [contract, address, fetchContractOwner]);

  const handleDeposit = async () => {
    if (!isOwner) {
      Store.addNotification({
        title: 'Error',
        message: 'You are not authorized to perform this action.',
        type: 'danger',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        slidingExit: {
          duration: 800,
          timingFunction: 'ease-out',
          delay: 0,
        },
        width: 500,
      });
      return;
    }

    try {
      await depositFunds(amount);
      Store.addNotification({
        title: 'Success',
        message: 'Funds deposited successfully.',
        type: 'success',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        slidingExit: {
          duration: 800,
          timingFunction: 'ease-out',
          delay: 0,
        },
        width: 500,
      });
      setMessage('Funds deposited successfully.');
    } catch (err) {
      Store.addNotification({
        title: 'Error',
        message: 'There was an error processing your transaction. Please try again.',
        type: 'danger',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        slidingExit: {
          duration: 800,
          timingFunction: 'ease-out',
          delay: 0,
        },
        width: 500,
      });
      console.error("Error depositing funds:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!isOwner) {
      Store.addNotification({
        title: 'Error',
        message: 'You are not authorized to perform this action.',
        type: 'danger',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        slidingExit: {
          duration: 800,
          timingFunction: 'ease-out',
          delay: 0,
        },
        width: 500,
      });
      return;
    }

    try {
      await withdrawFunds(amount);
      Store.addNotification({
        title: 'Success',
        message: 'Funds withdrawn successfully.',
        type: 'success',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        slidingExit: {
          duration: 800,
          timingFunction: 'ease-out',
          delay: 0,
        },
        width: 500,
      });
      setMessage('Funds withdrawn successfully.');
    } catch (err) {
      Store.addNotification({
        title: 'Error',
        message: 'There was an error processing your transaction. Please try again.',
        type: 'danger',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        slidingExit: {
          duration: 800,
          timingFunction: 'ease-out',
          delay: 0,
        },
        width: 500,
      });
      console.error("Error withdrawing funds:", err);
    }
  };

  return (
    <div className="flex flex-col items-center pt-40">
      <h3 className="text-2xl font-semibold text-[#FEF2D0] mb-4">House Balance: {houseBalance} Telos</h3>
      <div className="w-full max-w-xs">
        <input
          type="text"
          placeholder="Amount in ETH"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-center"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={handleDeposit}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Deposit Funds
          </button>
          <button
            onClick={handleWithdraw}
            className="bg-red-500 text-white px-4 py-2 rounded shadow"
          >
            Withdraw Funds
          </button>
        </div>
        <p className="mt-4 text-center text-red-600">{message}</p>
      </div>
    </div>
  );
};

export default AdminComponent;
