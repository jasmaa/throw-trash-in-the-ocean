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
                    eventDescription = `${eventPlayer.userHandle} has joined the room`;
                    break;
                case 'leave':
                    eventDescription = `${eventPlayer.userHandle} has left the room`;
                    break;
                default:
                    eventDescription = 'Error';
                    break;
            }

            events.push(
                <li className="list-group-item">
                    {`${eventTimestampStr} - ${eventDescription}`}
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