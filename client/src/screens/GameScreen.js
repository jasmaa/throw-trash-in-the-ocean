import React, { useState, useEffect } from 'react';

import ControlPanel from '../components/ControlPanel';
import MapPanel from '../components/MapPanel';

const GameScreen = (props) => {

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
            <h1 className="m-3">{props.roomName}</h1>
            <div className="row">
                <div className="col-lg-8">
                    <MapPanel />
                </div>
                <div className="col-lg-4">
                    <ControlPanel />
                </div>
            </div>
        </div>
    );
}

export default GameScreen