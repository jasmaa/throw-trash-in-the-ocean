import React, { useState, useEffect } from 'react';

import ControlPanel from '../components/ControlPanel';
import MapPanel from '../components/MapPanel';
import Client from '../networking/client'

let client;

const GameScreen = (props) => {

    const [syncData, setSyncData] = useState({});

    useEffect(() => {
        client = new Client(props.roomName, data => {
            setSyncData(prevState => ({...prevState, ...data}));
        });
    }, []);

    return (
        <div className="container-fluid p-5">
            <h1 className="m-3">{props.roomName}</h1>
            <div className="row">
                <div className="col-lg-8">
                    <MapPanel />
                </div>
                <div className="col-lg-4">
                    <ControlPanel
                        polluteHandler={() => client.pollute()}
                        syncData={syncData}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameScreen