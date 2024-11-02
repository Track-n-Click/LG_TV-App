document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
});

function initializeHeader() {
  setupNavbarScroll();
  setupProfileButtonListeners();
  setupInputListeners();
}

let isModalOpen = false;
let isKeyboardVisible = false;
let selectedRow = 0;
let selectedCol = 0;
let activeInputIndex = 0;
let selectedButton = "settings";

function setupNavbarScroll() {
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      navbar.style.top = "-100px";
    } else {
      navbar.style.top = "0";
    }
    lastScrollTop = scrollTop;
  });
}

function setupProfileButtonListeners() {
  document
    .getElementById("profile-button")
    .addEventListener("click", openLoginModal);

  // Close the modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("login-modal")) {
      closeLoginModal();
    }
  });
}

function handleEscapeKey(event) {
  if (event.key === "Escape" && isKeyboardVisible) {
    closeKeyboard();
  } else if (
    event.key === "Escape" &&
    document.getElementById("login-modal").style.display === "block"
  ) {
    closeLoginModal();
  }
}

async function openLoginModal() {
  document.getElementById("login-modal").style.display = "block";
  document.body.classList.add("no-scroll"); // Disable background scroll
  setupLoginModalNavigation(); // Setup navigation within the modal
  setupInputListeners(); // Make sure input listeners are set
  // generateKeyboard(); // Generate and display the keyboard
  isModalOpen = true; // Set modal state to open
  focusInput(0); // Focus the first input after the keyboard loads
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
  document.body.classList.remove("no-scroll"); // Enable background scroll
  document.removeEventListener("keydown", handleEscapeKey); // Remove Escape key listener when modal closes
  removeModalNavigation(); // Remove navigation keydown listeners
  isModalOpen = false; // Set modal state to closed
  closeKeyboard(); // Close the keyboard if modal is closed
}

// Focus on a specific input in the modal
function focusInput(index) {
  const inputs = document.querySelectorAll("#login-modal input");
  if (inputs[index]) {
    inputs[index].focus();
    inputs[index].scrollIntoView({ behavior: "smooth", block: "center" }); // Ensure input is visible
  }
}

// Setup listeners for the input fields to open the keyboard
function setupInputListeners() {
  const inputFields = document.querySelectorAll("#login-modal input");
  inputFields.forEach((input, index) => {
    input.addEventListener("focus", () => openKeyboard(index)); // Open keyboard on focus
  });
}

// Setup keyboard navigation within the modal
function setupLoginModalNavigation() {
  const focusableElements = [
    document.getElementById("email"),
    document.getElementById("password"),
    document.querySelector(".modal-login-button"),
  ];

  let currentIndex = 0; // Start with the first focusable element

  // Add focusable class to all elements
  focusableElements.forEach((element) => element.classList.add("focusable"));

  // Focus the first element when the modal opens
  focusElement(currentIndex);

  // Handle arrow key navigation within modal
  function handleKeyDown(event) {
    if (isKeyboardVisible) return; // Ignore key events if keyboard is visible

    if (document.getElementById("login-modal").style.display === "block") {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (event.key === "ArrowUp") {
          currentIndex =
            (currentIndex - 1 + focusableElements.length) %
            focusableElements.length;
        } else if (event.key === "ArrowDown") {
          currentIndex = (currentIndex + 1) % focusableElements.length;
        }
        focusElement(currentIndex);
        event.preventDefault(); // Prevent default scrolling
      } else if (event.key === "Enter") {
        handleEnterKeyForModal(focusableElements[currentIndex]);
        event.preventDefault(); // Prevent default form submission
      }
    }
  }

  // Attach the listener
  document.addEventListener("keydown", handleKeyDown);

  // Function to remove the listener
  function removeNavigationListener() {
    document.removeEventListener("keydown", handleKeyDown);
  }

  document.getElementById("login-modal").removeNavigationListener =
    removeNavigationListener;
}

// Removes keydown listeners for modal navigation
function removeModalNavigation() {
  if (document.getElementById("login-modal").removeNavigationListener) {
    document.getElementById("login-modal").removeNavigationListener();
  }
}

// Focuses the specified element
function focusElement(index) {
  const element = document.querySelectorAll(".focusable")[index];
  if (element) {
    element.focus();
  }
}

// Handle actions when pressing the Enter key within the modal
function handleEnterKeyForModal(element) {
  if (isKeyboardVisible) return; // Disable form submission when keyboard is active

  if (element.id === "email" || element.id === "password") {
    element.focus(); // Focus the current input field
  } else if (element.classList.contains("modal-login-button")) {
    verifyLoginAndRedirect(); // Trigger login verification
  }
}

