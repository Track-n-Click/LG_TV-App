document.addEventListener("DOMContentLoaded", () => {
    const videoGridContainer = document.getElementById('video-grid-container');

    // Load video tiles
    videos.forEach((video, index) => {
        const tile = document.createElement('div');
        tile.classList.add('video-tile');
        if (index === 0) {
            tile.classList.add('selected');
        }
        tile.setAttribute('data-index', index);
        tile.setAttribute('data-url', video.url);
        tile.innerHTML = `
            <img src="${video.thumb}" alt="${video.title}">
            <div class="title">${video.title}</div>
        `;
        videoGridContainer.appendChild(tile);
    });

    // Initialize navigation
    initializeMediaNavigation();
});

// Function to initialize navigation and handle key events
function initializeMediaNavigation() {
    let selectedIndex = 0;
    const videoTiles = document.querySelectorAll('.video-tile');

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                navigate(-1);
                break;
            case 'ArrowRight':
                navigate(1);
                break;
            case 'Enter':
                playSelectedVideo();
                break;
            case 'Escape':
                goBack();
                break;
        }
    });

    function navigate(step) {
        videoTiles[selectedIndex].classList.remove('selected');
        selectedIndex = (selectedIndex + step + videoTiles.length) % videoTiles.length;
        videoTiles[selectedIndex].classList.add('selected');
        scrollToTile(videoTiles[selectedIndex]);
    }

    function playSelectedVideo() {
        const selectedTile = document.querySelector('.video-tile.selected');
        const videoUrl = selectedTile.getAttribute('data-url');
        toggleVideo(videoUrl);
    }

    function scrollToTile(tile) {
        tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

async function toggleVideo(url) {
    const currentState = await senza.lifecycle.getState();
    if (currentState === "background" || currentState === "inTransitionToBackground") {
        senza.lifecycle.moveToForeground();
    } else {
        await playVideo(url);
    }
}

async function playVideo(url) {
    try {
        await senza.remotePlayer.load(url);
        senza.remotePlayer.play();
    } catch (error) {
        console.log("Couldn't load remote player.", error);
    }
}

function goBack() {
    window.history.back();
}
