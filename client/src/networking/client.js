import io from 'socket.io-client/dist/socket.io';

/**
 * Gets cookie
 * @param {*} cname 
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * Socket client wrapper
 */
export default class Client {

    constructor(roomName, updateHandler) {

        const baseURL = '192.168.99.101';
        this.socket = io.connect(`http://${baseURL}:3001`); // change this in production
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
}