// Function to verify login and redirect
function verifyLoginAndRedirect() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "test@example.com" && password === "password") {
    alert("Login successful! Redirecting...");
    window.location.href = "index.html"; // Redirect to the app.html page
  } else {
    alert("Invalid email or password. Please try again.");
  }
}

// ---- On-screen Keyboard Code ---- //
const keyboardLayout = [
  [
    { key: "1" },
    { key: "2" },
    { key: "3" },
    { key: "4" },
    { key: "5" },
    { key: "6" },
    { key: "7" },
    { key: "8" },
    { key: "9" },
    { key: "0" },
    { key: "-", label: "=" },
    { key: "backspace" },
  ],
  [
    { key: "tab" },
    { key: "q" },
    { key: "w" },
    { key: "e" },
    { key: "r" },
    { key: "t" },
    { key: "y" },
    { key: "u" },
    { key: "i" },
    { key: "o" },
    { key: "p" },
    { key: "[" },
    { key: "]" },
    { key: "\\" },
  ],
  [
    { key: "caps" },
    { key: "a" },
    { key: "s" },
    { key: "d" },
    { key: "f" },
    { key: "g" },
    { key: "h" },
    { key: "j" },
    { key: "k" },
    { key: "l" },
    { key: ";" },
    { key: "'", label: '"' },
    { key: "enter" },
  ],
  [
    { key: "shift" },
    { key: "z" },
    { key: "x" },
    { key: "c" },
    { key: "v" },
    { key: "b" },
    { key: "n" },
    { key: "m" },
    { key: "," },
    { key: "." },
    { key: "/" },
    { key: "shift" },
  ],
  [{ key: ".com" }, { key: "@" }, { key: "SPACE", w: 600 }],
];

function generateKeyboard() {
  const keyboardContainer = document.getElementById("on-screen-keyboard");
  keyboardContainer.innerHTML = ""; // Clear existing keyboard

  keyboardLayout.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    rowDiv.setAttribute("data-row", rowIndex); // Set row attribute

    row.forEach((key, keyIndex) => {
      const keyDiv = document.createElement("div");
      keyDiv.classList.add("keyboard-key");
      keyDiv.setAttribute("data-key", key.key);
      keyDiv.setAttribute("data-col", keyIndex); // Set column attribute
      keyDiv.textContent = key.label || key.key; // If there's a label, use it; otherwise, use the key itself

      // Special handling for wide keys like SPACE, ENTER, etc.
      if (key.w) {
        keyDiv.style.width = `${key.w}px`;
      }

      // Add unique styling for special keys like backspace, enter, etc.
      if (["backspace", "enter", "shift", "tab", "caps"].includes(key.key)) {
        keyDiv.classList.add("special-key");
      }

      rowDiv.appendChild(keyDiv);
    });

    keyboardContainer.appendChild(rowDiv);
  });
  keyboardContainer.classList.add("show");

  isKeyboardVisible = true;
  highlightKey(); // Highlight the first key
}

function highlightKey() {
  // Remove current highlights
  document
    .querySelectorAll(".keyboard-key")
    .forEach((key) => key.classList.remove("focused"));

  const selectedKey = document.querySelector(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key[data-col="${selectedCol}"]`
  );
  if (selectedKey) {
    selectedKey.classList.add("focused"); // Add highlight to the selected key
  }
}

function pressKey() {
  const selectedKey = document.querySelector(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key[data-col="${selectedCol}"]`
  );
  const inputField =
    document.querySelectorAll("#login-modal input")[activeInputIndex]; // The current input field

  if (!selectedKey || !inputField) return false; // Make sure both the selected key and input field exist

  if (selectedKey.dataset.key === "backspace") {
    inputField.value = inputField.value.slice(0, -1); // Delete the last character
  } else if (selectedKey.dataset.key === "enter") {
    closeKeyboard(); // Close keyboard when Enter is pressed
    return true;
  } else if (
    selectedKey.dataset.key !== "shift" &&
    selectedKey.dataset.key !== "caps"
  ) {
    inputField.value += selectedKey.dataset.key; // Add the pressed key's value to the input
  }
  return false;
}

function openKeyboard(inputIndex) {
  const keyboard = document.getElementById("on-screen-keyboard");
  if (!isKeyboardVisible && keyboard) {
    keyboard.classList.remove("show");
    isKeyboardVisible = true;
    activeInputIndex = inputIndex; // Track the input field currently being focused
    selectedRow = 0;
    selectedCol = 0;
    highlightKey(); // Focus the first key
    document.addEventListener("keydown", navigateKeyboard); // Enable arrow key navigation for the keyboard
    // Adjust modal top margin when keyboard opens
    adjustModalForKeyboard(true);
  }
}

