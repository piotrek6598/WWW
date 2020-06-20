let summary = window['summary'];
let tableSummary = document.getElementById("quizSummary") as HTMLTableElement;
let quizSummaryPageBody = document.getElementById("BodyQuizSummaryPage") as HTMLDivElement;
let badAnswer = document.getElementById("badAnswersBox") as HTMLDivElement;

let tabletSummaryViewport = window.matchMedia("screen and (max-width: 879px)");
let mobileSummaryViewport = window.matchMedia("(max-width: 600px)");

function setTabletSummaryViewport() {
    let qTexts = document.getElementsByClassName("questionText") as HTMLCollectionOf<HTMLElement>;
    let qSummaries = document.getElementsByClassName("questionSummary") as HTMLCollectionOf<HTMLElement>;

    if (tabletSummaryViewport.matches) {
        for (let i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "none";
            qSummaries[i].style.textAlign = "center";
        }
    } else {
        for (let i = 0; i < qTexts.length; i++) {
            qTexts[i].style.display = "initial";
            qSummaries[i].style.textAlign = "left";
        }
    }
}

function setMobileSummaryViewport() {
    let qSummaries = document.getElementsByClassName("questionSummary") as HTMLCollectionOf<HTMLElement>;
    let score = document.getElementById("scoreBox") as HTMLDivElement;

    if (mobileSummaryViewport.matches) {
        quizSummaryPageBody.style.fontSize = "10px";
        quizSummaryPageBody.querySelector("header").style.fontSize = "40px";
        tableSummary.style.width = "95%";
        for (let i = 0; i < qSummaries.length; i++)
            qSummaries[i].style.fontSize = "15px";
        badAnswer.style.display = "none";
        score.style.fontSize = "15px";
    } else {
        quizSummaryPageBody.style.fontSize = "12px";
        quizSummaryPageBody.querySelector("header").style.fontSize = "70px";
        tableSummary.style.width = "600px";
        for (let i = 0; i < qSummaries.length; i++)
            qSummaries[i].style.fontSize = "18px";
        badAnswer.style.display = "initial";
        score.style.fontSize = "18px";
    }
}

// In format mm:ss
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

function quizSummary() {
    quizSummaryPageBody.style.display = "grid";

    let totalTime = summary.time;
    let totalPenalty = summary.totalPenalty;

    let headerRow = tableSummary.insertRow();

    for (let i = 0; i < 5; i++)
        headerRow.appendChild(document.createElement("TH"));

    headerRow.children[0].innerHTML = "Pytanie";
    headerRow.children[1].innerHTML = "Odpowiedź";
    headerRow.children[2].innerHTML = "Kara";
    headerRow.children[3].innerHTML = "% Poprawnych";
    headerRow.children[4].innerHTML = "Średni czas";
    for (let i = 0; i < summary.answers.length; i++) {
        let answerRow = tableSummary.insertRow();
        let cell = answerRow.insertCell();
        let question = summary.answers[i].question;
        let correctAnswer = summary.answers[i].correct;

        cell.innerHTML = "<span class='questionNumberSummary'>" + (i + 1).toString() + "</span>";
        cell.innerHTML += "<span class='questionText'>: " + summary.answers[i].question + "</span>";
        cell.classList.add("questionSummary");

        cell = answerRow.insertCell();
        if (correctAnswer)
            cell.classList.add("answerOK");
        else
            cell.classList.add("answerBad");
        cell.innerHTML = correctAnswer ? "OK" : "Zła odpowiedź";

        cell = answerRow.insertCell();
        cell.innerHTML = correctAnswer ? "0" : summary.penalty.toString();

        cell = answerRow.insertCell();
        cell.innerHTML = summary.answers[i].avg_score.toString();

        cell = answerRow.insertCell();
        cell.innerHTML = summary.answers[i].avg_time == null ? "NaN" : summary.answers[i].avg_time.toString();

        if (!correctAnswer) {
            badAnswer.innerHTML += "<sup>" + (i + 1).toString() + " </sup>";
            badAnswer.innerHTML += "Twoja odpowiedź to: <span class='userAnswer'>" + summary.answers[i].user_answer.toString() + "</span>";
            badAnswer.innerHTML += ", poprawna odpowiedź to: <span class='correctAnswer'>" + summary.answers[i].correct_answer.toString() + "</span>";
            badAnswer.innerHTML += "<br>";
        }
    }

    let score = document.getElementById("scoreBox") as HTMLDivElement;
    score.innerHTML = "Rozwiązanie quizu zajęło ci: " + convertSecondToTimeText(totalTime) + "<br>";
    score.innerHTML += "Kara za błędne odpowiedzi: " + convertSecondToTimeText(totalPenalty) + "<br>";
    score.innerHTML += "Twój lączny wynik: " + convertSecondToTimeText(totalTime + totalPenalty);

    let ranking = document.getElementById("rankingTable") as HTMLTableElement;
    headerRow = ranking.insertRow();

    for (let i = 0; i < 2; i++)
        headerRow.appendChild(document.createElement("TH"));
    headerRow.children[0].innerHTML = "Użytkownik";
    headerRow.children[1].innerHTML = "Wynik";

    for (let i = 0; i < summary.ranking.length; i++) {
        let answerRow = ranking.insertRow();
        let cell = answerRow.insertCell();
        cell.innerHTML = summary.ranking[i].username.toString();

        cell = answerRow.insertCell();
        cell.innerHTML = summary.ranking[i].score.toString();
    }

    setTabletSummaryViewport();
    setMobileSummaryViewport();
}

quizSummary();

setTabletSummaryViewport();
setMobileSummaryViewport();
tabletSummaryViewport.addListener(setTabletSummaryViewport);
mobileSummaryViewport.addListener(setMobileSummaryViewport);