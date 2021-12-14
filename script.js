const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const playbackSpeed = document.querySelector('.player-speed');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const fullscreenIcon = document.getElementById('fullscreen-icon');


// Play & Pause ----------------------------------- //

function toggleIcon(state) {
    if (state === 'play') {
        playBtn.classList.replace('fa-pause', 'fa-play');
        playBtn.setAttribute('title', 'Play');
    }
    if (state === 'pause') {
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
    }
}

function togglePlayPause() {
    if (video.paused) {
        toggleIcon('pause');
        video.play();

    } else {
        toggleIcon('play');
        video.pause();
    }
}

// On video end, show play icon
video.addEventListener('ended', toggleIcon('play'));



// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
    let minutes = Math.floor(time/60);
    let seconds = Math.floor(time%60);
    // Ternary operator
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    
    return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
    progressBar.style.width = `${video.currentTime/video.duration*100}%`;
    currentTime.textContent = `${displayTime(video.currentTime)} /`;
    duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
    const newProgress = e.offsetX/progressRange.offsetWidth;
    progressBar.style.width = `${newProgress*100}%`;
    video.currentTime = newProgress*video.duration;
}



// Volume Controls --------------------------- //

let lastVolume = 1;
let lastVolumeIcon = '';

// Volume bar
function updateVolumeIcon() {
    // Change icon depending on volumeIcon
    volumeIcon.className = '';
    if (volume > 0.75) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (volume <= 0.75 && volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-off');
    }
}

function changeVolume(e) {
    volume = e.offsetX/volumeRange.offsetWidth;
    // Rounding volume up or down
    if (volume < 0.1) {
        volume = 0;
    }
    if (volume > 0.9) {
        volume = 1;
    }
    volumeBar.style.width = `${volume*100}%`;
    video.volume = volume;
    lastVolume = volume;
    lastVolumeIcon = volumeIcon.className.split('fas ')[1];
    updateVolumeIcon();
}

// Mute/Unmute
function toggleMute() {
    if (video.volume) {
        lastVolume = video.volume;
        lastVolumeIcon = volumeIcon.className.split('fas ')[1];
        video.volume = 0;
        volumeBar.style.width = 0;
        volumeIcon.classList.replace(`${volumeIcon.className.split('fas ')[1]}`, 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
    } else {
        volumeBar.style.width = `${lastVolume*100}%`;
        video.volume = lastVolume;
        volumeIcon.classList.replace('fa-volume-mute', `${lastVolumeIcon}`)
        volumeIcon.setAttribute('title', 'Mute');
    }
}



// Change Playback Speed -------------------- //

function changeSpeed() {
    video.playbackRate = playbackSpeed.value;
}


// Fullscreen ------------------------------- //

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

// View in fullscreen
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  video.classList.add('video-fullscreen');
}

// Close fullscreen
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove('video-fullscreen');
}

let fullscreen = false;

// Toggle fullscreen
function toggleFullscreen() {
    if (!fullscreen) {
        openFullscreen(player);
        fullscreenIcon.classList.replace('fa-expand', 'fa-compress');
        fullscreenIcon.setAttribute('title', 'Compress');
    } else {
        closeFullscreen();
        fullscreenIcon.classList.replace('fa-compress', 'fa-expand');
        fullscreenIcon.setAttribute('title', 'Fullscreen');
    }
    fullscreen = !fullscreen;
}

// Event listeners
playBtn.addEventListener('click', togglePlayPause);
video.addEventListener('click', togglePlayPause);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
playbackSpeed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);