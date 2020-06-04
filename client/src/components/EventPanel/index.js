import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import Log from './Log';

const EventPanel = (props) => {

    const [message, setMessage] = useState('');

    return (
        <div className="card">
            <div className="card-body">
                <div className="input-group my-3">
                    <input
                        type="text"
                        className="form-control"
                        maxLength="200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyPress={e => {
                            if (e.charCode === 13 && message.length > 0) {
                                props.sendChatHandler(message);
                                setMessage('');
                            }
                        }}
                    />
                    <div className="input-group-append">
                        <div className="btn btn-info" type="button" onClick={() => {
                            if (message.length > 0) {
                                props.sendChatHandler(message);
                                setMessage('');
                            }
                        }}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                    </div>
                </div>

                <Log events={props.syncData.events} players={props.syncData.players} />
            </div>
        </div >
    );
}

export default EventPanel;
