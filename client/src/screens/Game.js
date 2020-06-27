import React, { useState, useEffect } from 'react';
import * as crypto from 'crypto';

import DeadScreen from 'src/screens/Dead';
import ControlPanel from 'src/components/ControlPanel';
import MapPanel from 'src/components/MapPanel';
import PetPanel from 'src/components/PetPanel';
import UpgradesPanel from 'src/components/UpgradesPanel';
import EventPanel from 'src/components/EventPanel';
import Loading from 'src/components/Loading';
import Client from 'src/game/client';
import { generatePerlin } from 'src/utils';

let client;
let noise;
const mapSize = 500;
const petSize = 256;

const GameScreen = (props) => {

    const [syncData, setSyncData] = useState({});
    const [pet, setPet] = useState({
        expiryTimestamp: new Date(),
        feedCost: -1,
        reviveCost: -1,
        feedRestoreTime: -1,
        maxLifetime: -1,
        hatType: 0,
    });

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
                    <div className="row">

                        <div className="col-lg-4">
                            <UpgradesPanel
                                userID={client.userID}
                                syncData={syncData}
                                upgradeClickHandler={() => client.upgradeClick()}
                            />
                            {/*
                            <PetPanel
                                petSize={petSize}
                                pet={pet}

                                userID={client.userID}
                                syncData={syncData}
                                upgradeClickHandler={() => client.upgradeClick()}
                                feedPetHandler={() => client.feedPet()}
                                revivePetHandler={() => client.revivePet()}
                            />
                            */}
                        </div>
                        <div className="col-lg-8">
                            <MapPanel
                                syncData={syncData}
                                noise={noise}
                                mapSize={mapSize}
                            />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-12">
                            <EventPanel
                                userID={client.userID}
                                syncData={syncData}

                                sendChatHandler={content => client.chat(content)}
                            />
                        </div>
                    </div>
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
        </div >
    );
}

export default GameScreen