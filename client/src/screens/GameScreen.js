import React, { useState, useEffect } from 'react';

import ControlPanel from '../components/ControlPanel';
import MapPanel from '../components/MapPanel';
import Client from '../game/client'

const crypto = require('crypto');

let client;
let noise;
const mapSize = 513;

/**
 * Diamond square noise generation
 * @param {*} size 
 * @param {*} seed 
 */
const diamondSquare = (size, seed) => {
    const buffer = Array(size * size);
    let currSize = size - 1;

    const xorshift32 = () => {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return seed / 0xFFFFFFFF;
    }

    // Seed corners
    for (let i = 0; i < size; i += currSize) {
        for (let j = 0; j < size; j += currSize) {
            buffer[size * i + j] = Math.abs(xorshift32());
        }
    }
    currSize /= 2;

    while (currSize >= 1) {

        // Diamond
        for (let i = currSize; i < size; i += 2 * currSize) {
            for (let j = currSize; j < size; j += 2 * currSize) {
                
                let n = 0;
                let s = 0;

                if (i - currSize >= 0 && j - currSize >= 0) {
                    s += buffer[size * (i - currSize) + (j - currSize)]
                    n++;
                }
                if (i - currSize >= 0 && j + currSize < size) {
                    s += buffer[size * (i - currSize) + (j + currSize)]
                    n++;
                }
                if (i + currSize < size && j - currSize >= 0) {
                    s += buffer[size * (i + currSize) + (j - currSize)]
                    n++;
                }
                if (i + currSize < size && j + currSize < size) {
                    s += buffer[size * (i + currSize) + (j + currSize)]
                    n++;
                }
                buffer[size * i + j] = Math.abs((s + xorshift32()) / n);
            }
        }

        // Square
        for (let i = 0; i < size; i += currSize) {
            for (let j = 0; j < size; j += currSize) {

                if (buffer[size * i + j] == undefined) {
                    let n = 0;
                    let s = 0;

                    if (i - currSize >= 0) {
                        s += buffer[size * (i - currSize) + j]
                        n++;
                    }
                    if (i + currSize < size) {
                        s += buffer[size * (i + currSize) + j]
                        n++;
                    }
                    if (j - currSize >= 0) {
                        s += buffer[size * i + (j - currSize)]
                        n++;
                    }
                    if (j + currSize < size) {
                        s += buffer[size * i + (j + currSize)]
                        n++;
                    }
                    buffer[size * i + j] = Math.abs((s + xorshift32()) / n);
                }
            }
        }
        currSize /= 2;
    }

    return buffer;
}

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