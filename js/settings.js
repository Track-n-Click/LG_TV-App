let selectedIndex = 0;

window.addEventListener("load", () => {
    initializeSettings();
});

function initializeSettings() {
    const items = getSettingsItems();
    updateSelection(selectedIndex); // Initialize the first setting as selected

    items.forEach((item, index) => {
        item.addEventListener("click", () => {
            handleSelection(item.getAttribute("data-action"));
        });
    });
}

function updateSelection(index) {
    const items = getSettingsItems();
    if (items.length === 0) return;

    deselectAll();
    selectedIndex = (index + items.length) % items.length;
    select(items[selectedIndex]);
}

function handleSelection(action) {
    switch (action) {
        case "video-quality":
            console.log("Selected Video Quality");
            // Implement your specific action
            break;
        case "audio-output":
            console.log("Selected Audio Output");
            // Implement your specific action
            break;
        case "network":
            console.log("Selected Network");
            // Implement your specific action
            break;
        case "display":
            console.log("Selected Display Settings");
            // Implement your specific action
            break;
        case "language":
            console.log("Selected Language");
            // Implement your specific action
            break;
        case "reset":
            console.log("Selected Reset Settings");
            // Implement your specific action
            break;
        default:
            console.log("Unknown action");
            break;
    }
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "Enter":
            handleSelection(getSettingsItems()[selectedIndex].getAttribute("data-action"));
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
    if (selectedIndex >= 3) {
        updateSelection(selectedIndex - 3); // Move up by 3 positions (assuming 3 columns)
    }
}

function handleArrowDown() {
    const items = getSettingsItems();
    if (selectedIndex < items.length - 3) {
        updateSelection(selectedIndex + 3); // Move down by 3 positions
    }
}

function handleArrowNavigation(key) {
    const step = key === "ArrowLeft" ? -1 : 1;
    navigate(step);
}

function navigate(step) {
    const items = getSettingsItems();
    if (items.length === 0) return;

    const newIndex = (selectedIndex + step + items.length) % items.length;
    updateSelection(newIndex);
}

function select(item) {
    item.classList.add("selected");
}

function deselectAll() {
    const items = getSettingsItems();
    items.forEach(item => item.classList.remove("selected"));
}

function getSettingsItems() {
    return Array.from(document.getElementsByClassName("settings-item"));
}
