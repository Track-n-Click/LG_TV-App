let selectedIndex = 0;
const totalCells = 20; // Assuming 3 rows and 3 columns (9 cells)

window.addEventListener("load", async () => {
  try {
    await senza.init();
    updateVideos();

    senza.remotePlayer.addEventListener("ended", () => {
      senza.lifecycle.moveToForeground();
    });

    senza.uiReady();
  } catch (error) {
    console.error("Error initializing:", error);
  }
});

function updateVideos() {
  const table = document.getElementById("table"); // Assuming 'table' is an element ID
  table.innerHTML = ""; // Clear the table before updating
  if (videos.length === 0) return; // Avoid updating if there are no videos
  videos.forEach((video, index) => {
    const rowClass = index === selectedIndex ? "row selected" : "row";
    table.innerHTML += `
      <div class="${rowClass}" data-url="${video.url}">
        <div class="thumb">
          <img src="${video.thumb}">
        </div>
        <div class="text">
          <i class="${video.iconClass}"></i>
          <div class="title">${video.title}</div>
        </div>
      </div>`;
  });
  updateSelection(selectedIndex); // Ensure the correct row is selected
}

function updateSelection(index) {
  const rows = getRows();
  if (rows.length === 0) return;
  deselect(rows[selectedIndex]);
  selectedIndex = Math.max(0, Math.min(index, rows.length - 1));
  select(rows[selectedIndex]);
  selectedUrl = videos[selectedIndex].url;
}

function redirect(url) {
  if (url.endsWith(".html")) {
    window.location.href = url;
  } else {
    window.location.href = url;
  }
}

function goBack() {
  console.log("Going back");
  window.history.back();
}

document.addEventListener("keydown", async (event) => {
  console.log("Key pressed:", event.key);
  switch (event.key) {
    case "Enter":
      if (selectedUrl) {
        console.log("Redirecting to:", selectedUrl);
        redirect(selectedUrl);
      }
      break;
    case "Escape":
      goBack();
      break;
    case "ArrowUp":
      navigate(-5);
      break;
    case "ArrowDown":
      navigate(5);
      break;
    case "ArrowLeft":
      navigate(-1);
      break;
    case "ArrowRight":
      navigate(1);
      break;
    default:
      return;
  }
  event.preventDefault();
});

function getRows() {
  return Array.from(document.getElementsByClassName("row"));
}

function navigate(step) {
  const rows = getRows();
  if (rows.length === 0) return;
  const newIndex = (selectedIndex + step + totalCells) % totalCells;
  updateSelection(newIndex);
  scrollToMiddle(rows[selectedIndex]);
}

function select(row) {
  row.classList.add("selected");
}

function deselect(row) {
  row.classList.remove("selected");
}

function scrollToMiddle(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

async function toggleVideo() {
  const currentState = await senza.lifecycle.getState();
  if (
    currentState === "background" ||
    currentState === "inTransitionToBackground"
  ) {
    senza.lifecycle.moveToForeground();
  } else {
    await playVideo(videos[selectedIndex].url);
  }
}

async function playVideo(url) {
  try {
    await senza.remotePlayer.load(url);
    senza.remotePlayer.play();
  } catch (error) {
    console.error("Couldn't load remote player:", error);
  }
}

window.addEventListener("load", function () {
  // Start the progress bar animation
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "100%";
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main").style.display = "block";
  }, 4000);
});
