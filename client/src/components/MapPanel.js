import React, { useRef } from 'react';
import ReactTooltip from 'react-tooltip';

import EventLog from 'src/components/EventLog';

/**
 * Paint noise as map
 * @param {*} ctx 
 * @param {*} size 
 * @param {*} noise 
 */
const paintMap = (ctx, size, noise) => {
  const imgData = ctx.getImageData(0, 0, size, size);
  const buffer = imgData.data;

  const setValue = (r, c, rgb) => {
    const [red, grn, blu] = rgb;
    buffer[size * 4 * r + 4 * c + 0] = red;
    buffer[size * 4 * r + 4 * c + 1] = grn;
    buffer[size * 4 * r + 4 * c + 2] = blu;
    buffer[size * 4 * r + 4 * c + 3] = 255;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const v = Math.floor(256 * noise[size * i + j]);

      if (v > 200) {
        setValue(i, j, [0xFF, 0xFF, 0xFF]);
      } else if (v > 170) {
        setValue(i, j, [0x99, 0x99, 0x99]);
      } else if (v > 140) {
        setValue(i, j, [0x2c, 0xb0, 0x37]);
      } else if (v > 130) {
        setValue(i, j, [0xED, 0xC9, 0xAF]);
      } else {
        setValue(i, j, [0x00, 0x00, 0xFF]);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}


const MapPanel = (props) => {

  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  if (canvas != undefined) {
    const ctx = canvas.getContext('2d');
    paintMap(ctx, props.mapSize, props.noise);

    ctx.fillStyle = 'red';
    ctx.fillRect(props.mapSize * Math.random(), props.mapSize * Math.random(), 10, 10);
  }

  const player = props.syncData.players[props.userID];

  return (
    <div className="card">
      <div className="card-body">

        <div className="progress m-3">
          <div className="progress-bar" role="progressbar" style={{ width: `${props.syncData.health}%` }}></div>
        </div>

        <div className="row m-5">
          <div className="col">
            <canvas
              ref={canvasRef}
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

        <EventLog events={props.syncData.events} players={props.syncData.players} />
      </div>
      <ReactTooltip />
    </div >
  );
}

export default MapPanel;
