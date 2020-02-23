import React from 'react';

import Scoreboard from './Scoreboard';

const ControlPanel = (props) => {

  const userHandle =
    props.syncData.players == undefined
      ? 'none'
      : props.syncData.players[props.userID].userHandle;

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">

          <h3>Room: {props.roomName}</h3>

          <center>
            <button className="round-button m-5" onClick={props.polluteHandler}>{props.syncData.profit}</button>
          </center>

          <input
            type="text"
            className="form-control"
            value={userHandle}
            onChange={props.setUserHandleHandler}
          />

          <h3>Players</h3>
          <Scoreboard players={props.syncData.players} />

        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
