interface Stopwatch {
    minutes: number,
    seconds: number;
}

interface timeStamp {
    minutes: number,
    seconds: number;
}

interface questionAnswer {
    answer: number,
    time: number;
}

let selectedQuiz;
let currQuestion = 1;
let answeredQuestions = 0;
let state = 0;
let currQuestionAnswered = false;
let stopwatch: Stopwatch = {minutes: 0, seconds: 0};
let timestamp: timeStamp = {minutes: 0, seconds: 0};
let timer;
let totalQuestions;
let answers = [];

let quizTitle = document.getElementById("quizTitle") as HTMLDivElement;
let quizIntro = document.getElementById("quizIntro") as HTMLDivElement;
let quizQuestion = document.getElementById("quizQuestion") as HTMLDivElement;
let questionNumber = document.getElementById("questionNumber") as HTMLDivElement;
let penaltyValue = document.getElementById("penaltyValue") as HTMLDivElement;
let nextQuestButton = document.getElementById("nextQuestionButton") as HTMLSelectElement;
let prevQuestButton = document.getElementById("prevQuestionButton") as HTMLSelectElement;
let submitQuizButton = document.getElementById("quizSubmitButton") as HTMLSelectElement;
let answer = document.getElementById("questionAnswerField") as HTMLInputElement;
let timerText = document.getElementById("timerText") as HTMLElement;

let quizPageBody = document.getElementById("BodyQuizPage") as HTMLDivElement;

let tabletQuizViewport = window.matchMedia("screen and (max-width: 879px)");
let mobileQuizViewport = window.matchMedia("(max-width: 600px)");

function setTabletQuizViewport() {
    let qTexts = document.getElementsByClassName("questionText") as HTMLCollectionOf<HTMLElement>;
    let questionCounter = document.getElementById("questionCounter") as HTMLDivElement;
    let penaltyBox = document.getElementById("penaltyBox") as HTMLDivElement;
    let timerBox = document.getElementById("timerBox") as HTMLDivElement;

    if (tabletQuizViewport.matches) {
        // Changes in quiz section
        quizPageBody.style.gridTemplateColumns = "1fr";

        timerBox.style.display = "none";
        questionCounter.style.display = "none";
        penaltyBox.style.display = "none";

        // Changes in summary section
        for (let i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "none";
        }
    } else {
        // Restoring changes in quiz section
        quizPageBody.style.gridTemplateColumns = "600px auto";

        questionCounter.style.display = "initial";
        penaltyBox.style.display = "initial";
        timerBox.style.display = "initial";

        // Restoring changes in summary section
        for (let i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "initial";
        }
    }
}

function setMobileQuizViewport() {
    let questionForm = document.getElementById("questionForm") as HTMLDivElement;

    if (mobileQuizViewport.matches) {
        // Global changes
        document.body.style.fontSize = "10px";
        document.querySelector("header").style.fontSize = "40px";

        // Changes in quiz section
        quizPageBody.style.fontSize = "12px";
        quizTitle.style.fontSize = "40px";
        quizIntro.style.display = "none"
        quizQuestion.style.fontSize = "18px";
        questionForm.style.gridTemplateColumns = "1fr 150px 1fr";
        questionForm.style.gridColumnGap = "10px";
        nextQuestButton.value = ">>>";
        prevQuestButton.value = "<<<";
    } else {
        // Restoring global changes
        document.body.style.fontSize = "12px";
        document.querySelector("header").style.fontSize = "70px";

        // Restoring changes in quiz section
        quizPageBody.style.fontSize = "15px";
        quizTitle.style.fontSize = "70px";
        quizIntro.style.display = "initial";
        quizQuestion.style.fontSize = "25px";
        questionForm.style.gridTemplateColumns = "1fr 200px 1fr";
        questionForm.style.gridColumnGap = "20px";
        nextQuestButton.value = "Następne pytanie";
        prevQuestButton.value = "Poprzednie pytanie";
    }
}

function resetStopwatch(stopwatch: Stopwatch) {
    stopwatch.minutes = 0;
    stopwatch.seconds = 0;
}

