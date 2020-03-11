import React, { useState, useRef, useEffect } from 'react';

import Scoreboard from './Scoreboard';

const ControlPanel = (props) => {

  const [userHandle, setUserHandle] = useState(props.userHandle);
  const [particles, setParticles] = useState([]);

  useEffect(() => {

    // Particle updater
    setInterval(() => {
      setParticles(prevState => {
        for (const p of prevState) {
          p.y -= 5;
          p.x += 4 * (0.5 - Math.random());
        }
        return prevState.filter(p => p.y > 0);
      });
    }, 50);
  }, []);

  const clickHandler = () => {

    setParticles(prevState => [...prevState, {
      x: canvas.width / 2 + canvas.width / 4 * (Math.random() - 0.5),
      y: canvas.height / 2,
      value: player.powerClickProfit,
    }]);
    props.polluteHandler();
  }

  // Canvas render
  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10); // TODO: replace me later

  if (canvas != undefined) {

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1.5;
    ctx.font = '30px Arial';

    particles.forEach(p => {
      ctx.fillStyle = `rgba(255, 255, 255, ${fade(2 * p.y / canvas.height)})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${fade(2 * p.y / canvas.height)})`;
      ctx.strokeText(`+${p.value}`, p.x, p.y);
      ctx.fillText(`+${p.value}`, p.x, p.y);
    });
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
            <button className="round-button m-5" onClick={clickHandler}>
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
