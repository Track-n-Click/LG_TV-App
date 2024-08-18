import { fetchMovies, fetchTVSeries, fetchTVChannels } from './mediaService.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch and display movies
    const movies = await fetchMovies();
    displayMediaSection('movie-row', movies);

    // Fetch and display TV series
    const tvSeries = await fetchTVSeries();
    displayMediaSection('tv-row', tvSeries);

    // Fetch and display TV channels
    const tvChannels = await fetchTVChannels();
    displayMediaSection('channels-row', tvChannels);

    // Initialize navigation
    initializeMediaNavigation();
});

function displayMediaSection(rowId, mediaItems) {
    const row = document.getElementById(rowId);
    mediaItems.forEach((item, index) => {
        const tile = document.createElement("div");
        tile.classList.add("video-tile");
        tile.setAttribute("data-index", index);
        tile.setAttribute("data-url", item.poster); // Assuming poster is the URL for playback
        tile.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="title">${item.title}</div>
        `;
        row.appendChild(tile);
    });
}

function initializeMediaNavigation() {
    let selectedSectionIndex = 0;
    let selectedItemIndex = 0;
    const mediaSections = ['movie-row', 'tv-row', 'channels-row'];

    if (mediaSections.length > 0) {
        const firstRow = document.getElementById(mediaSections[selectedSectionIndex]);
        if (firstRow && firstRow.children.length > 0) {
            firstRow.children[selectedItemIndex].classList.add("selected");
        }
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                navigateSections(-1);
                break;
            case "ArrowDown":
                navigateSections(1);
                break;
            case "ArrowLeft":
                navigateItems(-1);
                break;
            case "ArrowRight":
                navigateItems(1);
                break;
            case "Enter":
                playSelectedVideo();
                break;
            case "Escape":
                goBack();
                break;
        }
    });

    function navigateSections(step) {
        const currentRow = document.getElementById(mediaSections[selectedSectionIndex]);
        const currentTiles = currentRow.querySelectorAll(".video-tile");

        if (currentTiles.length > 0) {
            currentTiles[selectedItemIndex].classList.remove("selected");
        }

        selectedSectionIndex = (selectedSectionIndex + step + mediaSections.length) % mediaSections.length;
        selectedItemIndex = 0; // Reset item index to 0 when moving to a new section

        const newRow = document.getElementById(mediaSections[selectedSectionIndex]);
        const newTiles = newRow.querySelectorAll(".video-tile");

        if (newTiles.length > 0) {
            newTiles[selectedItemIndex].classList.add("selected");
            scrollToSection(newRow);
        }
    }

    function navigateItems(step) {
        const currentRow = document.getElementById(mediaSections[selectedSectionIndex]);
        const currentTiles = currentRow.querySelectorAll(".video-tile");

        if (currentTiles.length > 0) {
            currentTiles[selectedItemIndex].classList.remove("selected");
            selectedItemIndex = (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
            currentTiles[selectedItemIndex].classList.add("selected");

            scrollToTile(currentRow, currentTiles[selectedItemIndex]);
        }
    }

    function playSelectedVideo() {
        const selectedTile = document.querySelector(".video-tile.selected");
        const videoUrl = selectedTile.getAttribute("data-url");
        toggleVideo(videoUrl);
    }

    function scrollToSection(section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function scrollToTile(row, tile) {
        const tileOffset = tile.offsetLeft;
        const rowWidth = row.clientWidth;
        const tileWidth = tile.clientWidth;

        const scrollPosition = tileOffset - (rowWidth / 2) + (tileWidth / 2);
        row.scrollLeft = scrollPosition;
    }
}

async function toggleVideo(url) {
    const currentState = await senza.lifecycle.getState();
    if (
        currentState === "background" ||
        currentState === "inTransitionToBackground"
    ) {
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
