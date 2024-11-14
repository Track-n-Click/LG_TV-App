document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
});

function initializeHeader() {
  setupNavbarScroll();
  setupProfileButtonListeners();
  setupInputListeners();
  displayUserProfile();
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
// save user data in local storage
function saveUserData(userData) {
  try {
    if (typeof userData !== "object" || userData === null) {
      throw new Error("Invalid user data. It must be a non-null object.");
    }
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("User data saved to localStorage successfully.");
  } catch (error) {
    console.error("Failed to save user data to local storage:", error);
  }
}
/**
 * Loads user data from local storage and returns it as an object.
 */
function loadUserData() {
  let userData = null;

  try {
    const storedData = localStorage.getItem("userData");
    if (storedData === null || storedData === "undefined") {
      console.warn("User data not found in localStorage.");
      return userData;
    }
    userData = JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to load user data from local storage:", error);
  }
  if (userData && typeof userData === "object") {
    if (!userData.id) {
      console.warn("User data is missing the ID property.");
      return null;
    }
  } else {
    console.warn("User data is invalid or not an object.");
    return null;
  }
  return userData;
}

function setupProfileButtonListeners() {
  document
    .getElementById("profile-button")
    .addEventListener("click", function () {
      const userData = loadUserData();

      if (userData && userData.id) {
        // User is logged in; redirect to profile page
        window.location.href = "pages/profilePage.html"; // Replace with the actual profile page URL
      } else {
        // User is not logged in; open login modal
        openLoginModal();
        console.log("login modal clicked");
      }
    });

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
  document.body.classList.add("no-scroll");
  setupLoginModalNavigation();
  setupInputListeners();
  isModalOpen = true;
  focusInput(0);
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.removeEventListener("keydown", handleEscapeKey);
  removeModalNavigation();
  isModalOpen = false;
  closeKeyboard();
  adjustModalForKeyboard(false);
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
  console.warn("setupLoginModalNavigation initialized");
  // login methods
  let LoginMethodindex = 0;
  const loginMethods = [
    document.getElementById("login-via-pin"),
    document.getElementById("login-via-credentials"),
  ];
  let selectedLoginMethod = loginMethods[LoginMethodindex];
  selectedLoginMethod?.classList.add("modal-login-option-selected");

  // pin mode
  let pinModeQrButtonindex = 0;
  const pinModeQrButtons = [
    document.getElementById("pin-mode-next"),
    document.getElementById("pin-mode-back"),
  ];
  let selectedQrButton = pinModeQrButtons[pinModeQrButtonindex];
  selectedQrButton?.classList.add("modal-login-button-selected");

  let visibleLoginMethod = true;
  let visiblePinModeSelectionMode = false;
  let visiblePinMode = false;
  let visibleCredentialsMode = false;

  // enter pin fields
  let pinFieldIndex = 0;
  let pinFields = [
    document.getElementById("pin"),
    document.getElementById("pin-mode-input-back"),
  ];
  let selectedPinField = pinFields[pinFieldIndex];

  // Handle arrow key navigation within modal
  function handleKeyDown(event) {
    // if (isKeyboardVisible) return; // Ignore key events if keyboard is visible

    if (document.getElementById("login-modal").style.display === "block") {
      if (event.key === "Escape") {
        // goBack();
        // window.history.back();
        if (isKeyboardVisible) {
          closeKeyboard();
        }
      } else {
        if (visibleLoginMethod) {
          isKeyboardVisible = false;
          switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
              handleLoginMethod(event);
              break;
            case "Enter":
              handleEnterForSelectLoginMethod();
              break;
          }
        } else if (visiblePinModeSelectionMode) {
          isKeyboardVisible = false;
          switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
              handleQrSelectButton(event);
              break;
            case "Enter":
              handleEnterForSelectQrButton();
              break;
          }
        } else if (visiblePinMode) {
          //
          if (isKeyboardVisible) {
            navigateKeyboard(event);
          } else {
            handleSelectEnterPinField(event);
            // switch (event.key) {
            //   case "ArrowUp":
            //   case "ArrowDown":
            //     handleSelectEnterPinField(event);
            //     break;
            //   case "Enter":
            //     openKeyboard();
            //     break;
            // }
          }
        } else if (visibleCredentialsMode) {
          // alert("credentials");
        }
      }
    }
  }

  // login model functions
  function handleLoginMethod(event) {
    selectedLoginMethod?.classList.remove("modal-login-option-selected");

    if (event.key === "ArrowRight") {
      LoginMethodindex = (LoginMethodindex + 1) % loginMethods.length;
    } else if (event.key === "ArrowLeft") {
      LoginMethodindex =
        (LoginMethodindex - 1 + loginMethods.length) % loginMethods.length;
    }

    selectedLoginMethod = loginMethods[LoginMethodindex];
    selectedLoginMethod?.classList.add("modal-login-option-selected");
  }

  function handleEnterForSelectLoginMethod() {
    if (selectedLoginMethod) {
      visibleLoginMethod = false;
      if (selectedLoginMethod.id === "login-via-pin") {
        visiblePinModeSelectionMode = true;
      } else if (selectedLoginMethod.id === "login-via-credentials") {
        visibleCredentialsMode = true;
      }
      selectedLoginMethod.click();
    }
  }

  function handleQrSelectButton(event) {
    selectedQrButton?.classList.remove("modal-login-button-selected");
    if (event.key === "ArrowRight") {
      pinModeQrButtonindex =
        (pinModeQrButtonindex + 1) % pinModeQrButtons.length;
    } else if (event.key === "ArrowLeft") {
      pinModeQrButtonindex =
        (pinModeQrButtonindex - 1 + pinModeQrButtons.length) %
        pinModeQrButtons.length;
    }

    selectedQrButton = pinModeQrButtons[pinModeQrButtonindex];
    selectedQrButton?.classList.add("modal-login-button-selected");
  }

  function handleEnterForSelectQrButton() {
    if (selectedQrButton) {
      visiblePinModeSelectionMode = false;
      if (selectedQrButton.id === "pin-mode-next") {
        visiblePinMode = true;
      } else {
        visibleLoginMethod = true;
      }
      selectedQrButton.click();
    }
  }

  function handleSelectEnterPinField(event) {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        if (event.key === "ArrowDown") {
          pinFieldIndex = (pinFieldIndex + 1) % pinFields.length;
        } else if (event.key === "ArrowUp") {
          pinFieldIndex =
            (pinFieldIndex - 1 + pinFields.length) % pinFields.length;
        }

        selectedPinField = pinFields[pinFieldIndex];
        break;
      case "Enter":
        openKeyboard();
        break;
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
// function setupLoginModalNavigation() {
//   const focusableElements = [
//     document.getElementById("email"),
//     document.getElementById("password"),
//     document.querySelector(".modal-login-button"),
//   ];

//   let currentIndex = 0; // Start with the first focusable element

//   // Add focusable class to all elements
//   focusableElements.forEach((element) => element.classList.add("focusable"));

//   // Focus the first element when the modal opens
//   focusElement(currentIndex);

//   // selecting login methods
//   let LoginMethodindex = 0;
//   const loginMethods = [
//     document.getElementById("login-via-pin"),
//     document.getElementById("login-via-credentials"),
//   ];
//   let selectedLoginMethod = loginMethods[0];
//   selectedLoginMethod?.classList.add("modal-login-option-selected");

//   console.log("initite");

//   // Handle arrow key navigation within modal
//   function handleKeyDown(event) {
//     if (isKeyboardVisible) return; // Ignore key events if keyboard is visible

//     if (document.getElementById("login-modal").style.display === "block") {
//       if (event.key === "ArrowUp" || event.key === "ArrowDown") {
//         if (event.key === "ArrowUp") {
//           currentIndex =
//             (currentIndex - 1 + focusableElements.length) %
//             focusableElements.length;
//         } else if (event.key === "ArrowDown") {
//           currentIndex = (currentIndex + 1) % focusableElements.length;
//         }
//         focusElement(currentIndex);
//         event.preventDefault(); // Prevent default scrolling
//       }  else if (event.key === "Enter") {
//         handleEnterKeyForModal(focusableElements[currentIndex]);
//         event.preventDefault(); // Prevent default form submission
//       }
//     }
//   }

//   // Attach the listener
//   document.addEventListener("keydown", handleKeyDown);

//   // Function to remove the listener
//   function removeNavigationListener() {
//     document.removeEventListener("keydown", handleKeyDown);
//   }

//   document.getElementById("login-modal").removeNavigationListener =
//     removeNavigationListener;
// }

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
  if (isKeyboardVisible) return;

  if (element.id === "email" || element.id === "password") {
    element.focus();
  } else if (element.classList.contains("modal-login-button")) {
    submitCredentialsLogin();
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
    { key: "delete" },
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
  adjustModalForKeyboard(true);
  highlightKey();
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

function openKeyboard() {
  const keyboard = document.getElementById("on-screen-keyboard");
  if (!isKeyboardVisible && keyboard) {
    generateKeyboard();
    // keyboard.classList.remove("show");
    // isKeyboardVisible = true;
    // activeInputIndex = inputIndex; // Track the input field currently being focused
    // selectedRow = 0;
    // selectedCol = 0;
    // highlightKey(); // Focus the first key
    // document.addEventListener("keydown", navigateKeyboard); // Enable arrow key navigation for the keyboard
    // // Adjust modal top margin when keyboard opens
    // adjustModalForKeyboard(true);
  }
}

function closeKeyboard() {
  const keyboard = document.getElementById("on-screen-keyboard");
  if (keyboard) {
    keyboard.classList.remove("show");
    isKeyboardVisible = false;
    document.removeEventListener("keydown", navigateKeyboard);
    adjustModalForKeyboard(false);
  }
}

function adjustModalForKeyboard(isOpen) {
  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.marginTop = isOpen ? "50px" : "150px";
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
  document.getElementById("qr-login-section").style.display = "block";
});

document
  .getElementById("login-via-credentials")
  .addEventListener("click", () => {
    document.getElementById("login-options").style.display = "none";
    document.getElementById("credentials-login-form").style.display = "block";
    generateKeyboard();
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
  if (pin !== "" && !/^\d+$/.test(pin)) {
    errorMessageContainer.textContent =
      "Please enter a valid 6-digit PIN (numbers only).";
  } else {
    errorMessageContainer.textContent = ""; // Clear error if valid
  }

  if (pin.length == 6) {
    submitPinLogin();
  }
}
// Add event listener for input changes
pinInput.addEventListener("input", validatePinInput);

function showPinForm() {
  document.getElementById("qr-login-section").style.display = "none";
  document.getElementById("pin-login-section").style.display = "block";
  generateKeyboard();
}

function showQrCode() {
  document.getElementById("pin-login-section").style.display = "none";
  document.getElementById("qr-login-section").style.display = "block";
  closeKeyboard(); // Close the keyboard if modal is closed
}

function submitPinLogin() {
  document.getElementById("pin-login-section").style.display = "none";
  document.getElementById("loading-screen").style.display = "block";
  const pin = document.getElementById("pin").value;
  // Clear previous error messages
  errorMessageContainer.textContent = "";

  // Final check before submission
  if (pin !== "" && !/^\d+$/.test(pin)) {
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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      saveUserData(data.user);
      console.log(data);
      displayUserProfile();
      closeLoginModal();
    })
    .catch((error) => {
      console.log(error);
      // Display a generic error message for failed login attempts
      displayLoginError(
        "pin",
        "Login Failed. Please enter a valid 6-digit PIN and try again."
      );
      document.getElementById("pin-login-section").style.display = "block";
      document.getElementById("loading-screen").style.display = "none";
    });
}

// Function to submit Credentials login using fetch
function submitCredentialsLogin() {
  document.getElementById("pin-login-section").style.display = "none";
  document.getElementById("loading-screen").style.display = "block";
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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // console.log(JSON.stringify(data));
      saveUserData(data.data.user);
      displayUserProfile();
      closeLoginModal();
    })
    .catch((error) => {
      console.log(error);
      displayLoginError(
        "credentials",
        "Login Failed. Please check your credentials and try again."
      );
      document.getElementById("pin-login-section").style.display = "block";
      document.getElementById("loading-screen").style.display = "none";
    });
}
function displayLoginError(type, messsage) {
  if (type === "pin") {
    const errorMessageContainer = document.getElementById("pin-error-message");
    errorMessageContainer.textContent = messsage;
  } else if (type === "credentials") {
    const errorMessageContainer = document.getElementById(
      "credentials-error-message"
    );
    errorMessageContainer.textContent = messsage;
  }
}
function displayUserProfile() {
  const profileButton = document.getElementById("profile-button");
  const profileImage = document.getElementById("profile-image");
  const userIcon = document.getElementById("user-icon");

  // Retrieve user data from local storage
  const userData = loadUserData();

  if (userData && userData.artwork_url) {
    // assuming 'profileImageUrl' holds the image URL
    profileImage.src = userData.artwork_url;
    profileImage.style.display = "block";
    userIcon.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayUserProfile();
});
