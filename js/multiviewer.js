const videoUrls = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscape.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
];

const videoTitles = [
    "Big Buck Bunny",
    "Elephants Dream",
    "Sintel",
    "Tears of Steel",
    "For Bigger Blazes",
    "For Bigger Escape",
    "For Bigger Fun",
    "For Bigger Joyrides",
    "For Bigger Meltdowns",
    "Subaru Outback",
    "Volkswagen GTI Review",
    "We Are Going On Bullrun"
];

const imageUrl = "../images/a_logo.png"; // Placeholder image URL

let videos = [];
let rows = 4;
let cols = 3;
let playing = true;

function createVideos() {
    let main = document.getElementById("main");

    // Get the full viewport dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    let videoWidth = width / cols;
    let videoHeight = height / rows;

    main.innerHTML = "";
    videos = [];

    for (let i = 0; i < rows * cols; i++) {
        let row = Math.floor(i / cols);
        let col = i % cols;

        if (row === 1 && col === 1) {
            // Place an image in the middle (1,1 position for 4x3 grid)
            let imageContainer = document.createElement("div");
            imageContainer.style.position = "absolute";
            imageContainer.style.top = (row * videoHeight) + "px";
            imageContainer.style.left = (col * videoWidth) + "px";
            imageContainer.style.width = videoWidth + "px";
            imageContainer.style.height = videoHeight + "px";
            imageContainer.style.overflow = "hidden";
            imageContainer.style.display = "flex";
            imageContainer.style.justifyContent = "center";
            imageContainer.style.alignItems = "center";
            imageContainer.style.backgroundColor = "black";

            let img = document.createElement("img");
            img.src = imageUrl;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            img.style.objectFit = "contain"; // Ensure the image fits without cropping

            imageContainer.appendChild(img);
            main.appendChild(imageContainer);
        } else {
            // Create video elements for all other positions
            let videoContainer = document.createElement("div");
            videoContainer.style.position = "absolute";
            videoContainer.style.top = (row * videoHeight) + "px";
            videoContainer.style.left = (col * videoWidth) + "px";
            videoContainer.style.width = videoWidth + "px";
            videoContainer.style.height = videoHeight + "px";
            videoContainer.style.overflow = "hidden";
            videoContainer.style.backgroundColor = "black"; // Adds a black background behind the video

            let video = document.createElement("video");
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "contain"; // Ensure the entire video is visible without cropping

            video.autoplay = "autoplay";
            video.loop = "loop";
            video.setAttribute("src", videoUrls[i % videoUrls.length]);
            video.volume = 0.0;
            video.load();

            let titleOverlay = document.createElement("div");
            titleOverlay.innerText = videoTitles[i % videoTitles.length];
            titleOverlay.style.position = "absolute";
            titleOverlay.style.bottom = "10px";
            titleOverlay.style.left = "0";
            titleOverlay.style.width = "100%";
            titleOverlay.style.color = "white";
            titleOverlay.style.textAlign = "center";
            titleOverlay.style.fontSize = "18px";
            titleOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black background for the title

            videoContainer.appendChild(video);
            videoContainer.appendChild(titleOverlay);
            main.appendChild(videoContainer);
            videos.push(video);
        }
    }

    updatePlaying();
}

function updatePlaying() {
    videos.forEach((video) => playing ? video.play() : video.pause());
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "Enter": enter(); break;
        default: return;
    }
    event.preventDefault();
});

// Set up the main container to occupy the full screen
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.overflow = "hidden";
document.documentElement.style.overflow = "hidden";
document.documentElement.style.height = "100%";
document.body.style.height = "100%";

let main = document.createElement("div");
main.id = "main";
main.style.position = "relative";
main.style.width = "100vw";
main.style.height = "100vh";
document.body.appendChild(main);

createVideos();

function goBack() {
    window.history.back();
}


document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "Enter":
            enter();
            break;
        case "Escape":
            goBack();
            break;
        default:
            return;
    }
    event.preventDefault();
});

function enter() {
    playing = !playing;
    updatePlaying();
  }