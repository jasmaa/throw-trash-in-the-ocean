import React from 'react';
import * as moment from 'moment';

const MapPanel = (props) => {

    const renderEvents = () => {

        const events = [];
        for (const event of props.events) {

            const eventPlayer = props.players[event.userID];
            const eventTimestampStr = moment(event.eventTimestamp).format('LLL');

            var eventDescription;
            switch (event.eventType) {
                case 'join':
                    eventDescription = (
                        <span>
                            <strong>{eventPlayer.userHandle}</strong>
                            {' has joined the room'}
                        </span>
                    );
                    break;
                case 'leave':
                    eventDescription = <span>
                        <strong>{eventPlayer.userHandle}</strong>
                        {' has left the room'}
                    </span>;
                    break;
                case 'chat':
                    eventDescription = <span>
                        <strong>{eventPlayer.userHandle}</strong>
                        {`: `}
                        <span style={{ color: 'orange' }}>{event.content}</span>
                    </span>;
                    break;
                default:
                    eventDescription = 'Error';
                    break;
            }

            events.push(
                <li className="list-group-item" key={event.eventID}>
                    {eventTimestampStr} - {eventDescription}
                </li>
            );
        }
        return events;
    }

    return (
        <ul className="list-group">
            {renderEvents()}
        </ul>
    );

}

export default MapPanel;