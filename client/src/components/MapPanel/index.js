import React from 'react';

import WorldMap from './WorldMap';


const progressbarThemes = [
  '#33cc33',
  '#ff9933',
  '#ff3300',
];

const MapPanel = (props) => {

  const deathLevel = props.syncData.health > 60
    ? 0
    : props.syncData.health > 30
      ? 1
      : 2;

  return (
    <div className="card">
      <div className="card-header">
        <div className="progress m-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${props.syncData.health}%`,
              backgroundColor: progressbarThemes[deathLevel],
            }}>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="col d-flex justify-content-center">
          <WorldMap
            mapSize={props.mapSize}
            noise={props.noise}
            syncData={props.syncData}
            deathLevel={deathLevel}
          />
        </div>
      </div>
    </div >
  );
}

export default MapPanel;
