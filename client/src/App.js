import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ControlScreen from './components/ControlScreen';
import MapScreen from './components/MapScreen';

const App = () => {

  const [data, setData] = useState({});

  /*
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
  */

  return (
    <div className="container-fluid p-5">
      <div className="row">
        <div className="col-lg-8">
          <MapScreen />
        </div>
        <div className="col-lg-4">
          <ControlScreen />
        </div>
      </div>
    </div>
  );
}

export default App;
