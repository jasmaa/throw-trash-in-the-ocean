import React, { useState } from 'react';

const HomeScreen = () => {

    const [roomName, setRoomName] = useState('');

    return (
        <div className="container container-fluid p-5">
            <div className="card">
                <div className="card-body">
                    <h1>Welcome to Throw Trash in the Ocean!</h1>

                    <p>
                        Choose a world!
                    </p>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="world-name"
                            value={roomName.value}
                            onChange={e => setRoomName(e.target.value)}
                            onKeyPress={e => {
                                if (e.charCode == 13) window.location.href = `/${roomName}`;
                            }}
                            autoFocus
                        />
                        <div className="input-group-append">
                            <a className="btn btn-success" type="button" href={`/${roomName}`}>Join</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeScreen