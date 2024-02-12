import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractAddress from './env.js';
import './App.css';
import abi from './utils/chai';
function App() {
  // env.config();
  const [connected, setConnected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [signer, setSigner] = useState();
  // const contractAddress = process.env.contractAddress;
  useEffect(() => {
    // Fetch previous transactions from smart contracts
    fetchTransactions();
  }, [connected]);

  async function fetchTransactions() {
    if (connected) {
      // Fetch transactions using ethers or web3
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const txns = await contract.getMemos();
      setTransactions(txns);
    }
  }

  async function connectMetamask() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await provider.getSigner();
      setConnected(true);
      setSigner(_signer);
      const address = await _signer.getAddress();
      setCurrentAddress(address);
      console.log("Connected to", address);
    } else {
      console.log("Wallet not installed");
    }
  }

  async function buyChai() {
    if (connected) {
      if (name !== "" && message !== "" && amount > 0) {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        // Convert amount to wei (1 ether = 1e18 wei)
        const value = ethers.parseEther(amount.toString());
        // Call buyChai function with name and message parameters and send the specified value
        await contract.buyChai(name, message, { value: value });
        console.log("Buying chai:", name, message, amount);
        // After transaction, fetch updated transactions
        await fetchTransactions();
      } else {
        console.log("Please fill in all fields and enter a valid amount.");
      }
    } else {
      console.log("Not connected to wallet");
    }
  }
  

  return (
    <>
      {connected ? ( <>
        <div className='c'>
          <h3>Connected to <span>{currentAddress}</span></h3>
          <div> 
            <label className='fl'>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label className='fl'>
              Message:
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <br />
            <label className='fl'>
              Amount of ethers:
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <br />
            <button className="btnn" onClick={buyChai}>Buy ☕️</button>
          </div>
         
        </div>
        <div className='trns'>
  <h2>Previous Transactions:</h2>
  <ul>
    {transactions.map((txn, index) => (
      <li key={index}>
        <span className="txn-name">{txn.name}:</span> <span className="txn-message">{txn.message}</span>
      </li>
    ))}
  </ul>
</div>

        </>
      ) : (
        <div className='unc'>
          <h1 className='mainhead'>Buy me A chai☕️</h1>
          <button className='btn' onClick={connectMetamask}>Connect Wallet</button>
        </div>
      )}
    </>
  );
}

export default App;
