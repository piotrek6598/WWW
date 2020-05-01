let selectedQuiz = 1;

function chooseQuiz(quiz: number) {
    selectedQuiz = quiz;
}

document.getElementById("quizTitle").innerText = "Quiz prosty";
document.getElementById("quizIntro").innerText = "Liczyć każdy może";
document.getElementById("quizQuestion").innerText = "2 + 2 = ?";
document.getElementById("questionNumber").innerText = "1 / 4";
document.getElementById("penaltyValue").innerText = "10";

interface Stopwatch {
    minutes: number,
    seconds: number;
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

let stopwatch : Stopwatch = {minutes: 0, seconds: 0};
timer(stopwatch);