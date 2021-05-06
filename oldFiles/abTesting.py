"""
simple program that will be used to create the ids for all testers and say the order that each one is going to test
"""

import random

firstDict = {key:3 for key in range(4401, 4406)}

def maxDict(myDict, seenList):
    #receives a dict and returns the port that has been used the less and is not already on the list
    
    # from the dict that I receive I will pick the maximum that is not already in the list
    maxUse = 0

    for key in myDict:
        if myDict[key] > maxUse and key not in seenList:
            maxUse = myDict[key]
            value = key 



    if maxUse == 0:
        return ""
    myDict[value] -= 1

    # print(myDict)
    # print(f"this was the biggest thing I found {value}")        

    return value


def getValue(dictList, index, currentList):
    #gets the port that has been use less time and decrements one from it

    value = maxDict(dictList[index], currentList)
    # print(dictList, currentList, value)
    # print()

    return value, dictList

def makeDict():
    #makes a dict with the correct format (every port starting with number 3)
    #number three represents how many times that port has been chosen
    return {key:15 for key in range(4401, 4406)}

dictList = [makeDict() for x in range(5)]

link = "https://82.154.68.154:"

firstNumber = 46884
currentNumber = firstNumber
testersMaster = 3
testersPuppets  = 5

fisrtList = {}
lastList = {}



for resp in range(testersMaster):
    for subject in range(testersPuppets):
        currentList = []
        currentNumber += 1
        
        print(currentNumber)
        
        #get the order of the ports
        for x in range(5): #vou a cada dicionario buscar uma porta
            # print(f"    {link}{getValue(dictList[x])}")
            value, dictList = getValue(dictList, x, currentList)
            currentList.append(value)
            print(f"    {link}{value}", end="")
            # currentList.append(getValue(dictList[x], currentList))

        
            print() 
        # random.shuffle(portList)
        # print(f"  {portList}")
        
        # fisrtList[portList[0]] = fisrtList.get(portList[0], 0) + 1
        # lastList[portList[-1]] = lastList.get(portList[-1], 0) + 1

    print()
    print()



"""
portanto eu tenho 5 testes
e quero que cada um deles seja o primeiro a ser corrido
e que cada um deles seja o ultimo a ser corrido cada vez


vai ser no total 15 pessoas
    se cada pessoa vai fazer 5 testes
    quer dizer que cada teste tem de ser corrido a primeira vez 3 vezes

"""