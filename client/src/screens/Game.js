import React, { useState, useEffect } from 'react';

import DeadScreen from 'src/screens/Dead';
import ControlPanel from 'src/components/ControlPanel';
import MapPanel from 'src/components/MapPanel';
import Loading from 'src/components/Loading';
import Client from 'src/game/client';
import { generatePerlin } from 'src/utils';
import * as crypto from 'crypto';

let client;
let noise;
const mapSize = 500;
const petSize = 256;

const GameScreen = (props) => {

    const [syncData, setSyncData] = useState({});
    const [pet, setPet] = useState({});

    useEffect(() => {
        client = new Client(props.roomName, {
            updateHandler: data => setSyncData(prevState => ({ ...prevState, ...data })),
            petUpdateHandler: data => setPet(prevState => ({ ...prevState, ...data })),
        });

        // Generate map
        const hash = crypto.createHash('md5').update(props.roomName).digest('hex');
        noise = generatePerlin(mapSize, parseInt(hash, 16) % 0xFFFFFFFF);
    }, [props.roomName]);

    // Stall until has user handle
    if (client === undefined) return <Loading />;
    if (syncData.isDead) return <DeadScreen roomName={props.roomName} syncData={syncData} />;
    if (client.userHandle === undefined) return <Loading />;

    return (
        <div className="container-fluid p-5">
            <div className="row">
                <div className="col-lg-8">
                    <MapPanel
                        userID={client.userID}
                        syncData={syncData}
                        pet={pet}
                        noise={noise}
                        mapSize={mapSize}
                        petSize={petSize}

                        upgradeClickHandler={() => client.upgradeClick()}
                        sendChatHandler={content => client.chat(content)}
                        feedPetHandler={() => client.feedPet()}
                    />
                </div>
                <div className="col-lg-4">
                    <ControlPanel
                        userID={client.userID}
                        userHandle={client.userHandle}
                        roomName={props.roomName}
                        syncData={syncData}

                        polluteHandler={() => client.pollute()}
                        clientSetUserHandle={handle => client.setUserHandle(handle)}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameScreen