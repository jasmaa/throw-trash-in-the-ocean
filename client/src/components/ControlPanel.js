import React, { useState, useEffect } from 'react';

const ControlPanel = (props) => {

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">
          
          <h3>Control Panel</h3>
          <center>
            <button className="round-button m-5" onClick={props.polluteHandler}>HI</button>
          </center>

          <h3>World Stats</h3>
          <div>
            <div className="progress m-3">
              <div className="progress-bar" role="progressbar" style={{ width: `${props.syncData.health}%` }}></div>
            </div>
            <div className="progress m-3">
              <div className="progress-bar" role="progressbar" style={{ width: '0%' }}></div>
            </div>
            <div className="progress m-3">
              <div className="progress-bar" role="progressbar" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
