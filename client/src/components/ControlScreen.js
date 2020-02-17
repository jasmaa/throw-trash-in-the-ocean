import React, { useState, useEffect } from 'react';

const ControlScreen = () => {

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">
          <h2>Control Panel</h2>

          <center>
            <button className="round-button m-5">HI</button>
          </center>

          <h2>World Stats</h2>
          <div>
            <div className="progress m-3">
              <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
            </div>
            <div className="progress m-3">
              <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: '5%' }}></div>
            </div>
            <div className="progress m-3">
              <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlScreen;
