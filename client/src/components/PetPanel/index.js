import React from 'react';
import ReactTooltip from 'react-tooltip';

import Pet from './Pet';


const PetPanel = (props) => {

    const player = props.syncData.players[props.userID];

    // NOTE: this gets re-rendered bc of world sync, also do pet sync??
    const petProgress = 100 * (new Date(props.pet.expiryTimestamp).valueOf() - Date.now()) / (new Date(props.pet.maxLifetime).valueOf());

    const isPowerClickUpgradeDisabled = player.profit < player.powerClickCost;
    const isPetFeedDisabled = player.profit < props.pet.feedCost || new Date(props.pet.expiryTimestamp).valueOf() <= Date.now();
    const isPetReviveDisabled = player.profit < props.pet.reviveCost || new Date(props.pet.expiryTimestamp).valueOf() > Date.now();

    return (
        <div className="card">
            <div className="card-header">
                <div className="progress m-3">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${petProgress < 0 ? 0 : petProgress}%`,
                        }}>
                    </div>
                </div>
            </div>
            <div className="card-body d-flex flex-column justify-content-between">

                <div className="d-flex justify-content-center mb-3">
                    <Pet
                        petSize={props.petSize}
                    />
                </div>

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
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Feed Pet</span>
                        <button
                            className={`btn btn-sm ${isPetFeedDisabled ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={props.feedPetHandler}
                            disabled={isPetFeedDisabled}
                            data-tip={`Cost: $${props.pet.feedCost}`}
                        >Buy</button>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Revive Pet</span>
                        <button
                            className={`btn btn-sm ${isPetReviveDisabled ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={props.revivePetHandler}
                            disabled={isPetReviveDisabled}
                            data-tip={`Cost: $${props.pet.reviveCost}`}
                        >Buy</button>
                    </li>
                </ul>
            </div>

            <ReactTooltip />
        </div>
    );
}

export default PetPanel;
