const config = require("./config");
const questions = require("./questions");
const log = require("log4js").getLogger();
const request = require("request");
let Parser = require('rss-parser');
const Telegraf = require("telegraf");

log.level = "info";

const Markup = require("telegraf/markup");
const bot = new Telegraf(config.token);
const parser = new Parser();

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

function sendMessage(ctx, i, size) {
    if (i < size) {
        let activity = activities[i][getRandomInt(activities[i].length - 1)];
        let message = [
            "<b>Стадия:</b> " + activity.phase,
            "<b>Название:</b> " + activity.name,
            "<b>Цель:</b> " + activity.summary,
            "<b>Описание:</b> " + activity.desc.replace(/<[^>]*>/g, ""),
            "https://retromat.org/ru/?id=" + activity.retromatId
        ].join("\n");
        log.info("Reply by ID:" + activity.retromatId);
        let photo = photos[activity.retromatId - 1];
        if (photo !== undefined && photo.length > 0) {
            let fileName = (photo[0].filename.startsWith("http") ? "" : "https://retromat.org/") + photo[0].filename;
            log.info("Image:" + fileName);
            ctx.replyWithPhoto({
                filename: activity.name,
                url: fileName
            }).then(() =>
                    ctx.replyWithHTML(message).then(() => sendMessage(ctx, ++i, size), (err) => log.error(err)),
                (err) => {
                    log.error(err);
                    ctx.replyWithHTML(message).then(() => sendMessage(ctx, ++i, size), (err) => log.error(err));
                })
        } else {
            ctx.replyWithHTML(message).then(() => sendMessage(ctx, ++i, size), (err) => log.error(err))
        }

    }
}

function getGlobalKeyboard() {
    return Markup.keyboard([
        ["/random", "/metaphor"/*, "/question"*/]
    ]).resize().extra()
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

let photos = [];
request("https://retromat.org/static/lang/photos.js", async (err, response, body) => {
    if (err || response.statusCode !== 200) {
        log.error(err || "error: " + (response || response.statusCode));
    } else {
        eval(body);
        photos = all_photos;
        log.info("Loaded " + photos.length + " photos");
    }
});

bot.command("start", async (ctx) => {
    log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /start");
    try {
        await ctx.reply("Ок!\n" +
            "/random - план ретроспективы\n" +
            "/metaphor - метафора\n" +
            "/question - вопрос для размыщлений"
            , getGlobalKeyboard());
    } catch (err) {
        log.error(err);
    }
});

bot.command("random", async (ctx) => {
    log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /random");
    try {
        sendMessage(ctx, 0, 5);
    } catch (err) {
        log.error(err);
        await ctx.reply(":) Sorry");
    }
});

bot.command("metaphor", async (ctx) => {
    log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /metaphor");
    try {
        let feed = await parser.parseURL("https://www.pinterest.ru/timmson666/retro-ideas.rss");
        let item = feed.items[getRandomInt(feed.items.length - 1)];
        await ctx.reply(item.link, getGlobalKeyboard());
    } catch (err) {
        log.error(err);
        await ctx.reply(":) Sorry");
    }
});

bot.command("question", async (ctx) => {
    log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /question");
    try {
        let num = getRandomInt(questions - 1);
        await ctx.replyWithHTML("<b>Вопрос №" + num + ".</b> " + questions[num], getGlobalKeyboard());
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
