import subprocess
import threading

if __name__ == '__main__':
    
    CREATE_NO_WINDOW = 0x08000000

    bots = []
    for i in range(10):
        t = threading.Thread(target=lambda: subprocess.call('python bot.py', creationflags=CREATE_NO_WINDOW))
        bots.append(t)

    for bot in bots:
        bot.start()
