// const RANDOM_CONTENT_URL = "http://metaphorpsum.com/paragraphs/1/10";
import "./style.css";
import getData from "./data.js";
const wordsElement = document.getElementById("words");
const timerElement = document.getElementById("timer");

function getDomElement(selector) {
  return document.querySelector(selector);
}

// UPDATE CONTENT OF Content Element
function updateWords(words) {
  words.forEach((word) => {
    const spanElement = document.createElement("span");
    spanElement.innerText = word;
    wordsElement.appendChild(spanElement);
  });
  // Highlighting first word
  wordsElement.querySelector("span").classList.add("highlight");
}

// CALLING GetData TO UPDATE Words
const words = getData();
updateWords(words);

// Calculate RESULTS AND GIVING THE DATA TO showResults
function calculateTypingResults() {
  const cTCharacter = metaData.correctTypedWords.join("").length;
  const iTCharacter = metaData.misspelledWords.join("").length;
  const iTWord = metaData.misspelledWords.length;
  const cTWord = metaData.correctTypedWords.length;
  const totalCharactersTyped = cTCharacter + iTCharacter;
  const speedWPM = Math.floor(cTCharacter / 5 / 1);
  const accuracy = ((cTCharacter / totalCharactersTyped) * 100).toFixed(1);
  showResults(speedWPM, accuracy, cTCharacter, cTWord, iTCharacter, iTWord);
}

// GETTING DATA FROM CALCULATE RESULTS AND UPDAING DATA OF DOM
function showResults(speed, acr, cCharacters, cWords, iCharacters, iWords) {
  getDomElement("#speed").innerText = speed;
  getDomElement("#accuracy").innerText = acr + "%";
  getDomElement("#correctCharaters").innerText = cCharacters;
  getDomElement("#correctWords").innerText = cWords;
  getDomElement("#incorrectCharaters").innerText = iCharacters;
  getDomElement("#incorrectwords").innerText = iWords;
}

let metaData = {
  misspelledWords: [],
  correctTypedWords: [],
  clear() {
    this.misspelledWords = [];
    this.correctTypedWords = [];
  },
};

function getNextWordIndex(word) {
  return word.nextElementSibling.offsetLeft;
}

function getCurrentWord(index) {
  const allWords = wordsElement.querySelectorAll("span");
  const currentWord = allWords[index];
  return currentWord;
}

function bringNewLine() {
  const transformTop = wordsElement.style
    .getPropertyValue("--transformTop")
    .slice(0, -2);
  wordsElement.style.setProperty(
    "--transformTop",
    `${-42 + Number(transformTop)}px`
  );
}
class TypeCheck {
  constructor() {
    this.input = getDomElement("#inputField");
    this.btn = getDomElement("#refresh");
    this.timerRunning = false;
    this.timerTime = 0;
    this.wordIndex = 0;
    this.input.addEventListener("keyup", this.keyUp);
    this.input.addEventListener("keypress", this.keyPress);
    this.input.addEventListener("keydown", this.runTimer);
    this.btn.addEventListener("click", this.refresh);
  }

  // CLEARING DATA AND DISABLING INPUT FIELD WHEN TIME END
  clearAll() {
    wordsElement.innerText = null;
    this.input.value = null;
    this.input.setAttribute("disabled", "true");
  }

  // UPDAING TIME
  updateTimer = () => {
    const timerUpdate = setInterval(() => {
      this.timerTime--;
      timerElement.innerText = `00:${this.timerTime}`;
      if (this.timerTime === 0) {
        timerElement.innerText = "00:00";
        clearInterval(timerUpdate);
        this.clearAll();
        calculateTypingResults();
      }
    }, 1000);
  };

  // To Start Timer When user start typing
  runTimer = () => {
    if (!this.timerRunning) {
      this.timerTime = 59;
      this.timerRunning = true;
      this.updateTimer();
    }
  };

  // HANDLING INPUT EVENT TO CALCUATE SPEED
  keyPress = (e) => {
    const currentWord = getCurrentWord(this.wordIndex);
    const currentWordText = currentWord.innerText;

    if (e.key === " ") {
      currentWord.classList.remove("highlight");

      if (currentWordText === this.input.value) {
        currentWord.classList.remove("incorrect");
        currentWord.classList.add("correct");
        metaData.correctTypedWords.push(currentWordText);
      } else if (currentWordText !== this.input.value) {
        currentWord.classList.remove("correct");
        currentWord.classList.add("incorrect");
        metaData.misspelledWords.push(currentWordText);
      }
      //  To Bring Next Line UP
      if (currentWord.offsetLeft > getNextWordIndex(currentWord)) {
        bringNewLine();
      }
    }
  };

  keyUp = (e) => {
    if (e.key === " ") {
      this.input.value = null;
      this.wordIndex++;
      getCurrentWord(this.wordIndex).classList.add("highlight");
      return;
    }

    const currentWord = getCurrentWord(this.wordIndex);
    let inputFieldElementTypedValue = this.input.value.length;
    let currentWordText = currentWord.innerText.slice(
      0,
      inputFieldElementTypedValue
    );
    if (currentWordText !== this.input.value.trim()) {
      currentWord.classList.remove("correct");
      currentWord.classList.add("incorrect");
    } else {
      currentWord.classList.remove("incorrect");
    }
  };

  // REFRESHING BUTTON RESETS ALL VALUE TO DEFAULT
  refresh = () => {
    this.btn.firstElementChild.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      300
    );
    wordsElement.innerText = null;
    wordsElement.style.setProperty("--transformTop", 0);
    updateWords(getData());
    this.timerRunning = false;
    this.timerTime = 0;
    timerElement.innerText = "01:00";
    this.input.removeAttribute("disabled");
    this.input.value = null;
    this.input.focus();
    this.wordIndex = 0;
    metaData.clear();
  };
}

new TypeCheck();
