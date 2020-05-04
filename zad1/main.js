var quizProsty = {
    title: "Quiz prosty",
    introduction: "Liczyć każdy może, ten quiz nauczy cię wykonywać podstawowe działania arytmetyczne",
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
    ],
    result: 0
};
var quizSredni = {
    title: "Quiz średni",
    introduction: "Liczyć każdy może, ten quiz sprawdzi jak radzisz sobie z trudniejszymi przykładami",
    questions: [
        {
            questionText: "476 + 524 - 321 = ?",
            correctAnswer: 679,
            userAnswer: NaN,
            penalty: 20,
            secondsSpend: 0
        },
        {
            questionText: "(1236 + 432) / 139 + 27 * 3 = ?",
            correctAnswer: 93,
            userAnswer: NaN,
            penalty: 20,
            secondsSpend: 0
        },
        {
            questionText: "124 + 31 * 17 - 234 / 3 = ?",
            correctAnswer: 573,
            userAnswer: NaN,
            penalty: 30,
            secondsSpend: 0
        },
        {
            questionText: "(74 + 29) * 35 + (28 - 16) * 167 = ?",
            correctAnswer: 5609,
            userAnswer: NaN,
            penalty: 30,
            secondsSpend: 0
        },
        {
            questionText: "129 + 345 / 15 + (3486 / 6) * 12 = ?",
            correctAnswer: 7124,
            userAnswer: NaN,
            penalty: 40,
            secondsSpend: 0
        },
        {
            questionText: "826 * 12 - (741 / 39 + 128 * (21 - 72 / 9)) = ?",
            correctAnswer: 8229,
            userAnswer: NaN,
            penalty: 40,
            secondsSpend: 0
        }
    ],
    result: 0
};
var quizTrudny = {
    title: "Quiz trudny",
    introduction: "Ten quiz sprawdzi czy naprawdę potrafisz liczyć",
    questions: [
        {
            questionText: "13178 + 56482 - 3491 = ?",
            correctAnswer: 66169,
            userAnswer: NaN,
            penalty: 25,
            secondsSpend: 0
        },
        {
            questionText: "158946 - (12745 + 38645) * 2 = ?",
            correctAnswer: 56166,
            userAnswer: NaN,
            penalty: 25,
            secondsSpend: 0
        },
        {
            questionText: "268543 - 45263 + 17185 * 27 = ?",
            correctAnswer: 687275,
            userAnswer: NaN,
            penalty: 25,
            secondsSpend: 0
        },
        {
            questionText: "1287 * 265 - 4924 * 31 = ?",
            correctAnswer: 188411,
            userAnswer: NaN,
            penalty: 35,
            secondsSpend: 0
        },
        {
            questionText: "564 * (1542 - 932) / 6 = ?",
            correctAnswer: 57340,
            userAnswer: NaN,
            penalty: 35,
            secondsSpend: 0
        },
        {
            questionText: "1777620 / 2756 + 24 = ?",
            correctAnswer: 669,
            userAnswer: NaN,
            penalty: 35,
            secondsSpend: 0
        },
        {
            questionText: "275 / 16 * 123 * 368 = ?",
            correctAnswer: 777975,
            userAnswer: NaN,
            penalty: 50,
            secondsSpend: 0
        },
        {
            questionText: "65810128 / 42568 + 2789 * 681 = ?",
            correctAnswer: 1900855,
            userAnswer: NaN,
            penalty: 50,
            secondsSpend: 0
        }
    ],
    result: 0
};
var selectedQuiz = null;
var currQuestion = 1;
var answeredQuestions = 0;
var state = 0;
var currQuestionAnswered = false;
var stopwatch = { minutes: 0, seconds: 0 };
var timestamp = { minutes: 0, seconds: 0 };
var quizes = [quizProsty, quizSredni, quizTrudny];
var timer;
var totalQuestions;
var quizTitle = document.getElementById("quizTitle");
var quizIntro = document.getElementById("quizIntro");
var quizQuestion = document.getElementById("quizQuestion");
var questionNumber = document.getElementById("questionNumber");
var penaltyValue = document.getElementById("penaltyValue");
var nextQuestButton = document.getElementById("nextQuestionButton");
var prevQuestButton = document.getElementById("prevQuestionButton");
var submitQuizButton = document.getElementById("quizSubmitButton");
var answer = document.getElementById("questionAnswerField");
var timerText = document.getElementById("timerText");
var mainPageBody = document.getElementById("BodyMainPage");
var quizPageBody = document.getElementById("BodyQuizPage");
var quizSummaryPageBody = document.getElementById("BodyQuizSummaryPage");
var tableSummary = document.getElementById("quizSummary");
var badAnswer = document.getElementById("badAnswersBox");
var tabletViewport = window.matchMedia("screen and (max-width: 879px)");
var mobileViewport = window.matchMedia("(max-width: 600px)");
prevQuestButton.style.display = "none";
submitQuizButton.disabled = true;
function setTabletViewport() {
    var qTexts = document.getElementsByClassName("questionText");
    var qSummaries = document.getElementsByClassName("questionSummary");
    var questionCounter = document.getElementById("questionCounter");
    var penaltyBox = document.getElementById("penaltyBox");
    var timerBox = document.getElementById("timerBox");
    if (tabletViewport.matches) {
        // Changes in quiz section
        quizPageBody.style.gridTemplateColumns = "1fr";
        timerBox.style.display = "none";
        questionCounter.style.display = "none";
        penaltyBox.style.display = "none";
        // Changes in summary section
        for (var i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "none";
            qSummaries[i].style.textAlign = "center";
        }
    }
    else {
        // Restoring changes in quiz section
        quizPageBody.style.gridTemplateColumns = "600px auto";
        questionCounter.style.display = "initial";
        penaltyBox.style.display = "initial";
        timerBox.style.display = "initial";
        // Restoring changes in summary section
        for (var i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "initial";
            qSummaries[i].style.textAlign = "left";
        }
    }
}
function setMobileViewport() {
    var quizChoiceHeaders = document.getElementsByClassName("quizChoiceBox");
    var quizes = document.getElementsByClassName("quiz");
    var quizScorings = document.getElementsByClassName("quizScoring");
    var penaltyLists = document.getElementsByClassName("badAnswersPenaltyList");
    var questionForm = document.getElementById("questionForm");
    var qSummaries = document.getElementsByClassName("questionSummary");
    var score = document.getElementById("scoreBox");
    if (mobileViewport.matches) {
        // Global changes
        document.body.style.fontSize = "10px";
        document.querySelector("header").style.fontSize = "40px";
        document.querySelector("footer").style.fontSize = "10px";
        document.querySelector("footer").style.marginTop = "15px";
        // Changes in main section
        mainPageBody.style.fontSize = "10px";
        for (var i = 0; i < quizChoiceHeaders.length; i++)
            quizChoiceHeaders[i].querySelector("header").style.fontSize = "25px";
        for (var i = 0; i < quizes.length; i++) {
            quizes[i].querySelector("header").style.fontSize = "15px";
            quizes[i].style.margin = "30px 20px";
            quizes[i].style.width = "90%";
        }
        for (var i = 0; i < quizScorings.length; i++)
            quizScorings[i].querySelector("header").style.fontSize = "12px";
        for (var i = 0; i < penaltyLists.length; i++)
            penaltyLists[i].style.paddingInlineStart = "20px";
        // Changes in quiz section
        quizPageBody.style.fontSize = "12px";
        quizTitle.style.fontSize = "40px";
        quizIntro.style.display = "none";
        quizQuestion.style.fontSize = "18px";
        questionForm.style.gridTemplateColumns = "1fr 150px 1fr";
        questionForm.style.gridColumnGap = "10px";
        nextQuestButton.value = ">>>";
        prevQuestButton.value = "<<<";
        // Changes in summary section.
        quizSummaryPageBody.style.fontSize = "10px";
        quizSummaryPageBody.querySelector("header").style.fontSize = "40px";
        tableSummary.style.width = "95%";
        for (var i = 0; i < qSummaries.length; i++)
            qSummaries[i].style.fontSize = "15px";
        badAnswer.style.display = "none";
        score.style.fontSize = "15px";
    }
    else {
        // Restoring global changes
        document.body.style.fontSize = "12px";
        document.querySelector("header").style.fontSize = "70px";
        document.querySelector("footer").style.fontSize = "12px";
        document.querySelector("footer").style.marginTop = "40px";
        // Restoring changes in main section
        mainPageBody.style.fontSize = "10px";
        for (var i = 0; i < quizChoiceHeaders.length; i++)
            quizChoiceHeaders[i].querySelector("header").style.fontSize = "25px";
        for (var i = 0; i < quizes.length; i++) {
            quizes[i].querySelector("header").style.fontSize = "18px";
            quizes[i].style.margin = "30px auto";
            quizes[i].style.width = "500px";
        }
        for (var i = 0; i < quizScorings.length; i++)
            quizScorings[i].querySelector("header").style.fontSize = "12px";
        for (var i = 0; i < penaltyLists.length; i++)
            penaltyLists[i].style.paddingInlineStart = "25px";
        // Restoring changes in quiz section
        quizPageBody.style.fontSize = "15px";
        quizTitle.style.fontSize = "70px";
        quizIntro.style.display = "initial";
        quizQuestion.style.fontSize = "25px";
        questionForm.style.gridTemplateColumns = "1fr 200px 1fr";
        questionForm.style.gridColumnGap = "20px";
        nextQuestButton.value = "Następne pytanie";
        prevQuestButton.value = "Poprzednie pytanie";
        // Restoring changes in summary section.
        quizSummaryPageBody.style.fontSize = "12px";
        quizSummaryPageBody.querySelector("header").style.fontSize = "70px";
        tableSummary.style.width = "600px";
        for (var i = 0; i < qSummaries.length; i++)
            qSummaries[i].style.fontSize = "18px";
        badAnswer.style.display = "initial";
        score.style.fontSize = "18px";
    }
}
function resetStopwatch(stopwatch) {
    stopwatch.minutes = 0;
    stopwatch.seconds = 0;
}
// In format mm:ss
function convertSecondToTimeText(seconds) {
    var text = "";
    var minutes = (seconds - seconds % 60) / 60;
    seconds -= minutes * 60;
    text += minutes < 10 ? "0" : "";
    text += minutes.toString() + ":";
    text += seconds < 10 ? "0" : "";
    text += seconds.toString();
    return text;
}
function saveTimeStamp(stopwatch) {
    timestamp.minutes = stopwatch.minutes;
    timestamp.seconds = stopwatch.seconds;
}
function saveAnswer(questionNum) {
    questionNum--;
    selectedQuiz.questions[questionNum].userAnswer = parseInt(answer.value, 10);
    selectedQuiz.questions[questionNum].secondsSpend += (stopwatch.seconds - timestamp.seconds);
    selectedQuiz.questions[questionNum].secondsSpend += (stopwatch.minutes - timestamp.minutes) * 60;
}
function loadQuestion(questionNum) {
    questionNum--;
    answer.value = isNaN(selectedQuiz.questions[questionNum].userAnswer) ?
        "" : selectedQuiz.questions[questionNum].userAnswer.toString();
    quizQuestion.innerText = selectedQuiz.questions[questionNum].questionText;
    penaltyValue.innerText = selectedQuiz.questions[questionNum].penalty.toString();
    currQuestionAnswered = answer.value != "";
    printQuestionNumber();
    saveTimeStamp(stopwatch);
}
function chooseQuiz(quiz) {
    if (quiz > quizes.length) {
        console.log("Bad quiz number");
        return;
    }
    selectedQuiz = quizes[quiz - 1];
}
function printTime() {
    var timeText = "";
    timeText += stopwatch.minutes < 10 ? "0" : "";
    timeText += stopwatch.minutes.toString() + ":";
    timeText += stopwatch.seconds < 10 ? "0" : "";
    timeText += stopwatch.seconds.toString();
    timerText.innerText = timeText;
}
function addSecond(stopwatch) {
    stopwatch.seconds++;
    if (stopwatch.seconds == 60) {
        stopwatch.minutes++;
        stopwatch.seconds = 0;
    }
    printTime();
    startTimer(stopwatch);
}
function startTimer(stopwatch) {
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
    if (answeredQuestions == totalQuestions)
        submitQuizButton.disabled = false;
    else
        submitQuizButton.disabled = true;
}
function setQuestionChange(change) {
    state = change;
}
function createStats(quiz, fullStats, quizId) {
    var stats = {
        quizTitle: quiz.title,
        id: quizId,
        result: quiz.result,
        question_details: fullStats ? quiz.questions.map(function (question) {
            return {
                timeSpend: question.secondsSpend,
                penalty: question.correctAnswer == question.userAnswer ? 0 : question.penalty
            };
        }) : null
    };
    return stats;
}
function displayQuestChangeButtons() {
    nextQuestButton.style.display = currQuestion < totalQuestions ? "initial" : "none";
    prevQuestButton.style.display = currQuestion > 1 ? "initial" : "none";
}
function changeQuestion(change) {
    currQuestion += change;
    displayQuestChangeButtons();
    loadQuestion(currQuestion);
}
function submitQuestion() {
    saveAnswer(currQuestion);
    if (state == 0)
        quizSummary();
    else
        changeQuestion(state);
}
function resetQuiz() {
    selectedQuiz.questions.forEach(function (question) {
        question.userAnswer = NaN;
        question.secondsSpend = 0;
    });
    selectedQuiz = null;
    answer.removeEventListener("input", checkIfAnswerInserted);
    clearTimeout(timer);
    resetStopwatch(stopwatch);
    printTime();
}
function breakQuiz() {
    resetQuiz();
    quizPageBody.style.display = "none";
    mainPageBody.style.display = "grid";
}
function backToMainPageAfterSavingResults() {
    resetQuiz();
    tableSummary.innerHTML = "";
    badAnswer.innerHTML = "";
    quizSummaryPageBody.style.display = "none";
    mainPageBody.style.display = "grid";
}
function saveStats(fullStats) {
    console.log("Works");
    var statsList = JSON.parse(localStorage.getItem("stats"));
    var newId;
    console.log(statsList == null);
    if (statsList == null) {
        statsList = [];
        newId = 1;
    }
    else {
        newId = statsList[statsList.length - 1].id + 1;
    }
    var quizStat = createStats(selectedQuiz, fullStats, newId);
    console.log(quizStat);
    console.log(quizStat.id);
    statsList.push(quizStat);
    localStorage.setItem("stats", JSON.stringify(statsList));
    backToMainPageAfterSavingResults();
}
function loadQuiz(quiz) {
    if (selectedQuiz != null)
        resetQuiz();
    chooseQuiz(quiz);
    mainPageBody.style.display = "none";
    quizPageBody.style.display = "grid";
    nextQuestButton.style.display = "initial";
    prevQuestButton.style.display = "none";
    submitQuizButton.disabled = true;
    quizTitle.innerText = selectedQuiz.title;
    quizIntro.innerText = selectedQuiz.introduction;
    totalQuestions = selectedQuiz.questions.length;
    currQuestion = 1;
    currQuestionAnswered = false;
    answeredQuestions = 0;
    state = 0;
    resetStopwatch(stopwatch);
    loadQuestion(1);
    startTimer(stopwatch);
    answer.addEventListener("input", checkIfAnswerInserted);
    setTabletViewport();
    setMobileViewport();
}
function quizSummary() {
    quizPageBody.style.display = "none";
    quizSummaryPageBody.style.display = "grid";
    var totalTime = 0;
    var totalPenalty = 0;
    var headerRow = tableSummary.insertRow();
    for (var i = 0; i < 3; i++)
        headerRow.appendChild(document.createElement("TH"));
    headerRow.children[0].innerHTML = "Pytanie";
    headerRow.children[1].innerHTML = "Odpowiedź";
    headerRow.children[2].innerHTML = "Kara";
    for (var i = 0; i < selectedQuiz.questions.length; i++) {
        var answerRow = tableSummary.insertRow();
        var cell = answerRow.insertCell(); //bylo var
        var question = selectedQuiz.questions[i]; // bylo var
        var correctAnswer = question.correctAnswer == question.userAnswer; // bylo var
        cell.innerHTML = "<span class='questionNumberSummary'>" + (i + 1).toString() + "</span>";
        cell.innerHTML += "<span class='questionText'>: " + question.questionText + "</span>";
        cell.classList.add("questionSummary");
        cell = answerRow.insertCell();
        if (correctAnswer)
            cell.classList.add("answerOK");
        else
            cell.classList.add("answerBad");
        cell.innerHTML = correctAnswer ? "OK" : "Zła odpowiedź";
        cell = answerRow.insertCell();
        cell.innerHTML = correctAnswer ? "0" : question.penalty.toString();
        if (!correctAnswer) {
            badAnswer.innerHTML += "<sup>" + (i + 1).toString() + " </sup>";
            badAnswer.innerHTML += "Twoja odpowiedź to: <span class='userAnswer'>" + question.userAnswer.toString() + "</span>";
            badAnswer.innerHTML += ", poprawna odpowiedź to: <span class='correctAnswer'>" + question.correctAnswer.toString() + "</span>";
            badAnswer.innerHTML += "<br>";
        }
        totalTime += question.secondsSpend;
        totalPenalty += correctAnswer ? 0 : question.penalty;
    }
    selectedQuiz.result = totalTime + totalPenalty;
    var score = document.getElementById("scoreBox");
    score.innerHTML = "Rozwiązanie quizu zajęło ci: " + convertSecondToTimeText(totalTime) + "<br>";
    score.innerHTML += "Kara za błędne odpowiedzi: " + convertSecondToTimeText(totalPenalty) + "<br>";
    score.innerHTML += "Twój lączny wynik: " + convertSecondToTimeText(totalTime + totalPenalty);
    setTabletViewport();
    setMobileViewport();
}
setTabletViewport();
setMobileViewport();
tabletViewport.addListener(setTabletViewport);
mobileViewport.addListener(setMobileViewport);
