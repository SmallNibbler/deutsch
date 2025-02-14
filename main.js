const articleColors = {
    masculine: "#00bcd4",
    feminine: "#ffc0cb",
    neutral: "#ffeb3b"
};

const infoElement = document.getElementById("info");

let question, answer;

function nextQuestion() {
    // Get random pair from dictionary
    const dict = dictionary; // From data.js file
    const keys = Object.keys(dict);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    infoElement.textContent = randomKey;

    question = randomKey;
    answer = dict[randomKey];
}

function changeBackgroundColor() {
    const match = answer.match(/^(der|die|das)\s+(.+)$/i);
    let articleColor;

    if (match) {
        switch (match[1].toLowerCase()) {
            case "der":
                articleColor = articleColors.masculine;
                break;
            case "die":
                articleColor = articleColors.feminine;
                break;
            case "das":
                articleColor = articleColors.neutral;
                break;
        }
    } else return;

    document.body.style.backgroundColor = articleColor;
}

nextQuestion();

document.getElementById("answer").addEventListener("keyup", (event) => {
    if(event.key != "Enter") return;

    // If the result was obtained, then we move on to the next question.
    if(event.target.style.color == "green") {
        event.target.style.color = "white";
        event.target.value = "";
        document.body.style.backgroundColor = "#9e9e9e";
        nextQuestion();
        return;
    }
    
    const guess = event.target.value.trim();
    if(guess.toLowerCase() == answer.toLowerCase()) {
        event.target.style.color = "green";
    } else {
        infoElement.textContent = answer;
        event.target.value = "";
    }
    changeBackgroundColor()
});