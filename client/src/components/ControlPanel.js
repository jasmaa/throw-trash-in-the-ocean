import React, { useState, useEffect } from 'react';

const ControlPanel = () => {

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">
          
          <h3>Control Panel</h3>
          <center>
            <button className="round-button m-5">HI</button>
          </center>

          <h3>World Stats</h3>
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

export default ControlPanel;
