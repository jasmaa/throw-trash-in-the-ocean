import React, { useState, useEffect } from 'react';

const MapPanel = (props) => {

  return (
    <div className="card">
      <div className="card-body">
        <div className="progress m-3">
          <div className="progress-bar" role="progressbar" style={{ width: `${props.syncData.health}%` }}></div>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1>put a map here or something</h1>
        </div>
      </div>
    </div>
  );
}

export default MapPanel;