function closeKeyboard() {
  const keyboard = document.getElementById("on-screen-keyboard");
  if (keyboard) {
    keyboard.classList.remove("show");
    isKeyboardVisible = false;
    document.removeEventListener("keydown", navigateKeyboard); // Disable arrow key navigation for the keyboard
    // Reset modal top margin when keyboard closes
    adjustModalForKeyboard(false);
  }
}

function adjustModalForKeyboard(isOpen) {
  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.marginTop = isOpen ? "10px" : "150px";
  }
}

// Handle keyboard navigation
function navigateKeyboard(event) {
  if (!isKeyboardVisible) return;

  const numRows = document.querySelectorAll(".keyboard-row").length;
  const numCols = document.querySelectorAll(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key`
  ).length;

  switch (event.key) {
    case "ArrowUp":
      selectedRow = (selectedRow - 1 + numRows) % numRows;
      break;
    case "ArrowDown":
      selectedRow = (selectedRow + 1) % numRows;
      break;
    case "ArrowLeft":
      selectedCol = (selectedCol - 1 + numCols) % numCols; // Cycle left through the columns
      break;
    case "ArrowRight":
      selectedCol = (selectedCol + 1) % numCols; // Cycle right through the columns
      break;
    case "Enter":
      if (pressKey()) {
        closeKeyboard(); // Close keyboard when "Enter" is pressed on the keyboard's "Enter" key
      }
      break;
    case "Escape":
      closeKeyboard(); // Close the keyboard when "Escape" is pressed
      break;
    default:
      return; // Ignore other keys
  }
  highlightKey(); // Update the visual highlight on the keyboard
  event.preventDefault(); // Prevent default behavior
}
// ---- Settings and Profile Navigation Code ---- //

function selectSettingsButton() {
  document.getElementById("settings-button").classList.add("selected");
}

function deselectSettingsButton() {
  document.getElementById("settings-button").classList.remove("selected");
}

function selectProfileButton() {
  document.getElementById("profile-button").classList.add("selected");
}

function deselectProfileButton() {
  document.getElementById("profile-button").classList.remove("selected");
}

// Handle navigation between settings and profile buttons
function handleSettingsProfileNavigation(key) {
  if (key === "ArrowRight") {
    selectProfileButton();
    deselectSettingsButton();
    scrollToElement(document.getElementById("profile-button"));
  } else if (key === "ArrowLeft") {
    selectSettingsButton();
    deselectProfileButton();
    scrollToElement(document.getElementById("settings-button"));
  }
}

function scrollToElement(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

// calling login
// Show the PIN or Credentials login form based on the selection
document.getElementById("login-via-pin").addEventListener("click", () => {
  document.getElementById("login-options").style.display = "none";
  document.getElementById("pin-login-form").style.display = "block";
  generateKeyboard(); // Generate and display the keyboard
});

document
  .getElementById("login-via-credentials")
  .addEventListener("click", () => {
    document.getElementById("login-options").style.display = "none";
    document.getElementById("credentials-login-form").style.display = "block";
    generateKeyboard(); // Generate and display the keyboard
  });

// Function to go back to the login options
function goBack() {
  document.getElementById("pin-login-form").style.display = "none";
  document.getElementById("credentials-login-form").style.display = "none";
  document.getElementById("login-options").style.display = "flex";
  closeKeyboard(); // Close the keyboard if modal is closed
}

// Function to submit PIN login using fetch
const pinInput = document.getElementById("pin");
const errorMessageContainer = document.getElementById("pin-error-message");

// Function to validate PIN input
function validatePinInput() {
  const pin = pinInput.value;
  console.log("pin", pin);
  // Check if the PIN is valid (6 digits and only numbers)
  if (pin !== '' && !/^\d+$/.test(pin)) {
    errorMessageContainer.textContent =
      "Please enter a valid 6-digit PIN (numbers only).";
  } else {
    errorMessageContainer.textContent = ""; // Clear error if valid
  }
}
// Add event listener for input changes
pinInput.addEventListener("input", validatePinInput);

function submitPinLogin() {
  const pin = document.getElementById("pin").value;
  // Clear previous error messages
  errorMessageContainer.textContent = "";

  // Final check before submission
  if (pin !== '' && !/^\d+$/.test(pin)) {
    errorMessageContainer.textContent =
      "Please enter a valid 6-digit PIN (numbers only).";
    return; // Exit the function if the PIN is invalid
  }
  let data = JSON.stringify({ pin: pin });

  fetch("https://dapi.ayozat.co.uk/api/auth/verify-pin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => console.log(JSON.stringify(data)))
    .catch((error) => console.log(error));
}

// Function to submit Credentials login using fetch
function submitCredentialsLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let data = JSON.stringify({ email: email, password: password });

  fetch("https://dapi.ayozat.co.uk/api/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => console.log(JSON.stringify(data)))
    .catch((error) => console.log(error));
}
