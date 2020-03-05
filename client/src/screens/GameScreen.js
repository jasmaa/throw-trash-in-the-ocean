import React, { useState, useEffect } from 'react';

import ControlPanel from '../components/ControlPanel';
import MapPanel from '../components/MapPanel';
import Client from '../game/client';
import { generatePerlin } from '../utils';

const crypto = require('crypto');
let client;
let noise;
const mapSize = 500;

const GameScreen = (props) => {

    const [syncData, setSyncData] = useState({});

    useEffect(() => {
        client = new Client(props.roomName, {
            updateHandler: data => setSyncData(prevState => ({ ...prevState, ...data })),
        });

        // Generate map
        const hash = crypto.createHash('md5').update(props.roomName).digest('hex');
        noise = generatePerlin(mapSize, parseInt(hash, 16) % 0xFFFFFFFF);
    }, []);

    // Stall until has user handle
    if (client == undefined || client.userHandle == undefined) return null;

    return (
        <div className="container-fluid p-5">
            <div className="row">
                <div className="col-lg-8">
                    <MapPanel
                        syncData={syncData}
                        noise={noise}
                        mapSize={mapSize}
                    />
                </div>
                <div className="col-lg-4">
                    <ControlPanel
                        userID={client.userID}
                        userHandle={client.userHandle}
                        roomName={props.roomName}
                        syncData={syncData}

                        polluteHandler={() => client.pollute()}
                        userHandleHandler={e => client.setUserHandle(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameScreen