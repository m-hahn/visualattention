



function make_slides(f) {
  var   slides = {};



  slides.consent = slide({
     name : "consent",
     start: function() {
      exp.startT = Date.now();
      $("#consent_2").hide();
      exp.consent_position = 0;      
     },
    button : function() {
      if(exp.consent_position == 0) {
         exp.consent_position++;
         $("#consent_1").hide();
         $("#consent_2").show();
      } else {
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });



  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });



  slides.display = slide({
    name : "display",
    present : stimuli,
    present_handle: function(stim) {
       this.stim = stim; 

       document.getElementById("img_preview_svg_div").style.display = "";
       document.getElementById("img_svg_div").style.display = "none";
       document.getElementById("question").style.visibility = "hidden";
       document.getElementById("preview_button").style.display = "";
       document.getElementById("answer_button").style.display = "none";

         document.getElementById("error").style.display = "none";


       exp.previewOrProper = 'preview'

       console.log(stim)
       $("#question").html(stim.question["question"]);

       document.getElementById("clearImage_preview").setAttribute('xlink:href', "images/"+stim["image"])

       document.getElementById("clearImage").setAttribute('xlink:href', "images/"+stim["image"])

       document.getElementById("blurredImage").setAttribute('xlink:href', "images/"+stim["image"]+"-blur.png")



       tracked = []
       this.tracked = tracked;

       $("#answer").val('')

        var myNode = document.getElementById("mask1");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        var svgNS = "http://www.w3.org/2000/svg";        
        var frag = document.createDocumentFragment();
        
        var counter = 0;
        var buttonDown = false;

        $(document).mousedown(function(e){
            var upX = e.clientX;
            var upY = e.clientY;
            unblur(upX,upY);
            buttonDown = true;
       });
       $(document).mouseup(function(e){
            buttonDown = false;
       });


       document.getElementById("blurredImage").ondragstart = function() { return false; };
       document.getElementById("clearImage").ondragstart = function() { return false; };
       document.getElementById("clearImage_preview").ondragstart = function() { return false; };

       unblur = function(upX,upY) {
            if(exp.previewOrProper == "preview") {
              return 0;
            }
            var mask = $('#mask1')[0];
        
            // https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
            pt = document.getElementById('img_svg').createSVGPoint();
            pt.x = upX;
            pt.y = upY;
            var svgP = pt.matrixTransform(document.getElementById('img_svg').getScreenCTM().inverse());
     
            counter += 1
       
            if(counter % 1 == 0) {    
               tracked.push([svgP.x, svgP.y])
            }
    
            var circle = document.createElementNS(svgNS,"circle");
            circle.setAttribute("cx", svgP.x);
            circle.setAttribute("cy", svgP.y);
            circle.setAttribute("r", "20");
            circle.setAttribute("fill", "white");
            circle.setAttribute("filter", "url(#filter2)");
        
            //circle.setAttribute("display", "none") 
            frag.appendChild(circle);
            if(counter % 1 == 0) {
               console.log("..")
               mask.appendChild(frag);
               frag = document.createDocumentFragment();
            }
        }

        $('.pic').mousemove(function (event) {
            if(!buttonDown) {
                return;
            }
            event.preventDefault();
            var upX = event.clientX;
            var upY = event.clientY;
            unblur(upX,upY);
        });



        var frag_text = document.createDocumentFragment();
        
        var counter_text = 0;
        
        $('.pic_text').mousemove(function (event) {
            event.preventDefault();
            var upX = event.clientX;
            var upY = event.clientY;
            var mask = $('#mask1_text')[0];
        
        
            // https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
            pt = document.getElementById('text_svg').createSVGPoint();
            pt.x = upX;
            pt.y = upY;
            var svgP = pt.matrixTransform(document.getElementById('text_svg').getScreenCTM().inverse());
        
        
           
            var circle = document.createElementNS(svgNS,"circle");
            circle.setAttribute("cx", svgP.x-20);
            circle.setAttribute("cy", svgP.y-20);
            circle.setAttribute("r", "30");
            circle.setAttribute("fill", "white");
            circle.setAttribute("filter", "url(#filter2_text)");
        
            frag_text.appendChild(circle);
            counter_text += 1
            if(counter_text % 1 == 0) {
               console.log("..")
               mask.appendChild(frag_text);
               frag_text = document.createDocumentFragment();
               counter_text = 0
            }
        });
    }, 
    button : function() {
      if(exp.previewOrProper == "preview") {
         exp.previewOrProper = "proper";
         document.getElementById("img_preview_svg_div").style.display = "none";
         document.getElementById("img_svg_div").style.display = "";
         document.getElementById("question").style.display = "";
         document.getElementById("preview_button").style.display = "none";
         document.getElementById("answer_button").style.display = "";
         document.getElementById("question").style.visibility = "";
      } else if($("#answer").val() == "" ) {
         document.getElementById("error").style.display = "";
      } else {
         console.log("STREAM APPLY")
         this.log_responses()
         _stream.apply(this);
      }
    },
    log_responses : function() {
        exp.data_trials.push({
          "slide_number" : exp.phase,
          "id" : this.stim.question.id,
          "tracked" : this.tracked,
          "response" : $("#answer").val(),
          "expected_response" : this.stim.question.answer,
          "question" : this.stim.question.question,
          "image" : this.stim.image,
        });
    }

  });



  slides.instructions1 = slide({
    name : "instructions1",
    start: function() {
    }, 
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
//        colorblind : $("#colorblind").val(),
        comments : $("#comments").val(),
        suggested_pay : $("#suggested_pay").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          //"condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
repeatWorker = false;
//  (function(){
//      var ut_id = "clevr-human";
//      if (UTWorkerLimitReached(ut_id)) {
//        $('.slide').empty();
//        repeatWorker = true;
//        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
//      }
//})();

  exp.current_score_click = 0;
  exp.total_quiz_trials_click = 0;

  exp.current_score = 0;
  exp.total_quiz_trials = 0;
  exp.hasDoneTutorialRevision = false;
  exp.shouldDoTutorialRevision = false;
  exp.hasEnteredInterativeQuiz = false;

  exp.trials = [];
  exp.catch_trials = [];
  exp.instruction = _.sample(["instruction1","instruction2"]);
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
   exp.structure=[];
   exp.structure.push('i0')
   exp.structure.push('consent')
   exp.structure.push( 'instructions1')
   exp.structure.push( 'display')
   exp.structure.push('subj_info')
   exp.structure.push( 'thanks')

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

      exp.order_questionnaires = _.sample([[0,1],[1,0]])


  exp.go(); //show first slide
}
