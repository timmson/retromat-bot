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

	/*	static async activitiesWithPhoto(req) {
			let data = Promise.all([this.activities(req), this.photos(req)]);
			let activities = data[0];
			let photos = data[1];
		}*/

	static activities(req) {
		return new Promise((resolve, reject) =>
			request(req)("https://retromat.org/activities.json?locale=ru", (err, response, body) => {
				let activities = [];
				if (err || response.statusCode !== 200) {
					reject(err || "error: " + (response || response.statusCode));
				} else {
					let activitiesRaw = JSON.parse(body);
					activitiesRaw.forEach((activity) => {
						let phaseId = parseInt(activity.phase);
						activity.phase = phases[phaseId];
						activities[phaseId] = activities[phaseId] || [];
						activities[phaseId].push(activity);
					});
				}
				resolve(activities);
			})
		);
	}

	static photos(req) {
		return new Promise((resolve, reject) =>
			request(req)("https://retromat.org/static/lang/photos.js", async (err, response, body) => {
				if (err || response.statusCode !== 200) {
					reject(err || "error: " + (response || response.statusCode));
				} else {
					let all_photos = [];
					eval(body);
					resolve(all_photos.map(p => p.map((ps) => normalizeUrl(ps.filename))));
				}
			})
		);

	}


}

module.exports = Retromat;