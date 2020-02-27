import React, { useRef } from 'react';

/**
 * Paint noise as map
 * @param {*} ctx 
 * @param {*} size 
 * @param {*} noise 
 */
const paintMap = (ctx, size, noise) => {
  const imgData = ctx.getImageData(0, 0, size, size);
  const buffer = imgData.data;

  const setValue = (r, c, v) => {
    if (v > 200) {
      buffer[size * 4 * r + 4 * c + 0] = 255;
      buffer[size * 4 * r + 4 * c + 1] = 255;
      buffer[size * 4 * r + 4 * c + 2] = 255;
    } else if (v > 130) {
      buffer[size * 4 * r + 4 * c + 0] = 100;
      buffer[size * 4 * r + 4 * c + 1] = 100;
      buffer[size * 4 * r + 4 * c + 2] = 100;
    } else if (v > 80) {
      buffer[size * 4 * r + 4 * c + 0] = 0;
      buffer[size * 4 * r + 4 * c + 1] = 255;
      buffer[size * 4 * r + 4 * c + 2] = 0;
    } else {
      buffer[size * 4 * r + 4 * c + 0] = 0;
      buffer[size * 4 * r + 4 * c + 1] = 0;
      buffer[size * 4 * r + 4 * c + 2] = 255;
    }

    buffer[size * 4 * r + 4 * c + 3] = 255;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      setValue(i, j, Math.floor(256 * noise[size * i + j]));
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
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="progress m-3">
          <div className="progress-bar" role="progressbar" style={{ width: `${props.syncData.health}%` }}></div>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <canvas
            ref={canvasRef}
            width={props.mapSize}
            height={props.mapSize}
          />
        </div>
      </div>
    </div>
  );
}

export default MapPanel;
