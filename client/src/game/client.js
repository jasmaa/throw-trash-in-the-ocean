import io from 'socket.io-client/dist/socket.io';

import { getCookie } from 'src/utils';

/**
 * Socket client wrapper
 */
export default class Client {

    constructor(roomName, { updateHandler, petUpdateHandler }) {

        console.log(process.env.REACT_APP_BASE_URL)

        const baseURL = process.env.REACT_APP_BASE_URL;
        this.socket = io.connect(`http://${baseURL}:3001`);
        this.roomName = roomName;
        this.userID = getCookie('user_id');

        this.updateHandler = updateHandler;
        this.petUpdateHandler = petUpdateHandler;

        this.socket.on('connect', data => {

            this.socket.emit('join', {
                userID: this.userID,
                roomName: this.roomName,
            });
        });

        this.socket.on('sync', data => {
            this.updateHandler(data);
        });

        this.socket.on('sync_pet', data => {
            this.petUpdateHandler(data);
        });

        this.socket.on('join', data => {

            console.log(`Joined ${data['userID']}!`);

            this.userID = data['userID'];
            document.cookie = `user_id=${this.userID}`;
        });

        this.socket.on('set_handle', data => {
            this.userHandle = data['userHandle'];
        });
    }

    pollute() {
        this.socket.emit('pollute', {
            userID: this.userID,
            roomName: this.roomName,
        });
    }

    setUserHandle(userHandle) {
        this.socket.emit('set_handle', {
            userID: this.userID,
            roomName: this.roomName,
            userHandle: userHandle,
        });
    }

    upgradeClick() {
        this.socket.emit('upgrade_click', {
            userID: this.userID,
            roomName: this.roomName,
        });
    }

    chat(content) {
        this.socket.emit('chat', {
            userID: this.userID,
            roomName: this.roomName,
            content: content,
        });
    }

    syncPet() {
        this.socket.emit('sync_pet', {
            userID: this.userID,
            roomName: this.roomName,
        });
    }

    feedPet() {
        this.socket.emit('feed_pet', {
            userID: this.userID,
            roomName: this.roomName,
        });
    }

    revivePet() {
        this.socket.emit('revive_pet', {
            userID: this.userID,
            roomName: this.roomName,
        });
    }
}