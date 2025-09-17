/* Assign buttons */
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

/* Assign Progress bar */
const progressBar = document.getElementById("progress-bar");
const currentProgress = document.getElementById("current-progress");

/* Assign Text Elements */
const currentTime = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");

/* Assign Audio */
const audio = document.getElementById("audio");
let duration = null;
audio.addEventListener("loadedmetadata", () => {
  maxDuration.textContent = formatTime(audio.duration);
  duration = audio.duration;
});

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

playBtn.addEventListener("click", play);
pauseBtn.addEventListener("click", pause);

loop();

let songPath = "static/Been_Through_It.mp3";

function play() {
  if (songPath) {
    audio.src = songPath;
    audio.load();

    // change song info
    songName.textContent = songPath
      .trim()
      .slice(7)
      .replaceAll("_", " ")
      .split(".")[0];

    currentProgress.style.width = 0;

    songPath = null;
  } else {
    console.log("No song path given in play function...Playing loaded song!");
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
  if (!audio.paused && duration && !audio.ended) {
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
