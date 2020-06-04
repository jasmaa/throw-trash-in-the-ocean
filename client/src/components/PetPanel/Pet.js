// Pet.js
// Renders tamagotchi pet
import React, { useRef, useEffect, useState } from 'react';


const UPDATE_TIME = 500;

const Pet = props => {

    const [counter, setCounter] = useState(0);

    useEffect(() => {

        // Canvas updater
        const canvasUpdater = setInterval(() => {
            setCounter(prevState => (prevState + 1) % 2);
        }, UPDATE_TIME);

        return function cleanup() {
            clearInterval(canvasUpdater);
        }

    }, []);

    const canvasRef = useRef(null);
    const canvas = canvasRef.current;
    if (canvas) {

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, props.petSize, props.petSize);

        switch (counter) {
            case 0:
                ctx.drawImage(document.getElementById("sakura0"), 0, 0);
                break;
            case 1:
                ctx.drawImage(document.getElementById("sakura1"), 0, 0);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                className="pet-canvas"
                style={{ width: props.petSize, height: props.petSize }}
                width={32}
                height={32}
            />
            <img id="sakura0" alt="Cat sprite 0" width="32" height="32" src="sakura10000.png" hidden />
            <img id="sakura1" alt="Cat sprite 1" width="32" height="32" src="sakura10001.png" hidden />
        </div>
    );
}

export default Pet;