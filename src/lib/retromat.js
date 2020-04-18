const r = require("request");

const phases = [
	"1️⃣  - Создание атмосферы",
	"2️⃣  - Сбор информации",
	"3️⃣  - Формирование понимания",
	"4️⃣  - Выработка плана действий",
	"5️⃣  - Завершение ретроспективы",
	"Что-то совсем другое"
];

class Retromat {

	static activities(req) {
		const request = req || r;
		return new Promise((resolve, reject) => {
			request("https://retromat.org/activities.json?locale=ru", (err, response, body) => {
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
			});
		});
	}

}

module.exports = Retromat;