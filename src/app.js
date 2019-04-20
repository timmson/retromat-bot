const config = require("./config.js");
const log = require("log4js").getLogger();
const request = require("request");
//const packageInfo = require("./package.json");

log.level = "info";

const Telegraf = require("telegraf");
//const Markup = require("telegraf/markup");
const bot = new Telegraf(config.token);

const phases = [
    "1️⃣  - Создание атмосферы",
    "2️⃣  - Сбор информации",
    "3️⃣  - Формирование понимания",
    "4️⃣  - Выработка плана действий",
    "5️⃣  - Завершение ретроспективы",
    "Что-то совсем другое"
];

function getRandomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1));
}

let activities = [];
request("https://retromat.org/activities.json?locale=ru", async (err, response, body) => {
    if (err || response.statusCode !== 200) {
        log.error(err || "error: " + (response || response.statusCode));
    } else {
        let activitiesRaw = JSON.parse(body);
        activitiesRaw.forEach((activity) => {
            let phaseId = parseInt(activity.phase);
            activity.phase = phases[phaseId];
            activities[phaseId] = activities[phaseId] || [];
            activities[phaseId].push(activity);
        });
        log.info("Loaded " + activities.length + " activities");
    }
});

bot.command("start", async (ctx) => {
    log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /start");
    try {
        await ctx.reply("Ok! Send command /random to generate your retrospective plan");
    } catch (err) {
        log.error(err);
    }
});

bot.command("random", async (ctx) => {
    log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /random");
    try {
        let message = activities.slice(0, 5).reduce((activity, phase, i) => {
            let a = phase[getRandomInt(phase.length)];
            activity += "<b>Стадия:</b> " + a.phase + "\n";
            activity += "<b>Название:</b> " + a.name + "\n";
            activity += "<b>Цель:</b> " + a.summary + "\n";
            activity += "<b>Описание:<b> " + a.desc.replace(/<[^>]*>/g, "").replace("'", "").replace("«", "\"") + "\n\n";
            return activity;
        }, "");
        log.info("Reply: " + message);
        await ctx.replyWithHTML(message);
    } catch (err) {
        log.error(err);
        await ctx.reply(":) Sorry");
    }
});

bot.startPolling();
bot.telegram.sendMessage(config.to.id, "Started at " + new Date()).catch((err) => log.error(err));

log.info("Service has started");
log.info("Please press [CTRL + C] to stop");

process.on("SIGINT", () => {
    log.info("Service has stopped");
    process.exit(0);
});

process.on("SIGTERM", () => {
    log.info("Service has stopped");
    process.exit(0);
});
