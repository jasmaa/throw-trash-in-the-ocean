import React from 'react';

const ControlPanel = (props) => {

    let playerEntries = [];
    for (const userID in props.players) {
        const player = props.players[userID];
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

export default ControlPanel;
