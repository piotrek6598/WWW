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
    questions: Question[],
    result: number;
}

let quizProsty: Quiz = {
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
}

let quizSredni: Quiz = {
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
}

let quizTrudny: Quiz = {
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
}

interface Stopwatch {
    minutes: number,
    seconds: number;
}

interface timeStamp {
    minutes: number,
    seconds: number;
}

interface Stats {
    quizTitle: string,
    id: number,
    result: number,
    question_details: {
        timeSpend: number,
        penalty: number;
    }[];
}


let selectedQuiz: Quiz = null;
let currQuestion = 1;
let answeredQuestions = 0;
let state = 0;
let currQuestionAnswered = false;
let stopwatch: Stopwatch = {minutes: 0, seconds: 0};
let timestamp: timeStamp = {minutes: 0, seconds: 0};
let quizes: Quiz[] = [quizProsty, quizSredni, quizTrudny];
let timer;
let totalQuestions;

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
let mainPageBody = document.getElementById("BodyMainPage") as HTMLDivElement;
let quizPageBody = document.getElementById("BodyQuizPage") as HTMLDivElement;
let quizSummaryPageBody = document.getElementById("BodyQuizSummaryPage") as HTMLDivElement;
let tableSummary = document.getElementById("quizSummary") as HTMLTableElement;
let badAnswer = document.getElementById("badAnswersBox") as HTMLDivElement;

let tabletViewport = window.matchMedia("screen and (max-width: 879px)");
let mobileViewport = window.matchMedia("(max-width: 600px)");

prevQuestButton.style.display = "none";
submitQuizButton.disabled = true;

function setTabletViewport() {
    let qTexts = document.getElementsByClassName("questionText") as HTMLCollectionOf<HTMLElement>;
    let qSummaries = document.getElementsByClassName("questionSummary") as HTMLCollectionOf<HTMLElement>;
    if (tabletViewport.matches) {
        quizPageBody.style.gridTemplateColumns = "1fr";
        document.getElementById("questionCounter").style.display = "none";
        document.getElementById("penaltyBox").style.display = "none";
        for (let i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "none";
            qSummaries[i].style.textAlign = "center";
        }
        document.getElementById("timerBox").style.display = "none";
    } else {
        quizPageBody.style.gridTemplateColumns = "600px auto";
        document.getElementById("questionCounter").style.display = "initial";
        document.getElementById("penaltyBox").style.display = "initial";
        for (let i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "initial";
            qSummaries[i].style.textAlign = "left";
        }
        document.getElementById("timerBox").style.display = "initial";
    }
}

function setMobileViewport() {
    let quizChoiceHeaders = document.getElementsByClassName("quizChoiceBox") as HTMLCollectionOf<HTMLElement>;
    let quizes = document.getElementsByClassName("quiz") as HTMLCollectionOf<HTMLElement>;
    let quizScorings = document.getElementsByClassName("quizScoring") as HTMLCollectionOf<HTMLElement>;
    let penaltyLists = document.getElementsByClassName("badAnswersPenaltyList") as HTMLCollectionOf<HTMLElement>;
    let questionForm = document.getElementById("questionForm") as HTMLDivElement;
    let qSummaries = document.getElementsByClassName("questionSummary") as HTMLCollectionOf<HTMLElement>;
    let score = document.getElementById("scoreBox") as HTMLDivElement;
    if (mobileViewport.matches) {
        document.body.style.fontSize = "10px";
        document.querySelector("header").style.fontSize = "40px";
        document.querySelector("footer").style.fontSize = "10px";
        document.querySelector("footer").style.marginTop = "15px";
        for (let i = 0; i < quizChoiceHeaders.length; i++)
            quizChoiceHeaders[i].querySelector("header").style.fontSize = "25px";
        for (let i = 0; i < quizes.length; i++) {
            quizes[i].querySelector("header").style.fontSize = "15px";
            quizes[i].style.margin = "30px 20px";
            quizes[i].style.width = "90%";
        }
        for (let i = 0; i < quizScorings.length; i++)
            quizScorings[i].querySelector("header").style.fontSize = "12px";
        for (let i = 0; i < penaltyLists.length; i++)
            penaltyLists[i].style.paddingInlineStart = "20px";
        mainPageBody.style.fontSize = "10px";
        quizPageBody.style.fontSize = "12px";
        quizTitle.style.fontSize = "40px";
        quizIntro.style.display = "none"
        quizQuestion.style.fontSize = "18px";
        let w = window.innerWidth;
        console.log(w);
        w = (w - 190) / 2;
        console.log(w);
        //questionForm.style.gridTemplateColumns = w.toString() + "px 150px " + w.toString() + "px";
        questionForm.style.gridTemplateColumns = "1fr 150px 1fr";
        questionForm.style.gridColumnGap = "10px";
        quizSummaryPageBody.style.fontSize = "10px";
        quizSummaryPageBody.querySelector("header").style.fontSize = "40px";
        tableSummary.style.width = "95%";
        for (let i = 0; i < qSummaries.length; i++)
            qSummaries[i].style.fontSize = "15px";
        badAnswer.style.display = "none";
        score.style.fontSize = "15px";
        //nextQuestButton.style.width = w.toString() + "px";
        //prevQuestButton.style.width = w.toString() + "px";
        //nextQuestButton.style.height = "80px";
        //prevQuestButton.style.height = "80px";
        //submitQuizButton.style.height = "80px";
        nextQuestButton.value = ">>>";
        prevQuestButton.value = "<<<";
    } else {
        document.body.style.fontSize = "12px";
        document.querySelector("header").style.fontSize = "70px";
        mainPageBody.style.fontSize = "10px";
        document.querySelector("footer").style.fontSize = "12px";
        document.querySelector("footer").style.marginTop = "40px";
        quizSummaryPageBody.querySelector("header").style.fontSize = "40px";
        for (let i = 0; i < quizChoiceHeaders.length; i++)
            quizChoiceHeaders[i].querySelector("header").style.fontSize = "25px";
        for (let i = 0; i < quizes.length; i++) {
            quizes[i].querySelector("header").style.fontSize = "18px";
            quizes[i].style.margin = "30px auto";
            quizes[i].style.width = "500px";
        }
        for (let i = 0; i < quizScorings.length; i++)
            quizScorings[i].querySelector("header").style.fontSize = "12px";
        for (let i = 0; i < penaltyLists.length; i++)
            penaltyLists[i].style.paddingInlineStart = "25px";
        quizPageBody.style.fontSize = "15px";
        quizIntro.style.display = "initial";
        quizQuestion.style.fontSize = "25px";
        questionForm.style.gridTemplateColumns = "1fr 200px 1fr";
        questionForm.style.gridColumnGap = "20px";
        quizSummaryPageBody.style.fontSize = "12px";
        tableSummary.style.width = "600px";
        for (let i = 0; i < qSummaries.length; i++)
            qSummaries[i].style.fontSize = "18px";
        badAnswer.style.display = "initial";
        score.style.fontSize = "18px";
        quizTitle.style.fontSize = "70px";
        nextQuestButton.value = "Następne pytanie";
        prevQuestButton.value = "Poprzednie pytanie";
    }
}

