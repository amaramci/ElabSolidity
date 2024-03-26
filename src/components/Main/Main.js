import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AppContract from '../../contracts/Expense.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [sortedExpenses, setSortedExpenses] = useState([]);

  useEffect(() => {
    initWeb3();
    loadExpenses();
  }, []);

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

  const loadExpenses = async () => {
    if (contract) {
      const expensesCount = await contract.methods.sledeciTrosakId().call();
      const expensesArray = [];
      for (let i = 0; i < expensesCount; i++) {
        const expense = await contract.methods.troskovi(i).call();
        expensesArray.push(expense);
      }
      setExpenses(expensesArray);
    }
  };

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
  
      const newExpense = {
        amount: amount,
        day: day,
        month: month,
        year: year,
        category: category,
        description: description
      };
  
      setExpenses([...expenses, newExpense]);
  
      setAmount('');
      setDay('');
      setMonth('');
      setYear('');
      setCategory('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const azurirajTrosak = async (id) => {
    try {
      const updatedAmount = prompt('Unesite novo iznos troška:');
      const updatedDescription = prompt('Unesite novi opis troška:');
      await contract.methods.azurirajTrosak(
        id,
        updatedAmount,
        day,
        month,
        year,
        category,
        updatedDescription
      ).send({ from: (await web3.eth.getAccounts())[0] });
      loadExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const otkazivanje = async (id) => {
    try {
      await contract.methods.otkazivanje(id).send({ from: (await web3.eth.getAccounts())[0] });
      loadExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const sortiraj = () => {
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
    setSortedExpenses(sorted);
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
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

      <h2>Troškovi</h2>
      <button onClick={sortiraj}>Sortiraj troškove</button>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {sortedExpenses.length > 0
          ? sortedExpenses.map((expense, index) => (
              <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#f0f0f0' }}>
                <div>Amount: {expense.amount}</div>
                <div>Category: {expense.category}</div>
                <div>Description: {expense.description}</div>
                <div>Day: {expense.day}, Month: {expense.month}, Year: {expense.year}</div>
                <button onClick={() => azurirajTrosak(expense.id)}>Ažuriraj trošak</button>
                <button onClick={() => otkazivanje(expense.id)}>Otkaži trošak</button>
              </li>
            ))
            : expenses.map((expense, index) => (
                <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#f0f0f0' }}>
                  <div>Amount: {expense.amount}</div>
                  <div>Category: {expense.category}</div>
                  <div>Description: {expense.description}</div>
                  <div>Day: {expense.day}, Month: {expense.month}, Year: {expense.year}</div>
                  <div>
                    <button onClick={() => azurirajTrosak(index)}>Ažuriraj trošak</button>
                    <button onClick={() => otkazivanje(index)}>Otkaži trošak</button>
                  </div>
                </li>
              ))}
              
      </ul>
    </div>
  );
}

export default App;

