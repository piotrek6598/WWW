interface Question {
    questionText : string,
    correctAnswer : number,
    userAnswer : number,
    penalty : number,
    secondsSpend : number;
}

interface Quiz {
    title : string,
    introduction : string,
    questions : Question[];
}

let quizProsty : Quiz = {
    title : "Quiz prosty",
    introduction : "Liczyć każdy może",
    questions: [
        {
            questionText: "17 + 32 - 10 = ?",
            correctAnswer: 39,
            userAnswer: NaN,
            penalty: 10,
            secondsSpend: 0
        },
        {
            questionText: "43 - (19 + 21) + 26",
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


var selectedQuiz;
let currQuestion = 1;
let totalQuestions = 4;
let answeredQuestions = 0;
let state = 0;
let currQuestionAnswered = false;

let quizTitle = document.getElementById("quizTitle") as HTMLDivElement;
let quizIntro = document.getElementById("quizIntro") as HTMLDivElement;
let quizQuestion = document.getElementById("quizQuestion") as HTMLDivElement;
let questionNumber = document.getElementById("questionNumber") as HTMLDivElement;
let penaltyValue = document.getElementById("penaltyValue") as HTMLDivElement;
let nextQuestButton = document.getElementById("nextQuestionButton") as HTMLSelectElement;
let prevQuestButton = document.getElementById("prevQuestionButton") as HTMLSelectElement;
let submitQuizButton = document.getElementById("quizSubmitButton") as HTMLSelectElement;
let question = document.getElementById("questionAnswerField") as HTMLInputElement;

/*quizTitle.innerText = "Quiz prosty";
quizIntro.innerText = "Liczyć każdy może";
quizQuestion.innerText = "2 + 2 = ?";
questionNumber.innerText = "1 / 4";
penaltyValue.innerText = "10";*/
prevQuestButton.style.display = "none";
submitQuizButton.disabled = true;

function loadQuestion(questionNum : number) {
    question.value = isNaN(selectedQuiz.questions[questionNum].userAnswer) ?
        "" : selectedQuiz.questions[questionNum].userAnswer.toString();
    currQuestionAnswered = question.value == "";
}

function saveAnswer(questionNum : number) {
    selectedQuiz.questions[questionNum].userAnswer = parseInt(question.value, 10);
}

function chooseQuiz(quiz: number) {
    console.log("Choose quiz run ");
    if (quiz === 1) {
        selectedQuiz = quizProsty as Quiz;
        console.log("OK");
    }
}

function loadQuiz() {
    quizTitle.innerText =  selectedQuiz.title;
    quizIntro.innerText = selectedQuiz.introduction;
    totalQuestions = selectedQuiz.questions.length;
    currQuestion = 1;
    loadQuestion(1);
}

function addSecond(stopwatch: Stopwatch) {
    stopwatch.seconds++;
    if (stopwatch.seconds == 60) {
        stopwatch.minutes++;
        stopwatch.seconds = 0;
    }
    let timeText: string;
    if (stopwatch.minutes < 10) {
        timeText = "0" + stopwatch.minutes.toString();
    } else {
        timeText = stopwatch.minutes.toString();
    }
    timeText += ":";
    timeText += stopwatch.seconds < 10 ? "0" + stopwatch.seconds.toString() : stopwatch.seconds.toString();
    document.getElementById("timerText").innerText = timeText;

    timer(stopwatch);
}

function timer(stopwatch : Stopwatch) {
    setTimeout(addSecond, 1000, stopwatch);
}

function printQuestionNumber() {
    questionNumber.innerText = currQuestion.toString() + " / " + totalQuestions.toString();
}

function checkIfAnswerInserted() {
    if (question.value != "" && !currQuestionAnswered) {
        currQuestionAnswered = true;
        answeredQuestions++;
    }
    if (question.value == "" && currQuestionAnswered) {
        currQuestionAnswered = false;
        answeredQuestions--;
    }
    console.log(answeredQuestions);
    if (answeredQuestions == totalQuestions)
        submitQuizButton.disabled = false;
}

function setCurrQuestionNotAnswered() {
    if (question.value != "") {
        answeredQuestions--;
        currQuestionAnswered = true;
    } else {
        currQuestionAnswered = false;
    }
}

function submitQuestion() {
    saveAnswer(currQuestion);
    if (state == 1)
        nextQuestionFunc();
    else
        prevQuestionFunc();
}

function tryNextQuestion() {
    state = 1;
}

function tryPrevQuestion() {
    state = -1;
}

function prevQuestionFunc() {
    if (currQuestion == totalQuestions)
        nextQuestButton.style.display = "initial";
    currQuestion--;
    printQuestionNumber();
    if (currQuestion == 1)
        prevQuestButton.style.display = "none";
    loadQuestion(currQuestion);
    setCurrQuestionNotAnswered();
}

function nextQuestionFunc() {
    if (currQuestion == 1)
        prevQuestButton.style.display = "initial";
    currQuestion++;
    printQuestionNumber();
    if (currQuestion == totalQuestions)
        nextQuestButton.style.display = "none";
    loadQuestion(currQuestion);
    setCurrQuestionNotAnswered();
}aaa


let stopwatch : Stopwatch = {minutes: 0, seconds: 0};
timer(stopwatch);
question.addEventListener("input", checkIfAnswerInserted);
loadQuiz();