function resetStopwatch(stopwatch: Stopwatch) {
    stopwatch.minutes = 0;
    stopwatch.seconds = 0;
}

function convertSecondToTimeText(seconds: number): string {
    let text = "";
    let minutes = (seconds - seconds % 60) / 60;

    seconds -= minutes * 60;

    text += minutes < 10 ? "0" : "";
    text += minutes.toString() + ":";

    text += seconds < 10 ? "0" : "";
    text += seconds.toString();

    return text
}

function saveTimeStamp(stopwatch: Stopwatch) {
    timestamp.minutes = stopwatch.minutes;
    timestamp.seconds = stopwatch.seconds;
}

function saveAnswer(questionNum: number) {
    questionNum--;
    selectedQuiz.questions[questionNum].userAnswer = parseInt(answer.value, 10);
    selectedQuiz.questions[questionNum].secondsSpend += (stopwatch.seconds - timestamp.seconds);
    selectedQuiz.questions[questionNum].secondsSpend += (stopwatch.minutes - timestamp.minutes) * 60;
}

function loadQuestion(questionNum: number) {
    questionNum--;

    answer.value = isNaN(selectedQuiz.questions[questionNum].userAnswer) ?
        "" : selectedQuiz.questions[questionNum].userAnswer.toString();
    quizQuestion.innerText = selectedQuiz.questions[questionNum].questionText;
    penaltyValue.innerText = selectedQuiz.questions[questionNum].penalty.toString();
    currQuestionAnswered = answer.value != "";
    printQuestionNumber();
    saveTimeStamp(stopwatch);
}

function chooseQuiz(quiz: number) {
    if (quiz > quizes.length) {
        console.log("Bad quiz number");
        return;
    }

    selectedQuiz = quizes[quiz - 1];
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

    if (answeredQuestions == totalQuestions)
        submitQuizButton.disabled = false;
    else
        submitQuizButton.disabled = true;
}

function setQuestionChange(change: number) {
    state = change;
}

function createStats(quiz: Quiz, fullStats: boolean, quizId: number): Stats {
    let stats: Stats = {
        quizTitle: quiz.title,
        id: quizId,
        result: quiz.result,
        question_details: fullStats ? quiz.questions.map(question => {
            return {
                timeSpend: question.secondsSpend,
                penalty: question.correctAnswer == question.userAnswer ? 0 : question.penalty
            }
        }) : null
    }

    return stats;
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
    })

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

function saveStats(fullStats: boolean) {
    console.log("Works");
    let statsList: Stats[] = JSON.parse(localStorage.getItem("stats"));
    let newId;
    console.log(statsList == null);
    if (statsList == null) {
        statsList = [];
        newId = 1;
    } else {
        newId = statsList[statsList.length - 1].id + 1;
    }
    let quizStat = createStats(selectedQuiz, fullStats, newId);
    console.log(quizStat);
    console.log(quizStat.id);
    statsList.push(quizStat);
    localStorage.setItem("stats", JSON.stringify(statsList));
    backToMainPageAfterSavingResults();
}

function loadQuiz(quiz: number) {
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

    let totalTime = 0 as number;
    let totalPenalty = 0 as number;

    let headerRow = tableSummary.insertRow();

    for (let i = 0; i < 3; i++)
        headerRow.appendChild(document.createElement("TH"));

    headerRow.children[0].innerHTML = "Pytanie";
    headerRow.children[1].innerHTML = "Odpowiedź";
    headerRow.children[2].innerHTML = "Kara";

    for (let i = 0; i < selectedQuiz.questions.length; i++) {
        let answerRow = tableSummary.insertRow();
        let cell = answerRow.insertCell(); //bylo var
        let question = selectedQuiz.questions[i]; // bylo var
        let correctAnswer = question.correctAnswer == question.userAnswer; // bylo var

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

    let score = document.getElementById("scoreBox") as HTMLDivElement;
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