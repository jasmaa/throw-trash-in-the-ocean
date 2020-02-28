import socketio
import threading

def spawn_bot():
    
    sio = socketio.Client()
    user_id = 'hi there'

    @sio.on('connect')
    def socket_connected():
        sio.emit('join', {
            'user_id': user_id,
            'room_name': 'hi',
        })

    @sio.on('join')
    def socket_join(msg):
        user_id = msg['user_id']

        for _ in range(100):
            sio.emit('pollute', {
                'user_id': user_id,
                'room_name': 'hi',
            })
            sio.sleep(0.1)
        sio.disconnect()

    sio.connect('http://localhost:3001')
    

def main():
    """Bot client
    """
    spawn_bot()

if __name__ == '__main__':
    main()
