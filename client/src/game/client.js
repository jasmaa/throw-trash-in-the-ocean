import io from 'socket.io-client/dist/socket.io';

import { getCookie } from '../utils';

/**
 * Socket client wrapper
 */
export default class Client {

    constructor(roomName, updateHandler) {

        const baseURL = 'localhost'; //'192.168.99.101';
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

        this.socket.on('pollute', data => {
            this.updateHandler(data);
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
            user_handle: userHandle,
        });
    }
}