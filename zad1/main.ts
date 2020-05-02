interface Question {
    questionText: string,
    correctAnswer: number,
    userAnswer: number,
    penalty: number,
    secondsSpend: number;
}

interface Quiz {
    title: string,
    introduction: string,
    questions: Question[];
}

let quizProsty: Quiz = {
    title: "Quiz prosty",
    introduction: "Liczyć każdy może",
    questions: [
        {
            questionText: "17 + 32 - 10 = ?",
            correctAnswer: 39,
            userAnswer: NaN,
            penalty: 10,
            secondsSpend: 0
        },
        {
            questionText: "43 - (19 + 21) + 26 = ?",
            correctAnswer: 29,
            userAnswer: NaN,
            penalty: 10,
            secondsSpend: 0
        },
        {
            questionText: "8 * 7 + 42 / 3 = ?",
            correctAnswer: 70,
            userAnswer: NaN,
            penalty: 20,
            secondsSpend: 0
        },
        {
            questionText: "13 * 2 - 6 + 12 / 6 + 25 * (12 + 4) / 8 = ?",
            correctAnswer: 72,
            userAnswer: NaN,
            penalty: 20,
            secondsSpend: 0
        }
    ]
}

interface Stopwatch {
    minutes: number,
    seconds: number;
}

interface timeStamp {
    minutes: number,
    seconds: number;
}


let selectedQuiz: Quiz = null;
let currQuestion = 1;
let totalQuestions = 4;
let answeredQuestions = 0;
let state = 0;
let currQuestionAnswered = false;
let stopwatch: Stopwatch = {minutes: 0, seconds: 0};
let timestamp: timeStamp = {minutes: 0, seconds: 0};

let quizTitle = document.getElementById("quizTitle") as HTMLDivElement;
let quizIntro = document.getElementById("quizIntro") as HTMLDivElement;
let quizQuestion = document.getElementById("quizQuestion") as HTMLDivElement;
let questionNumber = document.getElementById("questionNumber") as HTMLDivElement;
let penaltyValue = document.getElementById("penaltyValue") as HTMLDivElement;
let nextQuestButton = document.getElementById("nextQuestionButton") as HTMLSelectElement;
let prevQuestButton = document.getElementById("prevQuestionButton") as HTMLSelectElement;
let submitQuizButton = document.getElementById("quizSubmitButton") as HTMLSelectElement;
let answer = document.getElementById("questionAnswerField") as HTMLInputElement;
let timer;

prevQuestButton.style.display = "none";
submitQuizButton.disabled = true;

function resetStopwatch(stopwatch: Stopwatch) {
    stopwatch.minutes = 0;
    stopwatch.seconds = 0;
}

function quizSummary() {
    selectedQuiz.questions.forEach(function (question) {
        console.log("Correct answer is: " + question.correctAnswer + ", your answer is: " + question.userAnswer);
    })
    document.getElementById("BodyQuizPage").style.display = "none";
    document.getElementById("BodyQuizSummaryPage").style.display = "grid";

    let tableSummary = document.getElementById("quizSummary") as HTMLTableElement;
    let badAnswer = document.getElementById("badAnswersBox") as HTMLDivElement;
    let totalTime = 0 as number;
    let totalPenalty = 0 as number;
    let headerRow = tableSummary.insertRow();
    for (let i = 0; i < 4; i++)
        headerRow.appendChild(document.createElement("TH"));
    headerRow.children[0].innerHTML = "Pytanie";
    headerRow.children[1].innerHTML = "Odpowiedź";
    headerRow.children[2].innerHTML = "Czas";
    headerRow.children[3].innerHTML = "Kara";
    for (let i = 0; i < selectedQuiz.questions.length; i++) {
        let answerRow = tableSummary.insertRow();
        var cell = answerRow.insertCell();
        var question = selectedQuiz.questions[i];
        var correctAnswer = question.correctAnswer == question.userAnswer;
        cell.innerHTML = "<span class='questionNumberSummary'>" + (i + 1).toString() + ": </span>";
        cell.innerHTML += "<span class='questionText'>" + question.questionText + "</span>";
        cell.classList.add("questionSummary");
        cell = answerRow.insertCell();
        if (correctAnswer)
            cell.classList.add("answerOK");
        else
            cell.classList.add("answerBad");
        cell.innerHTML = correctAnswer ? "OK" : "Zła odpowiedź";
        cell = answerRow.insertCell();
        cell.innerHTML = question.secondsSpend.toString();
        cell = answerRow.insertCell();
        cell.innerHTML = correctAnswer ? "0" : question.penalty.toString();
        if (!correctAnswer) {
            badAnswer.innerHTML += "<sup>" + (i+1).toString() + " </sup>";
            badAnswer.innerHTML += "Twoja odpowiedź to: <span class='userAnswer'>" + question.userAnswer.toString() + "</span>";
            badAnswer.innerHTML += ", poprawna odpowiedź to: <span class='correctAnswer'>" + question.correctAnswer.toString() + "</span>";
            badAnswer.innerHTML += "<br>";
        }

        totalTime += question.secondsSpend;
        totalPenalty += correctAnswer ? 0 : question.penalty;
    }

    let score = document.getElementById("scoreBox") as HTMLDivElement;
    score.innerHTML = "Rozwiązanie quizu zajęło ci: " + convertSecondToTTimeText(totalTime) + "<br>";
    score.innerHTML += ", kara za błędne odpowiedzi: " + convertSecondToTTimeText(totalPenalty) + "<br>";
    score.innerHTML += "Twój lączny wynik: " + convertSecondToTTimeText(totalTime + totalPenalty);
}

