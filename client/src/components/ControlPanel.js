import React from 'react';

const ControlPanel = (props) => {

  const userHandle =
    props.syncData.players == undefined
      ? 'none'
      : props.syncData.players[props.userID].userHandle;

  const renderPlayers = () => {
    
    let playerEntries = [];
    for (const userID in props.syncData.players) {
      const player = props.syncData.players[userID];
      playerEntries.push(
        <tbody>
          <tr>
            <td>{player.userHandle}</td>
            <td>{player.profit}</td>
          </tr>
        </tbody>
      );
    }

    return (
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Handle</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        {playerEntries}
      </table >
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column">

          <h3>{userHandle}</h3>
          <center>
            <button className="round-button m-5" onClick={props.polluteHandler}>{props.syncData.profit}</button>
          </center>

          <h3>Players</h3>
          {renderPlayers()}

        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
