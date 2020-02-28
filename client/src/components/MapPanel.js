import React, { useRef } from 'react';

function hexToRgb(hex) {
  var result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

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
    const { r: red, g: grn, b: blu } = hexToRgb(v);
    buffer[size * 4 * r + 4 * c + 0] = red;
    buffer[size * 4 * r + 4 * c + 1] = grn;
    buffer[size * 4 * r + 4 * c + 2] = blu;
    buffer[size * 4 * r + 4 * c + 3] = 255;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const v = Math.floor(256 * noise[size * i + j]);
      if (v > 200) {
        setValue(i, j, '#FFFFFF');
      } else if (v > 150) {
        setValue(i, j, '#999999');
      } else if (v > 100) {
        setValue(i, j, '#00FF00');
      } else {
        setValue(i, j, '#0000FF');
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
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="progress m-3">
          <div className="progress-bar" role="progressbar" style={{ width: `${props.syncData.health}%` }}></div>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <canvas
            className="m-3"
            ref={canvasRef}
            width={props.mapSize}
            height={props.mapSize}
          />
        </div>

        <ul className="list-group">
          <li className="list-group-item">An FOE has appeared!</li>
        </ul>

      </div>
    </div>
  );
}

export default MapPanel;
