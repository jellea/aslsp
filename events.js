sixhundred.Events = {
  ifScroll: function(){
    if(window.addEventListener)
      document.addEventListener('changeSlider', changeSlider, false);
    //for IE/OPERA etc
    document.onmousewheel = changeSlider;changeSlider
  },
  sliderChange: function(){
    var el = document.getElementById("rangeslider"); 
    el.addEventListener("click", function(){console.log($("#rangeslider").val())}, false);
    //MIDI.Sequencer.tempo(logslider($('#rangeslider').val()));
  }
};

function changeSlider(){

    var delta = 0;

    if (!event) event = window.event;

    // normalize the delta
    if (event.wheelDelta) {

        // IE and Opera
        delta = event.wheelDelta / 60;

    } else if (event.detail) {

        // W3C
        delta = -event.detail / 2;
    }

    //calculating the next position of the object
    currPos=parseInt($('#rangeslider').val())-(delta);
    $('#rangeslider').val(currPos);
    $('.timesslower span').text(Math.round(String(logslider(currPos))));
};

function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The result should be between 100 an 10000000
  var minv = Math.log(1);
  var maxv = Math.log(27988200);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);

  return Math.exp(minv + scale*(position-minp));
}

sixhundred.Events.ifScroll();
sixhundred.Events.sliderChange();

//12 min = 1
//639 years = 639*365*24*60 min = 335858400 min = 27988200x slower
