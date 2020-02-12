import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [data, setData] = useState({});

  // Fetch data on re-render
  async function fetchData() {
    const res = await fetch('/dataTest');
    res
      .json()
      .then(res => setData(res))
      .catch(err => console.log(err));
  }
  useEffect(() => {
    fetchData();
  });

  return (
    <div className="App">
      <h1>hi im a test</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

export default App;
