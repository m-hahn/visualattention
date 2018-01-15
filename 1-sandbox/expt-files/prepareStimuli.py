import json

perImage = {}
with open("selection.tsv", "r") as inFile:
   table = map(lambda x:x.split("\t"), inFile.read().strip().split("\n"))
   for line in table:
      if line[1] not in perImage:
         perImage[line[1]] = {"image" : line[1], "stimuli" : []}
      perImage[line[1]]["stimuli"].append({"id" : line[0], "answer" : line[2], "question" : line[3]})

with open("stimuli.js", "w") as outFile:
   print >> outFile, "experiment_stimuli = "+json.dumps(perImage)+";\n"


