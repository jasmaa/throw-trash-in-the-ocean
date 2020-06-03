// WorldMap.js
// Renders world map
import React, { useRef } from 'react';

import { fade } from 'src/utils';

const mapThemes = [
    {
        snow: [0xFF, 0xFF, 0xFF],
        rock: [0x99, 0x99, 0x99],
        grass: [0x2c, 0xb0, 0x37],
        sand: [0xED, 0xC9, 0xAF],
        water: [0x00, 0x00, 0xFF],
    },
    {
        snow: [0xFF, 0xFF, 0xFF],
        rock: [0x99, 0x99, 0x99],
        grass: [0x2c, 0xb0, 0x37],
        sand: [0xED, 0xC9, 0xAF],
        water: [0x00, 0x00, 0xFF],
    },
    {
        snow: [0x99, 0x99, 0x99],
        rock: [0x99, 0x99, 0x99],
        grass: [0x99, 0x66, 0x00],
        sand: [0xED, 0xC9, 0xAF],
        water: [0x99, 0x99, 0x66],
    }
];

/**
 * Paint noise as map
 * @param {*} ctx 
 * @param {*} size 
 * @param {*} noise 
 */
const paintMap = (ctx, size, noise, theme) => {
    const imgData = ctx.getImageData(0, 0, size, size);
    const buffer = imgData.data;

    const setValue = (r, c, rgb) => {
        const [red, grn, blu] = rgb;
        buffer[size * 4 * r + 4 * c + 0] = red;
        buffer[size * 4 * r + 4 * c + 1] = grn;
        buffer[size * 4 * r + 4 * c + 2] = blu;
        buffer[size * 4 * r + 4 * c + 3] = 255;
    }

    // Paint pixels
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const v = Math.floor(256 * noise[size * i + j]);

            if (v > 200) {
                setValue(i, j, theme.snow);
            } else if (v > 170) {
                setValue(i, j, theme.rock);
            } else if (v > 140) {
                setValue(i, j, theme.grass);
            } else if (v > 130) {
                setValue(i, j, theme.sand);
            } else {
                setValue(i, j, theme.water);
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
}


const WorldMap = props => {

    const canvasRef = useRef(null);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        paintMap(ctx, props.mapSize, props.noise, mapThemes[props.deathLevel]);

        props.syncData.trash.forEach(v => {
            ctx.globalAlpha = fade(v.ttl / v.totalTTL);
            ctx.drawImage(document.getElementById(`trash${v.trashType}`), v.x, v.y)
        });
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                className="map-canvas"
                width={props.mapSize}
                height={props.mapSize}
            />
            <img id="trash0" alt="Trash sprite 0" width="16" height="16" src="trash0000.png" hidden />
            <img id="trash1" alt="Trash sprite 1" width="16" height="16" src="trash0001.png" hidden />
            <img id="trash2" alt="Trash sprite 2" width="16" height="16" src="trash0002.png" hidden />
            <img id="trash3" alt="Trash sprite 3" width="16" height="16" src="trash0003.png" hidden />
        </div>
    );
}

export default WorldMap;