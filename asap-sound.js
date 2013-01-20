var timestamps = Object.keys(aslsp)
timestamps.sort(function(a, b){return parseInt(a, 10)-parseInt(b, 10)})
var ratio = 1;


function startSound() {
  context = new webkitAudioContext();
  bufferLoader = new BufferLoader(
    context,
    keys.map(function(key) { return 'soundfont/acoustic_grand_piano-mp3/' + key + '.mp3'}),
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  var buffer, source, gain, i;
  for (i = 0; i < bufferList.length; i++) {
    buffer = bufferList[i]
    source = context.createBufferSource();
    gain = context.createGainNode()
    source.buffer = buffer;
    source.connect(gain)
    gain.connect(context.destination)
    
    noteSounds[keyToNote[keys[i]] - offset] = [source, gain]
  }

  setInterval(function() {
    var i, note, timestamp, events, eventData, nodes, currentTime = context.currentTime;
    //console.log(parseInt(timestamps[0], 10) / 1000, context.currentTime)
    if ((parseInt(timestamps[0], 10) / 1000) * ratio < context.currentTime) {
      timestamp = timestamps.shift()
      events = aslsp[timestamp]
      for (i = 0; i < events.length; i++) {
        eventData = events[i]
        nodes = noteSounds[parseInt(eventData.n, 10)]
        if (nodes) {
          sourceNode = nodes[0]; gainNode = nodes[1]
          if (parseInt(eventData.v, 10) === 0) sourceNode.noteOff(context.currentTime)
          else {
            sourceNode.noteOn(context.currentTime)
            gainNode.gain.setValueAtTime(parseInt(eventData.v, 10) / 127, context.currentTime)
          }
        }
      }
    }

  }, 100)
}



// Midi stuff
var keyToNote = {} // C8  == 108
  , noteToKey = {}
  , keys = []
  , noteSounds = {}
  , offset = 21; // 108 ==  C8

(function () {
	var A0 = 0x15; // first note
	var C8 = 0x6C; // last note
	var number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
	for (var n = A0; n <= C8; n++) {
		var octave = (n - 12) / 12 >> 0;
		var name = number2key[n % 12] + octave;
		keyToNote[name] = n;
		noteToKey[n] = name;
	}
  keys = Object.keys(keyToNote)
})();


// Utils for loading a sound buffer
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

