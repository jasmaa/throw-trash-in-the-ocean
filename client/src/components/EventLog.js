import React from 'react';

const MapPanel = (props) => {

    const renderEvents = () => {
        const events = [];
        for (const event of props.events) {

            const eventPlayer = props.players[event['user_id']];

            var eventDescription;
            switch (event['event_type']) {
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
                <li className="list-group-item" key={event['event_timestamp']}>
                    {`${event['event_timestamp']} - ${eventDescription}`}
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