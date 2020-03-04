import React from 'react';

const ControlPanel = (props) => {

    if (props.players == undefined) return (<div></div>);

    let playerEntries = [];
    const scoreboard = Object.values(props.players);
    scoreboard.sort((p1, p2) => p2.profit - p1.profit);

    for (const player of scoreboard.slice(0, 5)) {
        playerEntries.push(
            <tbody key={player.userID}>
                <tr>
                    <td>{player.userHandle}</td>
                    <td>{player.profit}</td>
                </tr>
            </tbody>
        );
    }

    return (
        <table className="table">
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

export default ControlPanel;