function saveTimeStamp(stopwatch: Stopwatch) {
    timestamp.minutes = stopwatch.minutes;
    timestamp.seconds = stopwatch.seconds;
}

function saveAnswer(questionNum: number) {
    questionNum--;
    answers[questionNum].answer = parseInt(answer.value, 10);
    answers[questionNum].time += (stopwatch.seconds - timestamp.seconds);
    answers[questionNum].time += (stopwatch.minutes - timestamp.minutes) * 60;
}

function loadQuestion(questionNum: number) {
    questionNum--;

    answer.value = isNaN(answers[questionNum].answer) ?
        "" : answers[questionNum].answer.toString();
    quizQuestion.innerText = selectedQuiz.questions[questionNum].questionText;
    currQuestionAnswered = answer.value != "";
    printQuestionNumber();
    saveTimeStamp(stopwatch);
}

function printTime() {
    let timeText: string = "";

    timeText += stopwatch.minutes < 10 ? "0" : "";
    timeText += stopwatch.minutes.toString() + ":";
    timeText += stopwatch.seconds < 10 ? "0" : "";
    timeText += stopwatch.seconds.toString();

    timerText.innerText = timeText;
}

function addSecond(stopwatch: Stopwatch) {
    stopwatch.seconds++;

    if (stopwatch.seconds == 60) {
        stopwatch.minutes++;
        stopwatch.seconds = 0;
    }

    printTime();

    startTimer(stopwatch);
}

function startTimer(stopwatch: Stopwatch) {
    timer = setTimeout(addSecond, 1000, stopwatch);
}

function printQuestionNumber() {
    questionNumber.innerText = currQuestion.toString() + " / " + totalQuestions.toString();
}

function checkIfAnswerInserted() {
    if (answer.value != "" && !currQuestionAnswered) {
        currQuestionAnswered = true;
        answeredQuestions++;
    }
    if (answer.value == "" && currQuestionAnswered) {
        currQuestionAnswered = false;
        answeredQuestions--;
    }

    submitQuizButton.disabled = answeredQuestions != totalQuestions;
}

function setQuestionChange(change: number) {
    saveAnswer(currQuestion);
    if (change == 0) {
        let totalTime = 0;
        for (let i = 0; i < totalQuestions; i++)
            totalTime += answers[i].time;
        for (let i = 0; i < totalQuestions; i++)
            answers[i].time = Math.floor(answers[i].time * 100 / totalTime);
        let answersField = document.getElementById("answers") as HTMLInputElement;
        answersField.value = JSON.stringify(answers);
        let form = document.getElementById("questionForm") as HTMLFormElement;
        form.submit();
    } else {
        changeQuestion(change);
    }
}

function displayQuestChangeButtons() {
    nextQuestButton.style.display = currQuestion < totalQuestions ? "initial" : "none";
    prevQuestButton.style.display = currQuestion > 1 ? "initial" : "none";
}

function changeQuestion(change : number) {
    currQuestion += change;
    displayQuestChangeButtons();
    loadQuestion(currQuestion);
}

function loadQuiz() {
    selectedQuiz = window['quiz'];
    quizPageBody.style.display = "grid";
    nextQuestButton.style.display = "initial";
    prevQuestButton.style.display = "none";
    submitQuizButton.disabled = true;
    totalQuestions = selectedQuiz.questions.length;
    for (let i = 0; i < totalQuestions; i++) {
        let answer : questionAnswer = {
            answer: NaN,
            time: 0
        }
        answers.push(answer);
    }
    currQuestion = 1;
    currQuestionAnswered = false;
    answeredQuestions = 0;
    state = 0;

    resetStopwatch(stopwatch);
    loadQuestion(1);
    startTimer(stopwatch);

    answer.addEventListener("input", checkIfAnswerInserted);
    setTabletQuizViewport();
    setMobileQuizViewport();
}

loadQuiz();
setTabletQuizViewport();
setMobileQuizViewport();
tabletQuizViewport.addListener(setTabletQuizViewport);
mobileQuizViewport.addListener(setMobileQuizViewport);