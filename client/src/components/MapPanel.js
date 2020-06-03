import React, { useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import WorldMap from 'src/components/WorldMap';
import Pet from 'src/components/Pet';
import EventLog from 'src/components/EventLog';

const progressbarThemes = [
  '#33cc33',
  '#ff9933',
  '#ff3300',
];


const MapPanel = (props) => {

  const [message, setMessage] = useState('');

  const player = props.syncData.players[props.userID];

  const deathLevel = props.syncData.health > 60
    ? 0
    : props.syncData.health > 30
      ? 1
      : 2;

  return (
    <div className="card">
      <div className="card-body">

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

        <div className="row m-5">
          <div className="col d-flex justify-content-center">
            <WorldMap
              mapSize={props.mapSize}
              noise={props.noise}
              syncData={props.syncData}
              deathLevel={deathLevel}
            />
          </div>

          <div className="col d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-center mb-3">
              <Pet
                petSize={props.petSize}
              />
              {JSON.stringify(props.pet)}
            </div>

            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span data-tip={`Cost: ${player.powerClickCost}`}>
                  Power Click - Lv. {player.powerClickLevel + 1}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={props.upgradeClickHandler}
                  disabled={player.profit < player.powerClickCost}
                >
                  Buy
                </button>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span data-tip={`Cost: `}>
                  Feed Pet
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={props.feedPetHandler}
                >
                  Buy
                </button>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span data-tip={`Cost: `}>
                  Revive Pet
                </span>
                <button
                  className="btn btn-primary btn-sm"
                >
                  Buy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="input-group my-3">
          <input
            type="text"
            className="form-control"
            maxLength="200"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.charCode === 13 && message.length > 0) {
                props.sendChatHandler(message);
                setMessage('');
              }
            }}
          />
          <div className="input-group-append">
            <div className="btn btn-info" type="button" onClick={() => {
              if (message.length > 0) {
                props.sendChatHandler(message);
                setMessage('');
              }
            }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>

        <EventLog events={props.syncData.events} players={props.syncData.players} />
      </div>

      <ReactTooltip />
    </div >
  );
}

export default MapPanel;
