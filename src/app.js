const config = require("./config");
const log = require("log4js").getLogger();
const Telegraf = require("telegraf");

const Pinterest = require("./lib/pinterest");
const Question = require("./lib/question");
const Random = require("./lib/random");
const Retromat = require("./lib/retromat");

log.level = "info";

const Markup = require("telegraf/markup");
const bot = new Telegraf(config.token);

let activities = [];
Retromat.activitiesWithPhoto().then(
	(res) => {
		activities = res;
		log.info("Loaded " + activities.length + " activities");
	},
	(err) => log.error(err)
);

function getGlobalKeyboard() {
	return Markup.keyboard([["/random", "/metaphor", "/question"]]).resize().extra();
}

async function sendMessage(ctx, i, size) {
	if (i < size) {
		let activity = Random.elementOf(activities[i]);
		log.info("Reply by ID:" + activity.retromatId);

		if (activity.photos.length > 0) {
			log.info("Image:" + activity.photos[0]);
			try {
				await ctx.replyWithPhoto({filename: activity.name, url: activity.photos[0]});
			} catch (err) {
				log.error(err);
			}
		}

		try {
			await ctx.replyWithHTML(activity.description);
		} catch (err) {
			log.error(err);
		}

		return await sendMessage(ctx, ++i, size);
	}
}

bot.command("start", async (ctx) => {
	log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /start");
	try {
		await ctx.reply("Ок!\n/random - план ретроспективы\n/metaphor - метафора\n/question - вопрос", getGlobalKeyboard());
	} catch (err) {
		log.error(err);
	}
});

bot.command("random", async (ctx) => {
	log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /random");
	try {
		await sendMessage(ctx, 0, 5);
	} catch (err) {
		log.error(err);
		await ctx.reply(":) Sorry");
	}
});

bot.command("metaphor", async (ctx) => {
	log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /metaphor");
	try {
		let item = await Pinterest.random();
		log.info("Reply with:" + JSON.stringify(item));
		await ctx.reply(item.url, getGlobalKeyboard());
		await ctx.replyWithPhoto({filename: "metaphor", url: item.image}, {caption: item.title});
	} catch (err) {
		log.error(err);
		await ctx.reply(":) Sorry");
	}
});

bot.command("question", async (ctx) => {
	log.info(ctx.message.from.username + " [" + ctx.message.from.id + "]" + " <- /question");
	try {
		let question = Question.random();
		log.info(ctx.message.from.username + " [" + ctx.message.from.id + "] -> q" + question);
		await ctx.replyWithHTML("<b>" + question + "</b>", getGlobalKeyboard());
	} catch (err) {
		log.error(err);
		await ctx.reply(":) Sorry");
	}
});

bot.startPolling();
bot.telegram.sendMessage(config.to.id, "Started at " + new Date()).catch((err) => log.error(err));

log.info("Service has started - v2");
log.info("Please press [CTRL + C] to stop");

process.on("SIGINT", () => {
	log.info("Service has stopped");
	process.exit(0);
});

process.on("SIGTERM", () => {
	log.info("Service has stopped");
	process.exit(0);
});
