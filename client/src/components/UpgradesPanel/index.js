import React from 'react';
import ReactTooltip from 'react-tooltip';


const UpgradesPanel = (props) => {

    const player = props.syncData.players[props.userID];

    const isPowerClickUpgradeDisabled = player.profit < player.powerClickCost;

    return (
        <div className="card">
            <div className="card-header">
                Upgrades
            </div>
            <div className="card-body d-flex flex-column justify-content-between">

                <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            Power Click - Lv. {player.powerClickLevel + 1}
                        </span>
                        <button
                            className={`btn btn-sm ${isPowerClickUpgradeDisabled ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={props.upgradeClickHandler}
                            disabled={isPowerClickUpgradeDisabled}
                            data-tip={`Cost: $${player.powerClickCost}`}
                        >Buy</button>
                    </li>
                </ul>
            </div>

            <ReactTooltip />
        </div>
    );
}

export default UpgradesPanel;
