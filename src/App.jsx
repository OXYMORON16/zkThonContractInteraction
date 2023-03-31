import { useState, useEffect } from 'react'
import './App.css';
import { ethers } from 'ethers';
import ABI from './zkThon.json';

function App() {
  const PRIVATE_KEY = "8b8909328af1ce10d45688426b5507f9ef0502b18e827a7483129772bd29db86"
  const abi = ABI;
  const contractAddress = '0xeedb99875af3116dce368d84e5c49a09300aff3c';
  let url = 'https://rpc.public.zkevm-test.net';
  const provider = new ethers.providers.JsonRpcProvider(url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const recipient = '0x2BF5bd78ea16B1709FE0342e39820cf2FFC73099';
  const decimals = 18; // number of decimal places for the token
  const amount = ethers.utils.parseUnits('1000', decimals); // convert amount to the correct format

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const balanceInWei = await contract.balanceOf(recipient);
      const balanceInDVX = balanceInWei.div(ethers.BigNumber.from(10).pow(decimals)).toString();
      setBalance(balanceInDVX);
    }
    fetchBalance();
  }, [contract, recipient, decimals]);

  async function mint() {
    console.log("Minting...")
    const tx = await contract.mint(recipient, amount);
    console.log('Transaction hash:', tx.hash);
  }

  return (
    <div className="App">
      <button onClick={mint}>Mint Tokens</button>
      <p>Balance: {balance} DVX</p>
    </div>
  )
}

export default App;
