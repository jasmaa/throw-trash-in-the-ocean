import React, { useState, useRef } from 'react';

import Scoreboard from './Scoreboard';

const ControlPanel = (props) => {

  const [userHandle, setUserHandle] = useState(props.userHandle);

  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  if (canvas != undefined) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';

    for (const p of props.particles) {
      ctx.fillText(p.value, p.x, p.y);
    }
  }

  const player = props.syncData.players[props.userID];

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">

          <h3>Room: {props.roomName}</h3>

          <center>
            <canvas
              ref={canvasRef}
              className="particle-canvas"
              width={500}
              height={500}
            />
            <button className="round-button m-5" onClick={() => props.polluteHandler(canvas, player.powerClickProfit)}>
              {player.profit}
            </button>
          </center>

          <input
            type="text"
            className="form-control"
            maxLength="30"
            value={userHandle}
            onChange={e => {
              setUserHandle(e.target.value);
              props.userHandleHandler(e);
            }}
          />

          <Scoreboard players={props.syncData.players} />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
