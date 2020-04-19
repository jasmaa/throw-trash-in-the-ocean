import React from 'react';

const MapPanel = (props) => {

    const renderEvents = () => {
        const events = [];
        for (const event of props.events) {

            const eventPlayer = props.players[event.userID];

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
                    {`${event.eventTimestamp} - ${eventDescription}`}
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