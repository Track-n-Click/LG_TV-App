document.addEventListener("DOMContentLoaded", async () => {
  const gameCards = document.querySelectorAll(".game-card");
  let currentIndex = 0;
  let selectedSectionIndex = 1;
  const mediaSections = [
    {
      id: "header-placeholder",
      leftArrow: null,
      rightArrow: null,
    },
    {
      id: "hero-container",
      leftArrow: null,
      rightArrow: null,
    },
    {
      id: "grid2-container",
      leftArrow: null,
      rightArrow: null,
    }
  ];

  document.addEventListener("keydown", (e) => {
    if (isModalOpen) {
      return; // Skip further processing if the modal is open
    }

    switch (e.key) {
      case "ArrowRight":
        navigate(1);
        break;
      case "ArrowLeft":
        navigate(-1);
        break;
      case "ArrowDown":
        navigateRow(1);
        break;
      case "ArrowUp":
        navigateRow(-1);
        break;
      case "Enter":
        handleEnterKey();
        break;
      case "Escape":
        if(mediaSections[selectedSectionIndex].id !== "header-placeholder" || !isModalOpen){
          goBack();
        }
        break;
    }
  });

  function handleEnterKey(){
    // handle login navigation
    if(mediaSections[selectedSectionIndex].id === "header-placeholder"){
      if (
        document.getElementById("profile-button").classList.contains("selected")
      ) {
        openLoginModal();
      } else if (document.getElementById("settings-button").classList.contains("selected")) {
        redirect("settings.html");
      }
    }
    else{
      openSelectedGame();
    }
  }

  function navigate(step) {
    if(mediaSections[selectedSectionIndex].id === "header-placeholder"){
      handleSettingsProfileNavigation(step===1 ? "ArrowRight" : "ArrowLeft");
    } else{
      selectedSectionIndex = 2;
      if (gameCards.length > 0) {
        gameCards[currentIndex].classList.remove("selected");
        currentIndex =
          (currentIndex + step + gameCards.length) % gameCards.length;
        gameCards[currentIndex].classList.add("selected");
        gameCards[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        updateTitle(gameCards[currentIndex]);
      }
    }
  }

  function navigateRow(step) {
    const currentRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );

    selectedSectionIndex =
      (selectedSectionIndex + step + mediaSections.length) %
      mediaSections.length;

      gameCards[currentIndex].classList.remove("selected");

      currentIndex = 0;

    const newRow = document.getElementById(
      mediaSections[selectedSectionIndex].id
    );  

    deselectProfileButton();
    deselectSettingsButton();

    console.warn(mediaSections[selectedSectionIndex].id);

    if (mediaSections[selectedSectionIndex].id === "header-placeholder") {
      scrollToTop(); // Scroll to the top for the hero section
      selectSettingsButton();
    } else if (mediaSections[selectedSectionIndex].id === "grid2-container"){
      gameCards[currentIndex].classList.add("selected");
    }

    // const cols = getNumberOfColumns();
    // if (gameCards.length > 0 && cols > 0) {
    //   gameCards[currentIndex].classList.remove("selected");
    //   const newIndex = currentIndex + step * cols;
    //   if (newIndex >= 0 && newIndex < gameCards.length) {
    //     currentIndex = newIndex;
    //   } else {
    //     // Wrap around if at the edge of the grid
    //     currentIndex =
    //       step > 0
    //         ? Math.min(gameCards.length - 1, currentIndex + cols)
    //         : Math.max(0, currentIndex - cols);
    //   }
    //   gameCards[currentIndex].classList.add("selected");
    //   gameCards[currentIndex].scrollIntoView({
    //     behavior: "smooth",
    //     block: "center",
    //   });
    //   updateTitle(gameCards[currentIndex]);
    // }
  }

  function scrollToTop() {
    // Scroll the entire page up to the top for hero section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateTitle(card) {
    const newTitle = card.getAttribute("data-title");
    gameTitle.textContent = newTitle;
  }

  function getNumberOfColumns() {
    const cardWidth = gameCards[0].offsetWidth;
    const gridWidth = document.querySelector("#grid2-container").offsetWidth;
    return Math.floor(gridWidth / cardWidth);
  }

  function openSelectedGame() {
    const selectedCard = document.querySelector(".game-card.selected");
    if (selectedCard) {
      window.location.href = selectedCard.getAttribute("href");
    }
  }

  function goBack() {
    window.history.back();
  }

  try {
    // Initialize senza and UI
    await senza.init();
    initializeTiles();

    senza.remotePlayer.addEventListener("ended", () => {
      senza.lifecycle.moveToForeground();
    });

    senza.uiReady();

    // Loader and progress bar functionality
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = "100%";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main").style.display = "block";
    }, 4000); // Adjust timing as needed
  } catch (error) {
    console.error("Error initializing:", error);
  }
});

window.addEventListener("load", async () => {
  try {
    // Initialize senza and UI
    await senza.init();
    initializeTiles();

    document.getElementById("progress-bar").style.width = "100%";
    setTimeout(function () {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main").style.display = "block";
    }, 3);

    senza.remotePlayer.addEventListener("ended", () => {
      senza.lifecycle.moveToForeground();
    });

    senza.uiReady();
  } catch (error) {
    console.error("Error initializing:", error);
  }
});
// Loader functionality
window.addEventListener("load", function () {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "100%";
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main").style.display = "block";
  }, 4000); // Adjust timing as needed
});
