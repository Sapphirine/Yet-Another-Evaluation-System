// attach ready event
function showlogin(){
            $("#register").hide();
            $("#login").show();
        }
function showregister(){
            $("#login").hide();
            $("#register").show();
}


function loading(){
  $("#dialog").hide();
  $("#nowloading").show();
  timeoutID =window.setTimeout(function(){
      window.location.href="label.html";
  }, 3000);
}

function loading2(){
  $("#dialog").hide();
  $("#nowloading").show();
  timeoutID =window.setTimeout(function(){
      window.location.href="stat.html";
  }, 3000);
}

validateForm = {};

validateForm.ready = function() {

$('.ui.accordion')
  .accordion()
;

$('.ui.segment')
  .popup()
;
$('.ui.header')
  .popup()
;

$('.ui.rating')
  .rating()
;

$('.ui.form')
  .form({
    username: {
      identifier : 'username',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a username'
        }
      ]
    }
  },
    {onSuccess:function(event){
        var inputlist = $(event.target).find("input"); 
        var path = inputlist[0].value.split('\\');
        var username = path[path.length - 1]; 
        console.log(username);
        var form = $(event.target).attr("id");
        if(form === "login"){
            $.cookie("filename",username);
            timeoutID =window.setTimeout(loading, 1000);
            
        }
        else if(form==="register"){
            $.cookie("filename",username);
            timeoutID =window.setTimeout(loading2, 1000);
        }


    }

    });


};

$(document)
  .ready(validateForm.ready)
;

