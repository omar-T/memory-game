document.addEventListener("DOMContentLoaded", () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA0Cma6g6PH3eIY4jOyUTQ36T2ndmwfS6s",
    authDomain: "memory-game-19956.firebaseapp.com",
    projectId: "memory-game-19956",
    storageBucket: "memory-game-19956.appspot.com",
    messagingSenderId: "473042407504",
    appId: "1:473042407504:web:fe92915a923448b7720155",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
});

// Function to save player's data to Firebase
function savePlayerData(name, difficulty, finalScore) {
  firebase
    .firestore()
    .collection("scores")
    .add({
      name,
      difficulty,
      score: finalScore,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
      console.log("Data: ", docRef);
    })
    .catch((error) => {
      console.error("Error adding data: ", error);
    });
}

// GAME SETTINGS LOGIC
const difficultyLevels = document.querySelectorAll(".difficulty-level");
const startButton = document.getElementById("start-game");
let selectedDifficulty = "";
// Player's name input
const playerNameInput = document.getElementById("player-name");

// GAME LOGIC
let gameStarted = false;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
const timerDisplay = document.getElementById("timer"); // Replace 'timer' with your HTML element ID
const scoreDisplay = document.getElementById("score"); // Replace 'score' with your HTML element ID

// SCORE SYSTEM
let startTime;
let timerInterval;
let finalScore;

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

// GAME CREATION LOGIC
// Event listener for start button
startButton.addEventListener("click", () => {
  if (!selectedDifficulty) return alert("Please select a difficulty!");

  createGameBoard(selectedDifficulty);
});

function resetGame() {
  gameStarted = false;
  timerDisplay.textContent = `Time: 0s`;
  scoreDisplay.textContent = `Score: 0`;
  startTime = undefined;
  finalScore = undefined;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = undefined;
  }
}

function createGameBoard(difficulty) {
  let totalCards = 0;
  let columns = 0;
  let rows = 0;

  resetGame();

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

  const memoryGameSectionContent = document.querySelector(
    ".memory-game .game-content"
  );
  memoryGameSectionContent.innerHTML = ""; // Clear previous cards if any

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

    memoryGameSectionContent.appendChild(card);
  }

  // Update styles for memory-card
  const memoryCards = document.querySelectorAll(".memory-card");
  memoryCards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * totalCards);
    card.style.order = randomPos;
    card.style.setProperty("--columns", columns);
    card.style.setProperty("--rows", rows);

    card.addEventListener("click", flipCard);
  });
}

// GAME LOGIC
function flipCard() {
  if (!gameStarted) {
    startTimer(); // Start the timer on the first move
    gameStarted = true;
  }

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

  // Check if all cards are matched, then end the game
  if (allCardsMatched()) {
    endGame();
  }
}

function checkForMatch() {
  const firstDataSet = firstCard.dataset.framework;
  const secondDataSet = secondCard.dataset.framework;

  if (firstDataSet === secondDataSet) {
    disableCards();
    return;
  }

  unflipCards();
}

function allCardsMatched() {
  const memoryCards = document.querySelectorAll(".memory-card");
  return [...memoryCards].every((card) => card.classList.contains("matched"));
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

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

// SCORE SYSTEM
function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Time in seconds, rounded down

  // Display elapsed time wherever you want in your UI
  timerDisplay.textContent = `Time: ${elapsedTime}s`;
}

function endGame() {
  clearInterval(timerInterval); // Stop the timer
  const currentTime = new Date().getTime();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Time in seconds

  finalScore = calculateScore(elapsedTime, selectedDifficulty);

  // Display elapsed time wherever you want in your UI
  scoreDisplay.textContent = `Score: ${finalScore}`;

  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    console.log("Player canceled or did not enter a name.");
    return;
  }

  savePlayerData(playerName, selectedDifficulty, finalScore);
}

function calculateScore(elapsedTime, difficulty) {
  let baseScore;

  // Assign base scores based on difficulty
  switch (difficulty) {
    case "beginner":
      baseScore = 1000;
      break;
    case "intermediate":
      baseScore = 1500;
      break;
    case "expert":
      baseScore = 2000;
      break;
    default:
      baseScore = 1000; // Default base score
      break;
  }

  const timePenalty = 10; // Deduct 10 points for every second
  const finalScore = Math.max(0, baseScore - elapsedTime * timePenalty); // Calculate score

  return finalScore;
}
