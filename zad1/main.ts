let selectedQuiz = 1;

function chooseQuiz(quiz : number) {
    selectedQuiz = quiz;
}

document.getElementById("testSpan").innerText = "To jest quiz " + selectedQuiz;