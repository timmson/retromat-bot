const Random = require("./random")
const Parser = require("rss-parser")
const p = new Parser()

const parser = (prs) => prs || p

class Pinterest {

	static async random(prs) {
		let feed = await parser(prs).parseURL("https://www.pinterest.ru/timmson666/retro-ideas.rss")
		return this.transform(Random.elementOf(feed.items))
	}

	static async transform(item) {
		let image = item.content.match("<img.*jpg\">")[0].match("http.*jpg")[0].replace("236x", "564x")
		return {
			title: item.title,
			url: item.link,
			image: image
		}
	}

}

module.exports = Pinterest