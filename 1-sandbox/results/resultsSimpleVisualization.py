import os
import json




print '<html>'
print '<head>'
print '    <title>Language Study</title>'
print '    <script src="../../_shared/js/jquery-1.11.1.min.js "></script>'
print '    <script src="../../_shared/full-projects/jquery-ui/jquery-ui.min.js"></script>'
print '    <script src="../../_shared/js/underscore-min.js"></script>'
print '    <!-- if you want to draw stuff: -->'
print '<!--    <script src="../../_shared/js/raphael-min.js"></script>-->'
print ''
print '    <!-- cocolab experiment logic -->'
print '    <script src="../../_shared/js/exp-V2.js"></script>'
print '    <script src="../../_shared/js/stream-V2.js"></script>'
print ''
print '    <!-- cocolab general utilities -->'
print '    <script src="../../_shared/js/mmturkey.js "></script>'
print '    <script src="../../_shared/js/browserCheck.js"></script>'
print '    <script src="../../_shared/js/utils.js"></script>'
print ''
print '    <!--CSS-->'
print '<!--    <link href="../_shared/full-projects/jquery-ui/jquery-ui.min.css" rel="stylesheet" type="text/css"/>-->'
print '    <link href="../_shared/css/cocolab-style.css" rel="stylesheet" type="text/css"/>'
print '    <link href="../css/local-style.css" rel="stylesheet" type="text/css"/>'
print ''
print '    <!-- experiment file -->'
print '    <script src="../js/order-preference.js"></script>'
print '    <script src="../expt-files/stimuli.js"></script>'
print '    <script src="../expt-files/corpus.js"></script>'
print ''
print '</head>'
print ''
print '<body onload="init();" style="font-family:Sans-Serif; line-height: 180%;">'

total_trials = []


files = os.listdir("../Submiterator-master")
for name in files:
   if name.endswith("-trials.tsv"):
      with open("../Submiterator-master/"+name, "r") as inFile:
        trials = map(lambda x:x.split("\t"), inFile.read().strip().split("\n"))
        header = trials[0]
        trials = trials[1:]
        total_trials = total_trials + trials


total_trials = sorted(total_trials, key=lambda x:(x[header.index("image")], x[header.index("question")]))
lastImage = None
lastQuestion = None
counter = 0
imageCounter = 0

for line in total_trials:
           tracked = json.loads(line[header.index("tracked")])
           if len(tracked) < 3:
             continue

           image = line[header.index("image")]
           question = line[header.index("question")]

           if image != lastImage:
              imageCounter += 1
              lastImage = image
              print '<h1>Image '+str(imageCounter)+' ('+image+')</h1>'
           if question != lastQuestion:
               lastQuestion = question
               print '<h2>'+question+'</h2>'
             

           counter += 1



           print '<div class="pic" id="img_svg_div_'+str(counter)+'">'
           print '<svg  viewBox="0 0 400 255" class="blur" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  id="img_svg_'+str(counter)+'">'
           print '<image filter="url(#filter2_'+str(counter)+')" xlink:href="../images/'+image+'-blur.png" width="100%" height="100%" id="blurredImage_'+str(counter)+'"></image>'
           print '        <filter id="filter2_'+str(counter)+'">'
           print '<feOffset in="SourceGraphic" dx="0" dy="0" />'
           print '        </filter>'
           print '        <mask id="mask1_'+str(counter)+'">'
           for circle in tracked:
               print '            <circle cx="'+str(circle[0])+'" cy="'+str(circle[1])+'" r="20" fill="white" filter="url(#filter2_'+str(counter)+')"></circle>'
           print '        </mask>'
           print'        <image xlink:href="../images/'+image+'" width="100%" height="100%" mask="url(#mask1_'+str(counter)+')" id="clearImage_'+str(counter)+'"></image>'
           print '    </svg>'
           print '</div> '
           print
           print
