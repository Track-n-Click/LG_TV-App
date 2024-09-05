document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
});

function initializeHeader() {
  setupNavbarScroll();
  setupProfileButtonListeners();
}

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
  if (event.key === "Escape" && document.getElementById("login-modal").style.display === "block") {
    closeLoginModal();
  }
}

function openLoginModal() {
  document.getElementById("login-modal").style.display = "block";
  document.body.classList.add("no-scroll"); // Disable background scroll
  setupLoginModalNavigation(); // Setup navigation within the modal
  document.addEventListener("keydown", handleEscapeKey); // Add Escape key listener when modal opens
  focusInput(0); // Automatically focus the first input when the modal opens
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
  document.body.classList.remove("no-scroll"); // Enable background scroll
  document.removeEventListener("keydown", handleEscapeKey); // Remove Escape key listener when modal closes
  removeModalNavigation(); // Remove navigation keydown listeners
}

// Focus on a specific input in the modal
function focusInput(index) {
  const inputs = document.querySelectorAll("#login-modal input");
  if (inputs[index]) {
    inputs[index].focus();
    inputs[index].scrollIntoView({ behavior: "smooth", block: "center" }); // Ensure input is visible
  }
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

  // Handle arrow key navigation
  function handleKeyDown(event) {
    if (document.getElementById("login-modal").style.display === "block") {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (event.key === "ArrowUp") {
          currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
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

  // Store function to remove the listener later
  document.getElementById("login-modal").removeNavigationListener = removeNavigationListener;
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

  // Perform basic login verification (replace with actual logic)
  if (email === "test@example.com" && password === "password") {
    alert("Login successful! Redirecting...");
    window.location.href = "app.html"; // Redirect to the app.html page
  } else {
    alert("Invalid email or password. Please try again.");
  }
}

// Select and deselect functions for settings and profile
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
