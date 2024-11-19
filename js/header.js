document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
});

function initializeHeader() {
  setupNavbarScroll();
  setupProfileButtonListeners();
  // setupInputListeners();
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
  const userData = loadUserData();

  if (userData && userData.id) {
    // User is logged in; redirect to profile page
    window.location.href = "pages/profilePage.html"; // Replace with the actual profile page URL
  } else {
    // User is not logged in; open login modal
    document.getElementById("login-modal").style.display = "block";
    document.body.classList.add("no-scroll");
    setupLoginModalNavigation();
    // setupInputListeners();
    isModalOpen = true;
    // focusInput(0);
    console.log("login modal clicked");
  }
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
// function focusInput(index) {
//   const inputs = document.querySelectorAll("#login-modal input");
//   if (inputs[index]) {
//     inputs[index].focus();
//     inputs[index].scrollIntoView({ behavior: "smooth", block: "center" }); // Ensure input is visible
//   }
// }

// Setup listeners for the input fields to open the keyboard
// function setupInputListeners() {
//   const inputFields = document.querySelectorAll("#login-modal input");
//   inputFields.forEach((input, index) => {
//     input.addEventListener("focus", () => openKeyboard(index)); // Open keyboard on focus
//   });
// }

// Setup keyboard navigation within the modal
function setupLoginModalNavigation() {
  console.warn("setupLoginModalNavigation initialized");

  let visibleLoginMethod = true;
  let visiblePinMode = false;
  let visibleCredentialsMode = false;

  // login methods
  let LoginMethodindex = 0;
  const loginMethods = [
    document.getElementById("login-via-pin"),
    document.getElementById("login-via-credentials"),
  ];
  let selectedLoginMethod = loginMethods[LoginMethodindex];
  selectedLoginMethod?.classList.add("modal-login-option-selected");

  // pin mode
  let pinFieldIndex = 0;
  let pinFields = [
    document.getElementById("pin"),
    document.getElementById("pin-mode-input-back"),
  ];
  let selectedPinField = pinFields[pinFieldIndex];

  // credentials mode
  let credentialsFieldIndex = 0;
  let credentialsFields = [
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("credentials-submit-button"),
    document.getElementById("credentials-back-button"),
  ];
  let selectedCredentialsField = credentialsFields[credentialsFieldIndex];

  // Handle arrow key navigation within modal
  function handleKeyDown(event) {
    // if (isKeyboardVisible) return; // Ignore key events if keyboard is visible

    if (document.getElementById("login-modal").style.display === "block") {
      if (event.key === "Escape") {
        if (isKeyboardVisible) {
          closeKeyboard();
        } else {
          closeLoginModal();
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
        } else if (visiblePinMode) {
          if (isKeyboardVisible) {
            navigateKeyboard(event, selectedPinField);
            if (
              selectedPinField?.id === "pin" &&
              selectedPinField?.value.length === 6
            ) {
              validatePinInput();
            }
          } else {
            handleSelectEnterPinField(event);
          }
        } else if (visibleCredentialsMode) {
          if (isKeyboardVisible) {
            navigateKeyboard(event, selectedCredentialsField);
          } else {
            handleSelectEnterCredentialsField(event);
          }
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
        selectedPinField = pinFields[0];
        selectedPinField.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        selectedPinField.style.border = "2px solid var(--primary-color)";

        visiblePinMode = true;
      } else if (selectedLoginMethod.id === "login-via-credentials") {
        selectedCredentialsField = credentialsFields[0];
        selectedCredentialsField.style.backgroundColor =
          "rgba(255, 255, 255, 0.1)";
        selectedCredentialsField.style.border =
          "2px solid var(--primary-color)";
        visibleCredentialsMode = true;
      }
      selectedLoginMethod.click();
    }
  }

  function handleSelectEnterPinField(event) {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        if (selectedPinField.id === "pin") {
          selectedPinField.style.backgroundColor = "";
          selectedPinField.style.border = "";
          selectedPinField.blur();
        } else {
          selectedPinField?.classList.remove("modal-login-button-selected");
        }

        if (event.key === "ArrowDown") {
          pinFieldIndex = (pinFieldIndex + 1) % pinFields.length;
        } else if (event.key === "ArrowUp") {
          pinFieldIndex =
            (pinFieldIndex - 1 + pinFields.length) % pinFields.length;
        }

        selectedPinField = pinFields[pinFieldIndex];

        if (selectedPinField.id === "pin") {
          console.warn(selectedPinField.id);
          selectedPinField?.classList.remove("modal-login-button-selected");
          selectedPinField.focus();
        } else {
          console.warn(selectedPinField.id);
          selectedPinField?.classList.add("modal-login-button-selected");
        }
        break;
      case "Enter":
        if (selectedPinField.id === "pin-mode-input-back") {
          visiblePinMode = false;
          visibleLoginMethod = true;
          document.getElementById("pin").value = "";
          selectedPinField?.classList.remove("modal-login-button-selected");
          selectedPinField.click();
        } else {
          openKeyboard();
        }
        break;
    }
  }

  function handleSelectEnterCredentialsField(event) {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        if (
          selectedCredentialsField.id === "email" ||
          selectedCredentialsField.id === "password"
        ) {
          selectedCredentialsField.blur();
          selectedCredentialsField.style.backgroundColor = "";
          selectedCredentialsField.style.border = "";
        } else {
          selectedCredentialsField?.classList.remove(
            "modal-login-button-selected"
          );
        }

        if (event.key === "ArrowDown") {
          credentialsFieldIndex =
            (credentialsFieldIndex + 1) % credentialsFields.length;
        } else if (event.key === "ArrowUp") {
          credentialsFieldIndex =
            (credentialsFieldIndex - 1 + credentialsFields.length) %
            credentialsFields.length;
        }

        selectedCredentialsField = credentialsFields[credentialsFieldIndex];

        if (
          selectedCredentialsField.id === "email" ||
          selectedCredentialsField.id === "password"
        ) {
          selectedCredentialsField.style.backgroundColor =
            "rgba(255, 255, 255, 0.1)";
          selectedCredentialsField.style.border =
            "2px solid var(--primary-color)";
        } else {
          selectedCredentialsField?.classList.add(
            "modal-login-button-selected"
          );
        }
        break;
      case "Enter":
        if (
          selectedCredentialsField.id === "email" ||
          selectedCredentialsField.id === "password"
        ) {
          selectedCredentialsField.focus();
          openKeyboard();
        } else if (selectedCredentialsField.id === "credentials-back-button") {
          visibleCredentialsMode = false;
          visibleLoginMethod = true;
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
          selectedCredentialsField?.classList.remove(
            "modal-login-button-selected"
          );
          selectedCredentialsField.click();
        } else if (
          selectedCredentialsField.id === "credentials-submit-button"
        ) {
          selectedCredentialsField.click();
        }
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

// Removes keydown listeners for modal navigation
function removeModalNavigation() {
  if (document.getElementById("login-modal").removeNavigationListener) {
    document.getElementById("login-modal").removeNavigationListener();
  }
}

// Focuses the specified element
// function focusElement(index) {
//   const element = document.querySelectorAll(".focusable")[index];
//   if (element) {
//     element.focus();
//   }
// }

// // Handle actions when pressing the Enter key within the modal
// function handleEnterKeyForModal(element) {
//   if (isKeyboardVisible) return;

//   if (element.id === "email" || element.id === "password") {
//     element.focus();
//   } else if (element.classList.contains("modal-login-button")) {
//     submitCredentialsLogin();
//   }
// }

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
      if (["delete", "enter", "shift", "tab", "caps"].includes(key.key)) {
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

function pressKey(inputField) {
  const selectedKey = document.querySelector(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key[data-col="${selectedCol}"]`
  );
  // const inputField =
  //   document.querySelectorAll("#login-modal input")[activeInputIndex]; // The current input field

  if (!selectedKey || !inputField) return false; // Make sure both the selected key and input field exist

  if (selectedKey.dataset.key === "delete") {
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
function navigateKeyboard(event, inputField) {
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
      if (pressKey(inputField)) {
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

//fuction to toggle modal size
function toggleModalSize() {
  const modalContent = document.querySelector(".modal-content");
  const pinLoginForm = document.getElementById("pin-login-form");

  if (pinLoginForm.style.display === "block") {
    modalContent.style.width = "50%";
  } else {
    modalContent.style.width = "30%";
  }
}

// calling login
// Show the PIN or Credentials login form based on the selection
document.getElementById("login-via-pin").addEventListener("click", () => {
  document.getElementById("login-options").style.display = "none";
  document.getElementById("pin-login-form").style.display = "block";
  toggleModalSize();
});

document
  .getElementById("login-via-credentials")
  .addEventListener("click", () => {
    document.getElementById("login-options").style.display = "none";
    document.getElementById("credentials-login-form").style.display = "block";
    // generateKeyboard();
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

pinInput.addEventListener("change", function (e) {
  console.warn(e.target.value);
});

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
// // Add event listener for input changes
// pinInput.addEventListener("input", validatePinInput);

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
    // Display profile image and hide user icon
    profileImage.src = userData.artwork_url;
    profileImage.style.display = "block";
    userIcon.style.display = "none";
  } else {
    // Hide profile image and show user icon
    profileImage.style.display = "none";
    userIcon.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayUserProfile();
});

function handlHeaderFromAnotherPage(key, selectedSectionId){
  if(selectedSectionId !== "header-placeholder"){
    deselectSettingsButton();
    deselectProfileButton()
  }  
  else{
    const element = document.querySelector('#login-modal');
    const displayStyle = window.getComputedStyle(element).display;

    if((key==="ArrowLeft" || key==="ArrowRight") && displayStyle !== "block"){
      handleSettingsProfileNavigation(key)
    }
    else if(key==="Enter"){
      if(document.getElementById("profile-button").classList.contains("selected")){
        // alert("profile-button")
        openLoginModal();
      }
      else{
        alert("settings-button")
      }
      // openLoginModal()
    }
  }
}
