function getRandomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1));
}

const questions = require("./questions");
let num = getRandomInt(questions.length - 1);
console.log("<b>Вопрос №" + num + ".</b> " + questions[num]);