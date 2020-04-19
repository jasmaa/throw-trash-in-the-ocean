import io from 'socket.io-client/dist/socket.io';

import { getCookie } from 'src/utils';

/**
 * Socket client wrapper
 */
export default class Client {

    constructor(roomName, { updateHandler }) {

        console.log(process.env.REACT_APP_BASE_URL)

        const baseURL = process.env.REACT_APP_BASE_URL;
        this.socket = io.connect(`http://${baseURL}:3001`);
        this.roomName = roomName;
        this.userID = getCookie('user_id');

        this.updateHandler = updateHandler;

        this.socket.on('connect', data => {
            this.socket.emit('join', {
                user_id: this.userID,
                room_name: this.roomName,
            });
        });

        this.socket.on('sync', data => {
            this.updateHandler(data);
        });

        this.socket.on('join', data => {

            console.log(`Joined ${data['user_id']}!`);

            this.userID = data['user_id'];
            document.cookie = `user_id=${this.userID}`;
        });

        this.socket.on('set_handle', data => {
            this.userHandle = data['user_handle'];
        });
    }

    pollute() {
        this.socket.emit('pollute', {
            user_id: this.userID,
            room_name: this.roomName,
        });
    }

    setUserHandle(userHandle) {
        this.socket.emit('set_handle', {
            user_id: this.userID,
            room_name: this.roomName,
            user_handle: userHandle,
        });
    }

    upgradeClick() {
        this.socket.emit('upgrade_click', {
            user_id: this.userID,
            room_name: this.roomName,
        });
    }
}