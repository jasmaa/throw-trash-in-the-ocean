import React from 'react';

import Scoreboard from './Scoreboard';

const ControlPanel = (props) => {

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
            maxLength="30"
            value={props.userHandle}
            onChange={props.setUserHandleHandler}
          />

          <Scoreboard players={props.syncData.players} />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
