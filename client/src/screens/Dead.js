import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

const DeadScreen = props => {

    const formatStr = 'LLL';
    const createdStr = moment(props.syncData.createdTimestamp).format(formatStr);
    const destroyedStr = moment(props.syncData.destroyedTimestamp).format(formatStr);

    return (
        <div className="container container-fluid p-5">
            <div className="card">
                <div className="card-body d-flex flex-column align-items-center">
                    <h1>This world is dead</h1>
                    <h4>and you killed it.</h4>
                    <div className="d-flex flex-column m-5">
                        <div className="d-flex justify-content-center m-3">
                            <h4>In memory of <strong>{props.roomName}</strong></h4>
                        </div>
                        <span>
                            <FontAwesomeIcon className="mr-3" icon={faClock} />
                            {createdStr} - {destroyedStr}
                        </span>
                        <span>
                            <FontAwesomeIcon className="mr-3" icon={faTrash} />
                            {props.syncData.totalPollution}
                        </span>
                        <span>
                            <FontAwesomeIcon className="mr-3" icon={faUser} />
                            {Object.keys(props.syncData.players).length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeadScreen