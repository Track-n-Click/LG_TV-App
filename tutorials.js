let selected = 0;
let totalCells = 9; // Assuming 3 rows and 3 columns (9 cells)

window.addEventListener("load", async () => {
  try {
    await senza.init();

    updateVideos();

    senza.remotePlayer.addEventListener("ended", () => {
      senza.lifecycle.moveToForeground();
    });

    senza.uiReady();
  } catch (error) {
    console.error(error);
  }
});

function updateVideos() {
  videos.forEach((video, index) => {
    let rowClass = index === selected ? "row selected" : "row";
    table.innerHTML += `<div class="${rowClass}">
      <div class="thumb" onclick="redirect()">
        <img src="${video.thumb}">
      </div>
      <div class="text">
        <div class="title">${video.title}</div>
        
      </div>
    </div>`;
  });
}

function redirect() {
  window.open("https://www.ayozat.com/", "_blank");
}

function redirectToNewPage() {
  window.location.href = "newPage.html";
}

function backToMain() {
  window.location.href = "index.html";
}
// <div class="description">${video.description}</div>

document.addEventListener("keydown", async function (event) {
  switch (event.key) {
    case "Enter":
      toggleVideo();
      // redirect();
      // redirectToNewPage();
      break;
    case "Escape":
      // toggleVideo();
      backToMain();
      break;
    case "ArrowUp":
      up();
      break;
    case "ArrowDown":
      down();
      break;
    case "ArrowLeft":
      left();
      break;
    case "ArrowRight":
      right();
      break;
    default:
      return;
  }
  event.preventDefault();
});

function getRows() {
  return Array.from(document.getElementsByClassName("row"));
}

function up() {
  let rows = getRows();
  deselect(rows[selected]);
  selected = (selected - 3 + totalCells) % totalCells;
  select(rows[selected]);
}

function down() {
  let rows = getRows();
  deselect(rows[selected]);
  selected = (selected + 3) % totalCells;
  select(rows[selected]);
}

function left() {
  let rows = getRows();
  deselect(rows[selected]);
  selected = (selected - 1 + totalCells) % totalCells;
  select(rows[selected]);
}

function right() {
  let rows = getRows();
  deselect(rows[selected]);
  selected = (selected + 1) % totalCells;
  select(rows[selected]);
}

function select(link) {
  link.classList.add("selected");
  scrollToMiddle(link);
  console.log("Selected: " + link.innerHTML);
}

function deselect(link) {
  link.classList.remove("selected");
}

function scrollToMiddle(link) {
  link.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

async function toggleVideo() {
  const currentState = await senza.lifecycle.getState();
  if (
    currentState == "background" ||
    currentState == "inTransitionToBackground"
  ) {
    senza.lifecycle.moveToForeground();
  } else {
    await playVideo(videos[selected].url);
  }
}

async function playVideo(url) {
  try {
    await senza.remotePlayer.load(url);
  } catch (error) {
    console.log("Couldn't load remote player.");
  }
  senza.remotePlayer.play();
}
