const r = require("request");

const phases = [
	"1️⃣  - Создание атмосферы",
	"2️⃣  - Сбор информации",
	"3️⃣  - Формирование понимания",
	"4️⃣  - Выработка плана действий",
	"5️⃣  - Завершение ретроспективы",
	"Что-то совсем другое"
];

const request = (req) => req || r;

const normalizeUrl = (photoUrl) => (photoUrl.startsWith("http") ? "" : "https://retromat.org/") + photoUrl;

class Retromat {

	static async activitiesWithPhoto(req) {
		let photos = this.photos(req);

		let activities = [];
		let activitiesRaw = await this.activitiesAsRaw(req);

		activitiesRaw.forEach((activity) => {
			let phaseId = parseInt(activity.phase);
			activity.phase = phases[phaseId];

			activity.description = 	[
				"<b>Стадия:</b> " + activity.phase,
				"<b>Название:</b> " + activity.name,
				"<b>Цель:</b> " + activity.summary,
				"<b>Описание:</b> " + activity.desc.replace(/<[^>]*>/g, ""),
				"https://retromat.org/ru/?id=" + activity.retromatId
			].join("\n");

			let photo = photos[activity.retromatId - 1];
			activity.photos = (photo !== undefined ? photo : []);

			activities[phaseId] = activities[phaseId] || [];
			activities[phaseId].push(activity);
		});

		return activities;
	}

	static activitiesAsRaw(req) {
		return new Promise((resolve, reject) =>
			request(req)("https://retromat.org/activities.json?locale=ru", (err, response, body) => {
				let activities = [];
				if (err || response.statusCode !== 200) {
					reject(err || "error: " + (response || response.statusCode));
				} else {
					activities = JSON.parse(body);
				}
				resolve(activities);
			})
		);
	}

	static async activities(req) {
		let activities = [];
		let activitiesRaw = await this.activitiesAsRaw(req);
		activitiesRaw.forEach((activity) => {
			let phaseId = parseInt(activity.phase);
			activity.phase = phases[phaseId];
			activities[phaseId] = activities[phaseId] || [];
			activities[phaseId].push(activity);
		});
		return activities;
	}

	static photos(req) {
		return new Promise((resolve, reject) =>
			request(req)("https://retromat.org/static/lang/photos.js", async (err, response, body) => {
				if (err || response.statusCode !== 200) {
					reject(err || "error: " + (response || response.statusCode));
				} else {
					let photos = eval("let all_photos = [];\n" + body + "\nall_photos;");
					resolve(photos.map(p => p.map((ps) => normalizeUrl(ps.filename))));
				}
			})
		);

	}


}

module.exports = Retromat;