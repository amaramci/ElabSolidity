import { useEffect, useState } from "react";
import Web3 from "web3";
import AppContract from '../../contracts/Expense.json';

const appAddress = "0xfa17Ffe2AE0D03ea9DAA8a2d77aD5c1D5ca16a18";
const sepoliaRPCUrl = "https://sepolia.infura.io/v3/3a8aa6df001c43d487fe605d09c71ee5";




function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Inicijalizacija Web3 i smart ugovora
  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = AppContract.networks[networkId];
        const instance = new web3Instance.eth.Contract(
          AppContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Funkcija za dodavanje troška
  const dodajTrosak = async () => {
    try {
      await contract.methods.dodajTrosak(
        amount,
        day,
        month,
        year,
        category,
        description
      ).send({ from: (await web3.eth.getAccounts())[0] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dodavanje troška</h1>
      <div>
        <label>Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label>Day:</label>
        <input type="text" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>
      <div>
        <label>Month:</label>
        <input type="text" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      <div>
        <label>Year:</label>
        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} />
      </div>
      <div>
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button onClick={dodajTrosak}>Dodaj trošak</button>
    </div>
  );
}

export default App;
