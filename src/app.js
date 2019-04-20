const config = require("./config.js");
const log = require("log4js").getLogger();
//const packageInfo = require("./package.json");

log.level = "info";

const Telegraf = require("telegraf");
//const Markup = require("telegraf/markup");
const bot = new Telegraf(config.token);

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
        await ctx.reply("Ok! Send command /random to generate your retrospective plan");
    } catch (err) {
        log.error(err);
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
