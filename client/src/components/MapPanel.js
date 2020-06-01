import React, { useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import EventLog from 'src/components/EventLog';
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

const progressbarThemes = [
  '#33cc33',
  '#ff9933',
  '#ff3300',
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


const MapPanel = (props) => {

  const deathLevel = props.syncData.health > 60
    ? 0
    : props.syncData.health > 30
      ? 1
      : 2;

  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    paintMap(ctx, props.mapSize, props.noise, mapThemes[deathLevel]);

    props.syncData.trash.forEach(v => {
      ctx.globalAlpha = fade(v.ttl / v.totalTTL);
      ctx.drawImage(document.getElementById(`trash${v.trashType}`), v.x, v.y)
    });
  }

  const [message, setMessage] = useState('');

  const player = props.syncData.players[props.userID];

  return (
    <div className="card">
      <div className="card-body">

        <div className="progress m-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${props.syncData.health}%`,
              backgroundColor: progressbarThemes[deathLevel],
            }}>
          </div>
        </div>

        <div className="row m-5">
          <div className="col">
            <canvas
              ref={canvasRef}
              className="map-canvas"
              width={props.mapSize}
              height={props.mapSize}
            />
          </div>

          <div className="col">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span data-tip={`+$${player.powerClickProfit} per click`}>Power Click - Lv. {player.powerClickLevel}</span>
                <button className="badge badge-primary badge-pill" onClick={props.upgradeClickHandler}>{player.powerClickCost}</button>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Estate - None
                <span className="badge badge-primary badge-pill">+</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="input-group my-3">
          <input
            type="text"
            className="form-control"
            maxLength="200"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.charCode === 13 && message.length > 0) {
                props.sendChatHandler(message);
                setMessage('');
              }
            }}
          />
          <div className="input-group-append">
            <div className="btn btn-info" type="button" onClick={() => {
              if (message.length > 0) {
                props.sendChatHandler(message);
                setMessage('');
              }
            }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>

        <EventLog events={props.syncData.events} players={props.syncData.players} />
      </div>

      <img id="trash0" alt="Trash sprite 0" width="16" height="16" src="trash0000.png" hidden />
      <img id="trash1" alt="Trash sprite 1" width="16" height="16" src="trash0001.png" hidden />
      <img id="trash2" alt="Trash sprite 2" width="16" height="16" src="trash0002.png" hidden />
      <img id="trash3" alt="Trash sprite 3" width="16" height="16" src="trash0003.png" hidden />
      <ReactTooltip />
    </div >
  );
}

export default MapPanel;
