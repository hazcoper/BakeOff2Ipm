# basicamente quero encontrar todas as pastas que cotnem os servidores que eu quero ligar
import keyboard
from multiprocessing import Process
import time
import os

def killCallback():
    print("[CALLBACK] --> signal has been received, starting to kill all the threads")
    for p in pList:
        p.kill()

def checkFolder(folder):
    """
    will look inside the folder and see if there is the special marking file
    """

    return "special" in os.listdir(folder)


def runServer(folder):
    """
    go to the folder and run the server
    """

    os.chdir(folder)
    print(f"[{folder}]     --> starting server")
    os.system("python2 httpsServer.py")

    # while True:
    #     print(f"[{folder}] --> hello")
    #     time.sleep(2)

if __name__ == "__main__":
    
    
    keyboard.add_hotkey('ctrl+shift+a', killCallback)
    
    # keyboard.on_press(killCallback, suppress=False)
    print("[MAIN] --> starting the program")
    pList = []
    folderList = [file for file in os.listdir() if os.path.isdir(file) and checkFolder(file)]

    # creat the pList
    for folder in folderList:
        pList.append(Process(target=runServer, args=(folder,)))
    print("[MAIN] --> p list has been created, starting one by one")

    for p in pList:
        p.start()
    print("[MAIN] --> all threads have been started")

    # wait for the threas to finish
    for p in pList:
        p.join()


    # agora para cada folder dentro desta lista, quero criar uma thread que vai executar um comando de shell para abrir o server dessa pasta



