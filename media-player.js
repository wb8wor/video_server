// Sample Media Player using HTML5's Media API
// 
// Ian Devlin (c) 2012
// http://iandevlin.com
// http://twitter.com/iandevlin
//
// This was written as part of an article for the February 2013 edition of .net magazine (http://netmagazine.com/)

// Wait for the DOM to be loaded before initializing the media player
document.addEventListener("DOMContentLoaded", function() { initializeMediaPlayer(); }, false);

// Variables to store handles to various required elements
var mediaPlayer;
var playPauseBtn;
var muteBtn;
var progressBar;

// var fullscreenBtn;

// This function initializes the thumb flow menu.  It then adds
// listener functions to handle the controls.
function initializeMediaPlayer() {
    // Get a handle to the player
    mediaPlayer = document.getElementById('media-video');
    
    // Get handles to each of the buttons and required elements
    playPauseBtn = document.getElementById('play-pause-button');
    muteBtn = document.getElementById('mute-button');
    progressBar = document.getElementById('progress-bar');
//    fullscreenBtn = document.getElementById('fullscreen-button');

    // Set up the thumbnail flow.
    loadJSON (function (media_list) {
	var mydata = JSON.parse(media_list);
	var collection_string="";
	
	mydata.forEach (function(element, i) {
	    collection_string += '<input type="radio" name="thumb-item" id=" thumb-'+ i + '"></input>'
		+ '<li class="thumbflow-item">'
		+ '  <label for=" thumb-' + i + '">'
		+ '    <figure class="thumb-cover">'
		+ '      <img onclick=\'loadVideo ("' + element.media_name + '","' + element.media_type +'");\' src="' + element.thumbnail_name + '"></img>'
		+ '      <figcaption class="thumb-name">' + element.media_caption + '</figcaption>'
		+ '    </figure>'
		+ '  </label>'
		+ '</li>';

	    document.getElementById ("thumbflow-list").innerHTML = collection_string;
	});
    });
    
    loadJSON1 (function (media_list) {
	var mydata = JSON.parse(media_list);
	var collection_string="";
	
	mydata.forEach (function(element, i) {
	    collection_string += '<input type="radio" name="thumb-item" id=" thumb-'+ i + '"></input>'
		+ '<li class="thumbflow-item">'
		+ '  <label for=" thumb-' + i + '">'
		+ '    <figure class="thumb-cover">'
		+ '      <img onclick=\'loadVideo ("' + element.media_name + '","' + element.media_type +'");\' src="' + element.thumbnail_name + '"></img>'
		+ '      <figcaption class="thumb-name">' + element.media_caption + '</figcaption>'
		+ '    </figure>'
		+ '  </label>'
		+ '</li>';

	    document.getElementById ("thumbflow-list1").innerHTML = collection_string;
	});
    });
    
   // Add a listener for the timeupdate event so we can update the progress bar
    mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
    
    // Add a listener for the play and pause events so the buttons state can be updated
    mediaPlayer.addEventListener('play', function() {
	// Change the button to be a pause button
	changeButtonType(playPauseBtn, 'pause');
    }, false);
    
    mediaPlayer.addEventListener('pause', function() {
	// Change the button to be a play button
	changeButtonType(playPauseBtn, 'play');
    }, false);
    
    // need to work on this one more...how to know it's muted?
    mediaPlayer.addEventListener('volumechange', function(e) { 
	// Update the button to be mute/unmute
	if (mediaPlayer.muted) changeButtonType(muteBtn, 'unmute');
	else changeButtonType(muteBtn, 'mute');
    }, false);

    /* Need more work on fullscreen

    mediaPlayer.addEventListener('fullscreen', function() {
	changeButtonType(fullscreenBtn, 'exitfullscreen');
    }, false);

    mediaPlayer.addEventListener('exitfullscreen', function() {
	changeButtonType(fullscreenbtn, 'fullscreen');
    }, false); */
    
    mediaPlayer.addEventListener('ended', function() { this.pause(); }, false);
}

/* Function to open fullscreen mode */
function openFullscreen() {
  /* Get the element you want displayed in fullscreen */ 
  if (mediaPlayer.requestFullscreen) {
  mediaPlayer.requestFullscreen();
  } else if (mediaPlayer.mozRequestFullScreen) { /* Firefox */
  mediaPlayer.mozRequestFullScreen();
  } else if (mediaPlayer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
  mediaPlayer.webkitRequestFullscreen();
  } else if (mediaPlayer.msRequestFullscreen) { /* IE/Edge */
  mediaPlayer.msRequestFullscreen();
  }
}

// This function toggles the player's pause and play status.
function togglePlayPause() {
    if (mediaPlayer.paused || mediaPlayer.ended) {
	changeButtonType(playPauseBtn, 'pause');
	mediaPlayer.play();
    }
    
    else {
	changeButtonType(playPauseBtn, 'play');
	mediaPlayer.pause();
    }
}

function loadJSON (callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType ("application/json");
    xobj.open ('GET', 'media-list.json', true);

    xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {
	    callback (xobj.responseText);
	}
    };

    xobj.send (null);
}

function loadJSON1 (callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType ("application/json");
    xobj.open ('GET', 'media-list1.json', true);

    xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {
	    callback (xobj.responseText);
	}
    };

    xobj.send (null);
}

// Stop the current media from playing, and return it to the start position
function stopPlayer() {
    mediaPlayer.pause();
    mediaPlayer.currentTime = 0;
}

// Changes the volume on the media player
function changeVolume(direction) {
    if (direction === '+') mediaPlayer.volume += mediaPlayer.volume == 1 ? 0 : 0.1;
    else mediaPlayer.volume -= (mediaPlayer.volume == 0 ? 0 : 0.1);
    mediaPlayer.volume = parseFloat(mediaPlayer.volume).toFixed(1);
}

// Toggles the media player's mute and unmute status
function toggleMute() {
    if (mediaPlayer.muted) {
	changeButtonType(muteBtn, 'mute');
	mediaPlayer.muted = false;
    }
    
    else {
	changeButtonType(muteBtn, 'unmute');
	mediaPlayer.muted = true;
    }
}

// Replays the media currently loaded in the player
function replayMedia() {
    resetPlayer();
    mediaPlayer.play();
}

// Update the progress bar
//
// This function works out how much of the media has played via the
// duration and currentTime parameters.  It then updates the progress
// bar.  For browsers that don't support the progress element, it
// updates the progress bar's text.

function updateProgressBar() {
    var percentage = Math.floor((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
    
    if ( percentage > 0 ) {
	progressBar.value = percentage;
	progressBar.innerHTML = percentage + '% played';
    }
}

// Updates a button's title, innerHTML and CSS class to a certain value
function changeButtonType(btn, value) {
    btn.title = value;
    btn.innerHTML = value;
    btn.className = value;
}

// Loads a video item into the media player.  If the <video> tag is not set to
// autoplay, you can change the line below to keep the play/pause button at
// 'play'
function loadVideo() {
    var file = arguments[0];
    var ext = arguments[1];
    
    mediaPlayer.src = arguments[0];
    mediaPlayer.load();
    changeButtonType(playPauseBtn, 'pause');
    // openFullscreen();
}

// Resets the media player
//
// This function resets the progress bar to zero, moves the
// media back to the start, and returns the play button to "play".
function resetPlayer() {
    progressBar.value = 0;
    mediaPlayer.currentTime = 0;
    changeButtonType(playPauseBtn, 'play');
}
