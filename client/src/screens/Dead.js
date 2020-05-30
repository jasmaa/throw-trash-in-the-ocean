import React from 'react';

const DeadScreen = props => {

    return (
        <div className="container container-fluid p-5">
            <div className="card">
                <div className="card-body d-flex flex-column align-items-center">
                    <h1>This room is dead</h1>
                    <h4>and you killed it.</h4>
                    <div className="d-flex flex-column align-items-center m-5">
                        <p>In memory of <strong>{props.roomName}</strong></p>
                        {props.syncData.createdTimestamp} - {props.syncData.destroyedTimestamp}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DeadScreen