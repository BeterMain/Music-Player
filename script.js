/* Song Class */
class Song {
  constructor(path, artist, cover) {
    (this.path = path), (this.artist = artist), (this.cover = cover);
    this.name = path.trim().slice(7).replaceAll("-", " ").split(".")[0];
  }
}

/* Assign buttons */
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const playlistBtn = document.getElementById("playlist");

/* Assign Progress bar */
const progressBar = document.getElementById("progress-bar");
const currentProgress = document.getElementById("current-progress");

/* Assign Text Elements */
const currentTime = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");

/* Assign Image Elements */
const songImage = document.getElementById("song-image");

/* Assign Audio */
const audio = document.getElementById("audio");
let duration = null;
audio.addEventListener("loadedmetadata", () => {
  maxDuration.textContent = formatTime(audio.duration);
  duration = audio.duration;
});
audio.addEventListener("ended", () => {
  if (!shuffle && !audio.loop) {
    playNext();
  } else if (shuffle && !audio.loop) {
    playlistIndex = getRandomIntInclusive(0, playlist.length - 1);
    currentSong = playlist[playlistIndex];

    play();
  }
});

/* Add event listners */
prevBtn.addEventListener("click", playPrev);
nextBtn.addEventListener("click", playNext);

progressBar.addEventListener("click", (event) => {
  const rect = currentProgress.getBoundingClientRect();

  // Change width style of current bar to be how far the click is from the right
  audio.currentTime =
    duration * ((event.clientX - rect.left) / progressBar.offsetWidth);
});

repeatBtn.addEventListener("click", () => {
  audio.loop = !audio.loop;
  if (audio.loop) {
    repeatBtn.style.color = "blue";
  } else repeatBtn.style.color = "#949494";
});

shuffleBtn.addEventListener("click", toggleShuffle);

playBtn.addEventListener("click", play);
pauseBtn.addEventListener("click", pause);

loop(); // Allows the song data to update with song

// Put song data here for playlist
const playlist = [
  new Song("static/Song-1.ogg", "Artist 1", "static/1.png"),
  new Song("static/Song-2.ogg", "Artist 2", "static/2.png"),
  new Song("static/Song-3.ogg", "Artist 3", "static/3.png"),
];
let shuffle = false;
let currentSong = playlist[0]; // Path for current song
let playlistIndex = 0;

function playNext() {
  if (!shuffle) {
    playlistIndex++;
    if (playlistIndex >= playlist.length) playlistIndex = 0;
  } else {
    let prevIndex = playlistIndex;
    while (playlistIndex == prevIndex) {
      playlistIndex = getRandomIntInclusive(0, playlist.length - 1);
    }
  }

  currentSong = playlist[playlistIndex];
  play();
}

function playPrev() {
  playlistIndex--;

  shuffle = false;

  if (playlistIndex < 0) {
    playlistIndex = playlist.length - 1;
  }

  currentSong = playlist[playlistIndex];
  play();
}

function toggleShuffle() {
  shuffle = !shuffle;
  if (shuffle) {
    shuffleBtn.style.color = "blue";
  } else shuffleBtn.style.color = "#949494";
}

function play() {
  if (currentSong) {
    audio.src = currentSong.path;
    audio.load();

    // change song info
    songName.textContent = currentSong.name;
    songArtist.textContent = currentSong.artist;
    songImage.src = currentSong.cover;

    currentProgress.style.width = 0;

    currentSong = null;
  }

  // change buttons
  playBtn.classList.add("hide");
  pauseBtn.classList.remove("hide");

  // play song
  audio.play();
}

function pause() {
  // change buttons
  playBtn.classList.remove("hide");
  pauseBtn.classList.add("hide");

  audio.pause();
}

function loop() {
  if (duration) {
    currentProgress.style.width = `${(audio.currentTime / duration) * 100}%`;
    currentTime.textContent = formatTime(audio.currentTime);
  }

  requestAnimationFrame(loop);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60); // whole minutes
  const secs = Math.floor(seconds % 60); // leftover seconds
  const paddedSecs = secs.toString().padStart(2, "0"); // add leading 0 if <10
  return `${mins}:${paddedSecs}`;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
