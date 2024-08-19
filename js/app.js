let selectedIndex = 0;
let settingsSelected = false;

window.addEventListener("load", async () => {
  try {
    // Initialize senza and UI
    await senza.init();
    initializeTiles();

    document.getElementById("progress-bar").style.width = "100%";
    setTimeout(function () {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main").style.display = "block";
    }, 1000);

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
    item.addEventListener("click", () => {
      redirect(item.getAttribute("data-page"));
    });
  });

  // Add click listener for the settings button
  document.getElementById("settings-button").addEventListener("click", () => {
    redirect("pages/settings.html");
  });
}

function updateSelection(index) {
  const items = getItems();
  if (items.length === 0) return;

  deselectAll(); // Deselect all items before selecting the new one
  if (settingsSelected) {
    selectSettingsButton(); // Select the settings button if settingsSelected is true
  } else {
    selectedIndex = (index + items.length) % items.length; // Ensure the index wraps around
    select(items[selectedIndex]); // Select the new one
  }
}

function redirect(page) {
  if (page) {
    window.location.href = page; // Redirect to the specified page
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Enter":
      if (settingsSelected) {
        redirect("pages/settings.html");
      } else {
        const items = getItems();
        if (items[selectedIndex]) {
          redirect(items[selectedIndex].getAttribute("data-page"));
        }
      }
      break;
    case "Escape":
      goBack();
      break;
    case "ArrowUp":
      handleArrowUp();
      break;
    case "ArrowDown":
      handleArrowDown();
      break;
    case "ArrowLeft":
    case "ArrowRight":
      handleArrowNavigation(event.key);
      break;
    default:
      return;
  }
  event.preventDefault();
});

function handleArrowUp() {
  if (settingsSelected) {
    // Prevents moving up if the settings button is selected
    settingsSelected = false;
    updateSelection(0); // Move focus to the first row
  } else if (selectedIndex < 5) {
    // Move focus to the settings button when pressing up from the first row
    settingsSelected = true;
    deselectAll();
    selectSettingsButton();
  } else {
    updateSelection(selectedIndex - 5); // Move up to the item directly above
  }
}

function handleArrowDown() {
  const items = getItems();
  if (settingsSelected) {
    settingsSelected = false;
    updateSelection(0); // Move focus to the first row
  } else if (selectedIndex >= items.length - 5) {
    // Prevent moving down when on the last row
    return;
  } else {
    updateSelection(selectedIndex + 5); // Move down to the item directly below
  }
}

function handleArrowNavigation(key) {
  if (settingsSelected && key === "ArrowDown") {
    settingsSelected = false;
    updateSelection(0); // Move focus back to the first item
  } else if (!settingsSelected) {
    const step = key === "ArrowLeft" ? -1 : 1;
    navigate(step);
  }
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

function deselectAll() {
  const items = getItems();
  items.forEach((item) => item.classList.remove("selected"));
  deselectSettingsButton();
}

function selectSettingsButton() {
  const settingsButton = document.getElementById("settings-button");
  settingsButton.classList.add("selected"); // Add a class to highlight the settings button
}

function deselectSettingsButton() {
  const settingsButton = document.getElementById("settings-button");
  settingsButton.classList.remove("selected"); // Remove the highlight class
}

function scrollToMiddle(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

function getItems() {
  return Array.from(document.getElementsByClassName("grid-item"));
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
