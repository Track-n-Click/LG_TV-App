let selectedIndex = 0;

window.addEventListener("load", async () => {
  try {
    // Initialize senza and UI
    await senza.init();
    initializeTiles();

    // Hide the loader and display the main content after the initialization is complete
    document.getElementById("progress-bar").style.width = "100%";
    setTimeout(function () {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main").style.display = "block";
    }, 1);

    senza.remotePlayer.addEventListener("ended", () => {
      senza.lifecycle.moveToForeground();
    });

    senza.uiReady();
  } catch (error) {
    console.error("Error initializing:", error);
  }
});

function initializeTiles() {
  const items = getItems();
  updateSelection(selectedIndex); // Initialize the first tile as selected

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      redirect(item.getAttribute('data-page'));
    });
  });
}

function updateSelection(index) {
  const items = getItems();
  if (items.length === 0) return;
  
  deselect(items[selectedIndex]); // Deselect the current one
  selectedIndex = (index + items.length) % items.length; // Ensure the index wraps around
  select(items[selectedIndex]); // Select the new one
}

function redirect(page) {
  if (page) {
    window.location.href = page; // Redirect to the specified page
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Enter":
      const items = getItems();
      if (items[selectedIndex]) {
        redirect(items[selectedIndex].getAttribute('data-page'));
      }
      break;
    case "Escape":
      goBack();
      break;
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      handleArrowNavigation(event.key);
      break;
    default:
      return;
  }
  event.preventDefault();
});

function getItems() {
  return Array.from(document.getElementsByClassName("grid-item"));
}

function handleArrowNavigation(key) {
  const step = key === "ArrowUp" || key === "ArrowLeft" ? -1 : 1;
  navigate(step);
}

function navigate(step) {
  const items = getItems();
  if (items.length === 0) return;

  const newIndex = (selectedIndex + step + items.length) % items.length;
  updateSelection(newIndex);
  scrollToMiddle(items[selectedIndex]);
}

function select(item) {
  item.classList.add("selected");
}

function deselect(item) {
  item.classList.remove("selected");
}

function scrollToMiddle(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

// Loader functionality
window.addEventListener("load", function () {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "100%";
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main").style.display = "block";
  }, 4000); // Adjust timing as needed
});

// -------------------------------- Common function -------------------------------- 
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
