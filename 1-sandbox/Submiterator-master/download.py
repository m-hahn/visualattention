import os
from subprocess import call 

files = os.listdir(".")

for fileName in files:
   if fileName.endswith(".success"):
     if open(fileName).read().startswith("hitid"):
        call(["python", "submiterator.py", "getresults", fileName.replace(".success","")])
        call(["python", "submiterator.py", "reformat", fileName.replace(".success","")])



