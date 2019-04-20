const request = require("request");

function getRandomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1));
}

request("https://retromat.org/activities.json?locale=ru", async (err, response, body) => {
    let activitiesRaw = JSON.parse(body);
    let activities = [];
    activitiesRaw.forEach((activity) => {
        if (activities[parseInt(activity.phase)] === undefined) {
            activities[parseInt(activity.phase)] = [];
        }
        activities[parseInt(activity.phase)].push(activity);
    });
    let message = activities.slice(0, 5).reduce((activity, phase) => {
        let a = phase[getRandomInt(phase.length)];
        activity += a.name + "(" + a.summary + ")\n";
        return activity;
    }, "");
    console.log(message);
});
