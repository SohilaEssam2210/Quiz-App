// Select Elements
const countSpan = document.querySelector(".count span");
const bullets = document.querySelector(".bullets");
const bulletsSpansContainer = document.querySelector(".bullets .spans");
const quizArea = document.querySelector(".quiz-area");
const answerArea = document.querySelector(".answers-area");
const submitBtn = document.querySelector(".submit-button");
const resultContainer = document.querySelector(".results");
const countdownElement = document.querySelector(".countdown");

// Set options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestions() {
  const myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObj = JSON.parse(this.responseText);
      let qCount = questionObj.length;
      console.log(qCount);

      //create bullets
      createBullets(qCount);

      //add question data
      addQuestionData(questionObj[currentIndex], qCount);

      // Start countdown
      countdown(60, qCount);

      //click on submit
      submitBtn.onclick = () => {
        // get right answer
        let theRightAnswer = questionObj[currentIndex].right_answer;

        //increase Index
        currentIndex++;

        //Check answer
        checkAnswer(theRightAnswer, qCount);

        // remove previous answer
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        //add next question
        addQuestionData(questionObj[currentIndex], qCount);

        //handle Bullets
        handleBullets();

        clearInterval(countdownInterval);
        countdown(60, qCount);

        //show Results
        showResult(qCount);
      };
    }
  };

  myRequest.open("GET", "html_question.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullets = document.createElement("span");
    if (i === 0) {
      theBullets.className = "on";
    }
    // Append the Bullets to main container
    bulletsSpansContainer.appendChild(theBullets);
  }
}

// Handle Bullets
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arraySpans = Array.from(bulletsSpans);
  arraySpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let titleText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(titleText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainAnswer = document.createElement("div");
      mainAnswer.className = "answer";

      //create input
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "questions";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];

      //make the first option checked
      if (i === 1) {
        input.checked = true;
      }

      // create label
      let theLabel = document.createElement("label");
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.htmlFor = `answer_${i}`;
      theLabel.appendChild(theLabelText);

      //append input + label to mainAnswer
      mainAnswer.appendChild(input);
      mainAnswer.appendChild(theLabel);

      //append all to container
      answerArea.appendChild(mainAnswer);
    }
  }
}

// check answer when click the submit
function checkAnswer(rAnswer, count) {
  let allAnswers = document.getElementsByName("questions");
  let theChoosenAnswer;

  for (let i = 0; i < allAnswers.length; i++) {
    if (allAnswers[i].checked) {
      theChoosenAnswer = allAnswers[i].dataset.answer;
    }
  }
  console.log(`right: ${rAnswer}`);
  console.log(`Choosen: ${theChoosenAnswer}`);

  if (rAnswer === theChoosenAnswer) {
    rightAnswer++;
  }
}

// Show Results
function showResult(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.parentNode.removeChild(quizArea);
    answerArea.parentNode.removeChild(answerArea);
    submitBtn.parentNode.removeChild(submitBtn);
    bullets.parentNode.removeChild(bullets);

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class="good"> Good </span>, ${rightAnswer} From ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect"> Perfect </span>, ${rightAnswer} From ${count} Good`;
    } else {
      theResults = `<span class="bad"> Bad </span>, ${rightAnswer} from ${count}`;
    }

    resultContainer.innerHTML = theResults;
    resultContainer.style.padding = "10px";
    resultContainer.style.backgroundColor = "white";
    resultContainer.style.marginTop = "10px";
  }
}


// Start CountDown function
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
        console.log("Finished");
      }
    }, 1000);
  }
}
