const difficultyLevels = document.querySelectorAll(".difficulty-level");
const startButton = document.getElementById("start-game");
let selectedDifficulty = "";

// Event listeners for difficulty selection
difficultyLevels.forEach((level) => {
  level.addEventListener("click", () => {
    // Reset selected style
    difficultyLevels.forEach((el) => el.classList.remove("selected"));
    // Set selected style
    level.classList.add("selected");
    // Store selected difficulty
    selectedDifficulty = level.dataset.value;
  });
});

// Event listener for start button
startButton.addEventListener("click", () => {
  if (selectedDifficulty) {
    createGameBoard(selectedDifficulty);
  } else {
    alert("Please select a difficulty!");
  }
});

function createGameBoard(difficulty) {
  let totalCards = 0;
  let columns = 0;
  let rows = 0;

  // Determine number of cards, columns, and rows based on difficulty
  switch (difficulty) {
    case "beginner":
      totalCards = 12;
      columns = 4;
      rows = 3;
      break;
    case "intermediate":
      totalCards = 24;
      columns = 6;
      rows = 4;
      break;
    case "expert":
      totalCards = 36;
      columns = 6;
      rows = 6;
      break;
    default:
      break;
  }

  const memoryGameSection = document.querySelector(".memory-game");
  memoryGameSection.innerHTML = ""; // Clear previous cards if any

  // Logic to create memory game board with cards
  // Use totalCards, columns, and rows to generate the game board dynamically
  /* ... add more image names here ... */
  const frontFaceImages = [
    "surf",
    "coconut-tree",
    "hotel",
    "ice-cream",
    "milk-tea",
    "polaroid",
    "airplane",
    "emu",
    "suitcase",
    "suv",
    "villa",
    "wallet",
    "bench",
    "lighthouse",
    "map",
    "snow-mountain",
    "sunbathing",
    "take-a-bath",
  ];
  let selectedImages = frontFaceImages.slice(0, totalCards / 2); // Half of the images for pairs
  selectedImages = selectedImages.concat(selectedImages); // Duplicate for pairs

  // Create memory cards dynamically
  for (let i = 0; i < totalCards; i++) {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.framework = selectedImages[i];

    const frontFace = document.createElement("img");
    frontFace.classList.add("front-face");
    frontFace.src = `img/${selectedImages[i]}-svgrepo-com.png`;
    frontFace.alt = selectedImages[i];

    const backFace = document.createElement("img");
    backFace.classList.add("back-face");
    backFace.src = "img/circle-heat-svgrepo-com.png";
    backFace.alt = "circle-heat";

    card.appendChild(frontFace);
    card.appendChild(backFace);

    memoryGameSection.appendChild(card);
  }

  // Update styles for memory-card
  // const memoryCards = document.querySelectorAll(".memory-card");
  const memoryCards = document.querySelectorAll(".memory-card");
  memoryCards.forEach((card) => {
    card.style.setProperty("--columns", columns);
    card.style.setProperty("--rows", rows);
  });

  memoryCards.forEach((card) => card.addEventListener("click", flipCard));

  memoryCards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * totalCards);
    card.style.order = randomPos;
  });
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    // this is the first time the player clicked a card
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // this is the second time the player clicked a card
  secondCard = this;

  // check if cards match
  checkForMatch();
}

function checkForMatch() {
  const firstDataSet = firstCard.dataset.framework;
  const secondDataSet = secondCard.dataset.framework;

  if (firstDataSet === secondDataSet) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
