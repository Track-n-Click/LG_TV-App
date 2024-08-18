document.addEventListener("DOMContentLoaded", () => {
  const gameCards = document.querySelectorAll(".game-card");
  let currentIndex = 0;

  if (gameCards.length > 0) {
    // Initially focus on the first card
    gameCards[currentIndex].classList.add("selected");
  }

  document.addEventListener("keydown", (e) => {
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
        openSelectedGame();
        break;
      case "Escape":
        goBack();
        break;
    }
  });

  function navigate(step) {
    if (gameCards.length > 0) {
      gameCards[currentIndex].classList.remove("selected");
      currentIndex =
        (currentIndex + step + gameCards.length) % gameCards.length;
      gameCards[currentIndex].classList.add("selected");
      gameCards[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function navigateRow(step) {
    const cols = getNumberOfColumns();
    if (gameCards.length > 0 && cols > 0) {
      gameCards[currentIndex].classList.remove("selected");
      const newIndex = currentIndex + step * cols;
      if (newIndex >= 0 && newIndex < gameCards.length) {
        currentIndex = newIndex;
        gameCards[currentIndex].classList.add("selected");
        gameCards[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        // Wrap around if at the end of the row
        if (step > 0) {
          currentIndex = Math.min(gameCards.length - 1, currentIndex + step);
        } else {
          currentIndex = Math.max(0, currentIndex + step);
        }
        gameCards[currentIndex].classList.add("selected");
        gameCards[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }

  function getNumberOfColumns() {
    const cardWidth = gameCards[0].offsetWidth;
    const gridWidth = document.querySelector(".games-grid").offsetWidth;
    return Math.floor(gridWidth / cardWidth);
  }

  function openSelectedGame() {
    const selectedCard = document.querySelector(".game-card.selected");
    if (selectedCard) {
      window.location.href = selectedCard.getAttribute("href");
    }
  }
});

function goBack() {
  window.history.back();
}