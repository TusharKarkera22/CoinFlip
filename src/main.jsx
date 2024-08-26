import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StateContextProvider } from "./context";

//other modules

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {  ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import {OpSepoliaTestnet} from '@thirdweb-dev/chains'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
     <ThirdwebProvider
      clientId={import.meta.env.VITE_COIN_FLIP_CLIENT_ID}
      activeChain={OpSepoliaTestnet}
      switchToActiveChain={true}
      autoSwitch={true}
      supportedChains={[OpSepoliaTestnet]}
      supportedWallets={[metamaskWallet({ recommended: true })]}
    >
     
    <StateContextProvider>
    <ReactNotifications isMobile={true} breakpoint={768} />
    <App />
    </StateContextProvider>
 
  </ThirdwebProvider>
 
    
  
   
  </React.StrictMode>
);


