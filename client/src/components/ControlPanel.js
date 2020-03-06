import React, { useState, useEffect } from 'react';

import Scoreboard from './Scoreboard';

const ControlPanel = (props) => {

  const [userHandle, setUserHandle] = useState(props.userHandle);

  const profit = props.syncData.players[props.userID].profit;

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">

          <h3>Room: {props.roomName}</h3>

          <center>
            <button className="round-button m-5" onClick={props.polluteHandler}>{profit}</button>
          </center>

          <input
            type="text"
            className="form-control"
            maxLength="30"
            value={userHandle}
            onChange={e => {
              setUserHandle(e.target.value);
              props.userHandleHandler(e);
            }}
          />

          <Scoreboard players={props.syncData.players} />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
