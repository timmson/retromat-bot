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

function sendMessage(ctx, activities, i, size) {
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
        log.info(photo);
        if (photo.length > 0) {
            log.info("https://retromat.org/" + photo[0].filename);
            ctx.replyWithPhoto({
                filename: activity.name,
                source: "https://retromat.org/" + photo[0].filename
            }).then(() =>
                    ctx.replyWithHTML(message).then(() => sendMessage(ctx, activities, ++i, size), (err) => log.error(err)),
                (err) => {
                    log.error(err);
                    ctx.replyWithHTML(message).then(() => sendMessage(ctx, activities, ++i, size), (err) => log.error(err));
                })
        } else {
            ctx.replyWithHTML(message).then(() => sendMessage(ctx, activities, ++i, size), (err) => log.error(err))
        }

    }
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
        let photo = all_photos;
        log.info("Loaded " + photo.length + " photos");
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
        sendMessage(ctx, activities, 0, 5);
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
