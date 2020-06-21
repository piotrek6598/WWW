let mobileMainViewport = window.matchMedia("(max-width: 600px)");
let mainPageBody = document.getElementById("BodyMainPage") as HTMLDivElement;

function setMobileMainViewport() {
    let quizChoiceHeaders = document.getElementsByClassName("quizChoiceBox") as HTMLCollectionOf<HTMLElement>;
    let quizes = document.getElementsByClassName("quiz") as HTMLCollectionOf<HTMLElement>;
    let quizScorings = document.getElementsByClassName("quizScoring") as HTMLCollectionOf<HTMLElement>;
    let penaltyLists = document.getElementsByClassName("badAnswersPenaltyList") as HTMLCollectionOf<HTMLElement>;

    if (mobileMainViewport.matches) {
        // Global changes
        document.body.style.fontSize = "10px";
        document.querySelector("header").style.fontSize = "40px";

        // Changes in main section
        mainPageBody.style.fontSize = "10px";
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
    } else {
        // Restoring global changes
        document.body.style.fontSize = "12px";
        document.querySelector("header").style.fontSize = "70px";

        // Restoring changes in main section
        mainPageBody.style.fontSize = "10px";
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
    }
}

setMobileMainViewport();
mobileMainViewport.addListener(setMobileMainViewport);