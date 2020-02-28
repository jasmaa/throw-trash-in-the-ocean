import React, { useState, useEffect } from 'react';

import ControlPanel from '../components/ControlPanel';
import MapPanel from '../components/MapPanel';
import Client from '../game/client';
import { diamondSquare } from '../utils';

const crypto = require('crypto');
let client;
let noise;
const mapSize = 513;

const GameScreen = (props) => {

    const [syncData, setSyncData] = useState({});

    useEffect(() => {
        client = new Client(props.roomName, data => {
            setSyncData(prevState => ({ ...prevState, ...data }));
        });

        const hash = crypto.createHash('md5').update(props.roomName).digest('hex');
        noise = diamondSquare(mapSize, parseInt(hash, 16) % 0xFFFFFFFF);
    }, []);

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
                        userID={client == undefined ? '' : client.userID}
                        roomName={props.roomName}
                        syncData={syncData}

                        polluteHandler={() => client.pollute()}
                        setUserHandleHandler={e => client.setUserHandle(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameScreen