import { fetchAlbums, fetchLatestSongs, fetchMostPlayedSongs } from './musicService.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Display placeholders and then fetch and display albums
    displayPlaceholders('album-row');
    const albums = await fetchAlbums();
    replacePlaceholdersWithData('album-row', albums);

    // Display placeholders and then fetch and display latest songs
    displayPlaceholders('latest-songs-row');
    const latestSongs = await fetchLatestSongs();
    replacePlaceholdersWithData('latest-songs-row', latestSongs);

    // Display placeholders and then fetch and display most played songs
    displayPlaceholders('most-played-songs-row');
    const mostPlayedSongs = await fetchMostPlayedSongs();
    replacePlaceholdersWithData('most-played-songs-row', mostPlayedSongs);

    // Initialize navigation
    initializeMusicNavigation();
});

function displayPlaceholders(rowId) {
    const row = document.getElementById(rowId);
    for (let i = 0; i < 6; i++) {  // Display 6 placeholders per row
        const placeholder = document.createElement("div");
        placeholder.classList.add("placeholder-tile");
        placeholder.innerHTML = `
            <div class="placeholder-img"></div>
            <div class="placeholder-title"></div>
        `;
        row.appendChild(placeholder);
    }
}

function replacePlaceholdersWithData(rowId, musicItems) {
    const row = document.getElementById(rowId);
    row.innerHTML = ''; // Clear placeholders

    // Check if musicItems is an array
    if (Array.isArray(musicItems)) {
        musicItems.forEach((item, index) => {
            const tile = document.createElement("div");
            tile.classList.add("music-tile");
            tile.setAttribute("data-index", index);
            tile.setAttribute("data-title", item.title);
            tile.setAttribute("data-url", item.stream_url || item.url); // Assuming stream_url or url is the URL for playback
            tile.innerHTML = `
                <img src="${item.artwork_url}" alt="${item.title}">
                <div class="title">${item.title}</div>
            `;
            row.appendChild(tile);
        });
    } else {
        console.error("Expected an array but received:", musicItems);
    }
}

function initializeMusicNavigation() {
    let selectedSectionIndex = 0;
    let selectedItemIndex = 0;
    const musicSections = ['album-row', 'latest-songs-row', 'most-played-songs-row'];

    if (musicSections.length > 0) {
        const firstRow = document.getElementById(musicSections[selectedSectionIndex]);
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
                playSelectedMusic();
                break;
            case "Escape":
                goBack();
                break;
        }
    });

    function navigateSections(step) {
        const currentRow = document.getElementById(musicSections[selectedSectionIndex]);
        const currentTiles = currentRow.querySelectorAll(".music-tile");

        if (currentTiles.length > 0) {
            currentTiles[selectedItemIndex].classList.remove("selected");
        }

        selectedSectionIndex = (selectedSectionIndex + step + musicSections.length) % musicSections.length;
        selectedItemIndex = 0; // Reset item index to 0 when moving to a new section

        const newRow = document.getElementById(musicSections[selectedSectionIndex]);
        const newTiles = newRow.querySelectorAll(".music-tile");

        if (newTiles.length > 0) {
            newTiles[selectedItemIndex].classList.add("selected");
            scrollToSection(newRow);
        }
    }

    function navigateItems(step) {
        const currentRow = document.getElementById(musicSections[selectedSectionIndex]);
        const currentTiles = currentRow.querySelectorAll(".music-tile");

        if (currentTiles.length > 0) {
            currentTiles[selectedItemIndex].classList.remove("selected");
            selectedItemIndex = (selectedItemIndex + step + currentTiles.length) % currentTiles.length;
            currentTiles[selectedItemIndex].classList.add("selected");

            scrollToTile(currentRow, currentTiles[selectedItemIndex]);
        }
    }

    function playSelectedMusic() {
        const selectedTile = document.querySelector(".music-tile.selected");
        const musicUrl = selectedTile.getAttribute("data-url");
        const musicTitle = selectedTile.getAttribute("data-title");

        // Redirect to the player page with the track's title and URL as query parameters
        window.location.href = `musicPlayer.html?title=${encodeURIComponent(musicTitle)}&src=${encodeURIComponent(musicUrl)}`;
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

function goBack() {
    window.history.back();
}
