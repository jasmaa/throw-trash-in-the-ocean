import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from 'react-use';

import Scoreboard from './Scoreboard';
import { fade } from 'src/utils';

const UPDATE_TIME = 10;
const CLICK_COOLDOWN_TIME = 10;
let clickCooldown = 0;
let isMouseDown = false;

const ControlPanel = (props) => {

  const [userHandle, setUserHandle] = useState(props.userHandle);
  const [particles, setParticles] = useState([]);

  const isClickerUp = !isMouseDown && clickCooldown <= 0;
  const radiusRatio = isClickerUp ? 0.4 : 0.37;
  const fontRatio = isClickerUp ? 1 : 0.95;

  useDebounce(
    () => {
      props.clientSetUserHandle(userHandle);
    },
    100,
    [userHandle],
  );

  useEffect(() => {

    // Canvas updater
    const canvasUpdater = setInterval(() => {

      setParticles(prevState => {
        for (const p of prevState) {
          p.y -= 2;
          p.x += 4 * (0.5 - Math.random());
        }
        return prevState.filter(p => p.y > 0);
      });

      if (clickCooldown > 0) clickCooldown -= UPDATE_TIME;

    }, UPDATE_TIME);

    return function cleanup() {
      clearInterval(canvasUpdater);
    }

  }, []);

  const mouseDownHandler = e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if inside button
    const dist = Math.sqrt((x - 0.5 * canvas.width) ** 2 + (y - 0.5 * canvas.height) ** 2);
    if (dist > radiusRatio * canvas.width) return;

    isMouseDown = true;
  }

  const mouseUpHandler = e => {

    if (!isMouseDown) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isMouseDown = false;
    clickCooldown = CLICK_COOLDOWN_TIME;

    setParticles(prevState => {
      if (prevState.length < 20) {
        return [...prevState, {
          x: x,
          y: y,
          value: player.powerClickProfit,
        }];
      } else {
        prevState.shift();
        return [...prevState, {
          x: x,
          y: y,
          value: player.powerClickProfit,
        }];
      }
    });
    props.polluteHandler();
  }

  const player = props.syncData.players[props.userID];


  // Canvas render
  const canvasRef = useRef(null);
  const canvas = canvasRef.current;

  if (canvas) {

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientWidth;

    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Render button
    if (isClickerUp) {
      ctx.shadowColor = 'darkred';
      ctx.shadowOffsetY = 10;
    }
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'crimson';
    ctx.arc(0.5 * canvas.width, 0.5 * canvas.height, radiusRatio * canvas.width, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'white';
    const displayText = `${player.profit}`;
    ctx.font = `${fontRatio * (80 - 30 * (displayText.length / 20))}px Arial`;
    ctx.fillText(displayText, 0.5 * canvas.width, 0.5 * canvas.height);

    // Render particles
    ctx.lineWidth = 0.8;
    ctx.font = '30px Arial';
    particles.forEach(p => {
      ctx.fillStyle = `rgba(255, 255, 255, ${fade(2 * p.y / canvas.height)})`;
      ctx.fillText(`+${p.value}`, p.x, p.y);
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>World: {props.roomName}</h3>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column">

          <center style={{ minHeight: '20em' }}>
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              onMouseDown={mouseDownHandler}
              onMouseUp={mouseUpHandler}
            />
          </center>

          <input
            type="text"
            className="form-control my-3"
            maxLength="30"
            value={userHandle}
            onChange={e => {
              setUserHandle(e.target.value);
            }}
          />

          <Scoreboard players={props.syncData.players} />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
