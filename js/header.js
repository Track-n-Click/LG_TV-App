document.addEventListener("DOMContentLoaded", () => {
  // Scroll functionality for navbar
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

  // Function to open the login modal
  function openLoginModal() {
    document.getElementById("login-modal").style.display = "block";
    focusInput(0); // Automatically focus the first input when the modal opens
  }

  // Function to close the login modal
  function closeLoginModal() {
    document.getElementById("login-modal").style.display = "none";
  }

  // Function to redirect pages
  function redirect(page) {
    if (page) {
      window.location.href = page; // Redirect to the specified page
    }
  }

  // Focus on a specific input in the modal
  function focusInput(index) {
    const inputs = document.querySelectorAll("#login-modal input");
    if (inputs[index]) {
      inputs[index].focus();
      inputs[index].scrollIntoView({ behavior: "smooth", block: "center" }); // Ensure input is visible
    }
  }

  // Event listeners for profile button to open modal
  document.getElementById("profile-button").addEventListener("click", openLoginModal);

  // Close the modal when clicking the close button
  document.getElementById("close-modal").addEventListener("click", closeLoginModal);

  // Close the modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target == document.getElementById("login-modal")) {
      closeLoginModal();
    }
  });

  // Handle key navigation and actions within the modal
  document.addEventListener("keydown", (event) => {
    if (document.getElementById("login-modal").style.display === "block") {
      handleModalNavigation(event);
    } else {
      handleGeneralNavigation(event);
    }
    event.preventDefault();
  });

  // General navigation handler
  function handleGeneralNavigation(event) {
    switch (event.key) {
      case "Enter":
        handleEnterKey();
        break;
      case "Escape":
        closeLoginModal();
        break;
      default:
        return;
    }
  }

  // Handle Enter key to open modal or submit form
  function handleEnterKey() {
    if (document.activeElement === document.getElementById("profile-button")) {
      openLoginModal(); // Open the modal when "Enter" is pressed on the profile button
    } else if (document.getElementById("login-modal").style.display === "block") {
      document.querySelector(".modal-login-button").click(); // Submit the form
    }
  }

  // Handle arrow key navigation within the modal
  function handleModalNavigation(event) {
    const inputs = document.querySelectorAll("#login-modal input");
    let currentIndex = Array.from(inputs).findIndex(
      (el) => el === document.activeElement
    );

    switch (event.key) {
      case "ArrowUp":
        if (currentIndex > 0) {
          focusInput(currentIndex - 1); // Navigate up
        }
        break;
      case "ArrowDown":
        if (currentIndex < inputs.length - 1) {
          focusInput(currentIndex + 1); // Navigate down
        }
        break;
      case "Enter":
        if (document.activeElement.tagName === "INPUT") {
          document.activeElement.click(); // Simulate enter key click on input
        }
        break;
      case "Escape":
        closeLoginModal();
        break;
      default:
        break;
    }
  }
});