function convertSecondToTTimeText(seconds : number) : string {
    let minutes = (seconds - seconds % 60) / 60;
    seconds -= minutes * 60;
    let text = "";
    if (minutes < 10)
        text += "0";
    text += minutes.toString() + ":";
    if (seconds < 10)
        text += "0";
    text += seconds.toString();
    return text
}

function saveTimeStamp(stopwatch : Stopwatch) {
    timestamp.minutes = stopwatch.minutes;
    timestamp.seconds = stopwatch.seconds;
}

function loadQuestion(questionNum: number) {
    questionNum--;
    answer.value = isNaN(selectedQuiz.questions[questionNum].userAnswer) ?
        "" : selectedQuiz.questions[questionNum].userAnswer.toString();
    //answer.placeholder = answer.value == "" ? "Twoja odpowiedź" : answer.value;
    quizQuestion.innerText = selectedQuiz.questions[questionNum].questionText;
    penaltyValue.innerText = selectedQuiz.questions[questionNum].penalty.toString();
    currQuestionAnswered = answer.value != "";
    printQuestionNumber();
    console.log("Current question answered " + currQuestionAnswered);
    saveTimeStamp(stopwatch);
}

function saveAnswer(questionNum: number) {
    questionNum--;
    selectedQuiz.questions[questionNum].userAnswer = parseInt(answer.value, 10);
    selectedQuiz.questions[questionNum].secondsSpend += (stopwatch.seconds - timestamp.seconds);
    selectedQuiz.questions[questionNum].secondsSpend += (stopwatch.minutes - timestamp.minutes) * 60;
}

function chooseQuiz(quiz: number) {
    console.log("Choose quiz run ");
    if (quiz === 1) {
        selectedQuiz = quizProsty;
        console.log("OK");
    }
}

function loadQuiz(quiz: number) {
    if (selectedQuiz != null)
        resetQuiz();
    chooseQuiz(quiz);
    document.getElementById("BodyMainPage").style.display = "none";
    document.getElementById("BodyQuizPage").style.display = "grid";
    quizTitle.innerText = selectedQuiz.title;
    quizIntro.innerText = selectedQuiz.introduction;
    totalQuestions = selectedQuiz.questions.length;
    currQuestion = 1;
    loadQuestion(1);
    startTimer(stopwatch);
    answer.addEventListener("input", checkIfAnswerInserted);
}

function printTime() {
    let timeText: string;
    if (stopwatch.minutes < 10) {
        timeText = "0" + stopwatch.minutes.toString();
    } else {
        timeText = stopwatch.minutes.toString();
    }
    timeText += ":";
    timeText += stopwatch.seconds < 10 ? "0" + stopwatch.seconds.toString() : stopwatch.seconds.toString();
    document.getElementById("timerText").innerText = timeText;
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
    console.log("Answered questions is " + answeredQuestions);
    if (answeredQuestions == totalQuestions)
        submitQuizButton.disabled = false;
    else
        submitQuizButton.disabled = true;
}

function submitQuestion() {
    saveAnswer(currQuestion);
    if (state == 1)
        nextQuestionFunc();
    else if (state == -1)
        prevQuestionFunc();
    else
        quizSummary();
}

function tryNextQuestion() {
    state = 1;
}

function tryPrevQuestion() {
    state = -1;
}

function tryExitQuiz() {
    state = 0;
}

function prevQuestionFunc() {
    if (currQuestion == totalQuestions)
        nextQuestButton.style.display = "initial";
    currQuestion--;
    //printQuestionNumber();
    if (currQuestion == 1)
        prevQuestButton.style.display = "none";
    loadQuestion(currQuestion);
}

function resetQuiz() {
    selectedQuiz.questions.forEach(function (question) {
        question.userAnswer = NaN;
        question.secondsSpend = 0;
    })
    selectedQuiz = null;
    answer.removeEventListener("input", checkIfAnswerInserted);
    clearTimeout(timer);
    resetStopwatch(stopwatch);
    printTime();
}

function breakQuiz() {
    resetQuiz();
    document.getElementById("BodyQuizPage").style.display = "none";
    document.getElementById("BodyMainPage").style.display = "grid";
}

function backToMainPageAfterSavingResults() {
    resetQuiz();
    document.getElementById("BodyQuizSummaryPage").style.display = "none";
    document.getElementById("BodyMainPage").style.display = "grid";
}

function saveResultWithStatistic() {
    // TODO
    backToMainPageAfterSavingResults();
}

function saveOnlyResult() {
    // TODO
    backToMainPageAfterSavingResults();
}

function nextQuestionFunc() {
    if (currQuestion == 1)
        prevQuestButton.style.display = "initial";
    currQuestion++;
    //printQuestionNumber();
    if (currQuestion == totalQuestions)
        nextQuestButton.style.display = "none";
    loadQuestion(currQuestion);
}
