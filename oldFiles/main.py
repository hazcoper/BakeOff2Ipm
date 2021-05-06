import os
import json
import csv


filterList = [96884, 99999, 96868]

# Filter just the ab testing result and save them as another json file
jfile = [file for file in os.listdir() if file.split(".")[-1] == "json"][0]

dictTries = {}   # vai conter o numero de aluno como key, e dentro disso vai ter as duas tries, quando tiver as duas tries, vai escolher a melhor e apagar as duas

def loadAndClean(jfile):
    """
    receives a string that represents de path to a json file. it will load the file and filter out to just show the results of the ab testing
    returns a new dictionary
    """
    with open(jfile) as json_file:
        data = json.load(json_file)["G15"]
        newDict = {}
        # Print the type of data variable
        
        for entry in data:

            if "version" in data[entry] and data[entry]["assessed_by"] not in filterList:

                if data[entry]["assessed_by"] in dictTries:
                    dictTries[data[entry]["assessed_by"]].append(data[entry])

                    

                    if len(dictTries[data[entry]["assessed_by"]]) == 2:
                        ml = dictTries[data[entry]["assessed_by"]]
                        #vou querer calcular o maior 
                        # comparisson = "accuracy"
                        comparisson = "target_w_penalty"
                        
                        if ml[0][comparisson] <= ml[1][comparisson]:
                            if ml[0]["accuracy"] > 90:
                                printSingle(ml[0])
                                newDict[entry] = ml[0]

                        else:
                            if ml[1]["accuracy"] > 90:
                                printSingle(ml[1])
                                newDict[entry] = ml[1]
                        dictTries[data[entry]["assessed_by"]] = []

                else:
                    dictTries[data[entry]["assessed_by"]] = [data[entry]]



                # dictTries[data["assessed_by"]]

                # newDict[entry] = data[entry]
                # print(data[entry])
                # print()
    # printDict(newDict)
    return newDict
  

def printDict(myDict):
    """
    Receives a dictionary and prints the relevant information of that dictionary to the screen
    """
    for key in myDict:
        print(f"Version:    -->   {myDict[key]['version']}  ")
        print(f"Accuracy:   -->   {myDict[key]['accuracy']}")
        print(f"Time        -->   {myDict[key]['time_per_target']}")
        print(f"Penalty     -->   {myDict[key]['target_w_penalty']}")
        print(f"ID          -->   {myDict[key]['assessed_by']}")
        print(f"#           -->   {myDict[key]['attempt']}")

        print()

def printSingle(myDict):
        print(f"Version:    -->   {myDict['version']}  ")
        print(f"Accuracy:   -->   {myDict['accuracy']}")
        print(f"Time        -->   {myDict['time_per_target']}")
        print(f"Penalty     -->   {myDict['target_w_penalty']}")
        print(f"ID          -->   {myDict['assessed_by']}")
        print(f"#           -->   {myDict['attempt']}")

        print()

def makeRawCsv(newDict, name="rawData.csv"):

    mycsv = open("rawData.csv", "w", newline="")
    writer = csv.writer(mycsv)
    writer.writerow(["id", "version", 'time', 'penalty', 'accuracy', 'attemp'])


    for key in newDict:
        row = []
        # print(newDict[key]["accuracy"], newDict[key]["version"])
        row.append(newDict[key]['assessed_by'])
        row.append(newDict[key]['version'])
        row.append(newDict[key]['time_per_target'])
        row.append(newDict[key]['target_w_penalty'])
        row.append(newDict[key]['accuracy'])
        row.append(newDict[key]['attempt'])

        writer.writerow(row)
    mycsv.close()

def getList(key, myDict):
    """
    receives a string that represents the key that will be using and a boolean that represents whether I want to average all runs or just the best out of two
    """

    versionList = [[] for x in range(0, 5)]
    for entry in myDict:
        version = myDict[entry]["version"]
        
        if (type(myDict[entry][key]) == str):
            myDict[entry][key] = float(myDict[entry][key])

        versionList[int(version)].append(myDict[entry][key])


    avgList = []
    for version in versionList:
        avgList.append(round(sum(version)/len(version), 4))
    
    return avgList

myDict = loadAndClean(jfile)
makeRawCsv(myDict)

# printDict(myDict)
print(getList("accuracy", myDict))
print(getList("time_per_target", myDict))
print(getList("target_w_penalty", myDict))
