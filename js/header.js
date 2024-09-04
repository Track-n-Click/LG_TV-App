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
  document.getElementById("profile-button").addEventListener("click", openLoginModal);
  document.getElementById("close-modal").addEventListener("click", closeLoginModal);
  window.addEventListener("click", (event) => {
    if (event.target == document.getElementById("login-modal")) {
      closeLoginModal();
    }
  });
}

function openLoginModal() {
  document.getElementById("login-modal").style.display = "block";
  focusInput(0); // Automatically focus the first input when the modal opens
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
}

// Focus on a specific input in the modal
function focusInput(index) {
  const inputs = document.querySelectorAll("#login-modal input");
  if (inputs[index]) {
    inputs[index].focus();
    inputs[index].scrollIntoView({ behavior: "smooth", block: "center" }); // Ensure input is visible
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
