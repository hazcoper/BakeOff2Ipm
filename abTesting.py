"""
simple program that will be used to create the ids for all testers and say the order that each one is going to test
"""


firstNumber = 46884
currentNumber = firstNumber
testersMaster = 3
testersPuppets  = 5

for resp in range(testersMaster):
    for subject in range(testersPuppets):
        currentNumber += 1
        print(currentNumber)
    print()