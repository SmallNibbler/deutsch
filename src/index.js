import Database from "./database.js";

let question, answer;
let state = "init";

function init() {
    [question, answer] = Database.getRelevantExercise();
    document.getElementById("info").textContent = question;
    document.body.style.backgroundColor = "#121212";
    const inputField = document.getElementById("input");
    inputField.style.borderColor = "#00aaff";
    inputField.value = "";
    state = "guess";
}

init();

document.getElementById("input").addEventListener("keyup", (event) => {
    if(event.key != "Enter") return;

    let guess;
    switch (state) {
        case "init":
            init();
        break;
        case "guess":
            guess = event.target.value.trim();
            if(guess.toLowerCase() == answer.toLowerCase()){
                // Correct answer
                document.getElementById("input").style.borderColor = "green";
                const modifier = Math.max(1, Database.getModifier(question) - 1);
                Database.setModifier(question, modifier);
                state = "init";
            } else {
                // Wrong answer
                const modifier = Math.min(10, Database.getModifier(question) + 2);
                Database.setModifier(question, modifier);
                document.getElementById("info").textContent += ` - ${answer}`;
                document.getElementById("input").style.borderColor = "red";
                event.target.value = "";
                state = "repeat";
            }

            textToSpeech(answer);

            // Change background color
            const match = answer.match(/^(der|die|das)\s+(.+)$/i);
            switch (match ? match[1].toLowerCase() : "") {
                case "der": document.body.style.backgroundColor = "#2A6F9B"; break;
                case "die": document.body.style.backgroundColor = "#C94C66"; break;
                case "das": document.body.style.backgroundColor = "#A67C00"; break;
            }
        break;
        case "repeat":
            guess = event.target.value.trim();
            if(guess.toLowerCase() == answer.toLowerCase()) {
                document.getElementById("input").style.borderColor = "green";
                state = "init";
            }
        break;
    }  
});

// Выбор голоса
const voices = speechSynthesis.getVoices();
const deVoice = voices.find(voice => voice.lang === 'de-DE');

function textToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = deVoice;
    utterance.lang = 'de-DE';
    // Установка скорости и высоты голоса
    utterance.rate = 1; // 0.1 - 10
    utterance.pitch = 1; // 0 - 2
    speechSynthesis.speak(utterance);
}