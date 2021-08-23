const RANDOM_CONTENT_URL = "http://metaphorpsum.com/paragraphs/1/10";

const inputFieldElement = document.getElementById("inputField");
const timerElement = document.getElementById("timer");
const refreshBtn = document.getElementById("refresh");
const contentElement = document.getElementById("words");

let timerStart = false;
let currentWord = 0;
let timerTime;
let words;

let misspelledWords = [];
let correctTypedWords = [];

// GETTING DATA FROM API
async function fetchContent() {
  // Create an XMLHttpRequest object
  const xhttp = new XMLHttpRequest();

  // Define a callback function
  xhttp.onload = function () {
    const data = this.responseText;
    updateContentElement(data);
  };

  // Send a request
  xhttp.open("GET", RANDOM_CONTENT_URL);
  xhttp.send();
}

// UPDATE CONTENT OF Content Element
function updateContentElement(data) {
  const words = data.split(" ");
  words.forEach((word) => {
    const spanElement = document.createElement("span");
    spanElement.innerText = word;
    contentElement.appendChild(spanElement);
  });
  const spanElementHighlight = contentElement.querySelector("span");
  spanElementHighlight.classList.add("highlight");
}
// CALLING FETCH CONTENT TO UPDATE DATA
fetchContent();

// Calculate RESULTS AND GIVING THE DATA TO showResults
function calculateResults() {
  let correctTypedCharacter = 0;
  let incorrectTypedCharacter = 0;
  const incorrectTypedWord = misspelledWords.length;
  const correctTypedWord = correctTypedWords.length;
  for (const word of correctTypedWords) {
    correctTypedCharacter += word.characters();
  }
  for (const word of misspelledWords) {
    incorrectTypedCharacter += word.characters();
  }
  const totalCharactersTyped = correctTypedCharacter + incorrectTypedCharacter;
  const speedWPM = Math.floor(correctTypedCharacter / 5 / 1);
  const accuracy = (correctTypedCharacter / totalCharactersTyped) * 100;
  console.log(
    speedWPM,
    accuracy,
    correctTypedCharacter,
    incorrectTypedCharacter,
    incorrectTypedCharacter,
    incorrectTypedWord
  );
  showResults(
    speedWPM,
    accuracy.toFixed(1),
    correctTypedCharacter,
    correctTypedWord,
    incorrectTypedCharacter,
    incorrectTypedWord
  );
}

// GETTING DATA FROM CALCULATE RESULTS AND UPDAING DATA OF DOM
function showResults(
  speed,
  accuracy,
  correctCharacters,
  correctWords,
  incorrectCharacters,
  incorrectWords
) {
  const speedElement = document.getElementById("speed");
  const accuracyElement = document.getElementById("accuracy");
  const corretCharacterElement = document.getElementById("correctCharaters");
  const correctWordsElement = document.getElementById("correctWords");
  const incorrectCharatersElement =
    document.getElementById("incorrectCharaters");
  const incorrectWordsElement = document.getElementById("incorrectwords");

  speedElement.innerText = speed;
  accuracyElement.innerText = accuracy + "%";
  corretCharacterElement.innerText = correctCharacters;
  correctWordsElement.innerText = correctWords;
  incorrectCharatersElement.innerText = incorrectCharacters;
  incorrectWordsElement.innerText = incorrectWords;
}

// CLEARING DATA AND DISABLING INPUT FIELD WHEN TIME END
function clearAll() {
  inputFieldElement.setAttribute("disabled", "true");
  contentElement.innerText = null;
}

// UPDAING TIME
function updateTimer() {
  const timerUpdate = setInterval(() => {
    const remainingTime = timerTime--;
    timerElement.innerText = `00:${remainingTime}`;
    if (remainingTime == 0) {
      timerElement.innerText = `00:${remainingTime}0`;
      clearInterval(timerUpdate);
      clearAll();
      calculateResults();
    }
  }, 1000);
}

// HANDLING INPUT EVENT TO CALCUATE SPEED
inputFieldElement.addEventListener("keydown", (e) => {
  if (!timerStart) {
    timerTime = 59;
    timerStart = true;
    updateTimer();
  }

  let spanElements = contentElement.querySelectorAll("span");
  let spanElementText = spanElements[currentWord].innerText;
  let spanNextToType = spanElements[currentWord].nextElementSibling.offsetLeft;
  if (e.key === " ") {
    spanElements[currentWord].classList.remove("highlight");
    if (spanElements[currentWord].offsetLeft > spanNextToType) {
      let transformTop = contentElement.style
        .getPropertyValue("--transformTop")
        .slice(0, -2);
      contentElement.style.setProperty(
        "--transformTop",
        `${-42 + Number(transformTop)}px`
      );
    }
    if (spanElementText == inputFieldElement.value) {
      spanElements[currentWord].classList.add("correct");
      spanElements[currentWord].classList.remove("incorrect");
      const correctTypedWord = {
        id: currentWord,
        word: spanElementText,
        characters() {
          return this.word.length;
        },
      };
      correctTypedWords.push(correctTypedWord);
    } else if (spanElementText !== inputFieldElement.value) {
      spanElements[currentWord].classList.add("incorrect");
      spanElements[currentWord].classList.remove("correct");
      const misspelledWord = {
        id: currentWord,
        word: spanElementText,
        characters() {
          return this.word.length;
        },
      };
      misspelledWords.push(misspelledWord);
    }
    currentWord++;
    spanElements[currentWord].classList.add("highlight");
  }
});

// CHECKING ERRORS AND UPDAING CONTENT DATA
inputFieldElement.addEventListener("keyup", (e) => {
  if (e.key === " ") {
    inputFieldElement.value = null;
  }
  let spanElements = contentElement.querySelectorAll("span");
  let inputFieldElementTypedValue = inputFieldElement.value.length;
  let spanElementText = spanElements[currentWord].innerText.slice(
    0,
    inputFieldElementTypedValue
  );
  if (spanElementText !== inputFieldElement.value) {
    spanElements[currentWord].classList.remove("correct");
    spanElements[currentWord].classList.add("incorrect");
  } else if (spanElementText === inputFieldElement.value) {
    spanElements[currentWord].classList.remove("incorrect");
  }
});

// REFRESHING BUTTON RESETS ALL VALUE TO DEFAULT
refreshBtn.addEventListener("click", () => {
  contentElement.innerText = null;
  contentElement.style.setProperty("--transformTop", 0);
  fetchContent();
  timerStart = false;
  timerElement.innerText = "01:00";
  inputFieldElement.removeAttribute("disabled");
  inputFieldElement.value = null;
  currentWord = 0;
  misspelledWords = [];
  correctTypedWords = [];
});
