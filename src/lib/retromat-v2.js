const axios = require("axios")

const phases = [
	"1️⃣  - Создание атмосферы",
	"2️⃣  - Сбор информации",
	"3️⃣  - Формирование понимания",
	"4️⃣  - Выработка плана действий",
	"5️⃣  - Завершение ретроспективы",
	"Что-то совсем другое"
]

const normalizeUrl = (photoUrl) => (photoUrl.startsWith("http") ? "" : "https://retromat.org/") + photoUrl

const fetchActivities = () =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await axios.get("https://retromat.org/api/activities?locale=ru")
			resolve(response.data)
		} catch (err) {
			reject(err)
		}
	})


const fetchPhotos = () =>
	new Promise(async (resolve, reject) => {
		try {
			const response = await axios.get("https://retromat.org/static/lang/photos.js")
			const photos = eval("let all_photos = [];\n" + response.data + "\nall_photos;")
			resolve(photos.map(p => p.map((ps) => normalizeUrl(ps.filename))))
		} catch (err) {
			reject(err)
		}
	})

const fetchActivitiesWithPhoto = async () => {
	const photos = await fetchPhotos()

	const activities = []
	const activitiesRaw = await fetchActivities()

	activitiesRaw.forEach((activity) => {
		let phaseId = parseInt(activity.phase)
		activity.phase = phases[phaseId]

		activity.description = [
			"<b>Стадия:</b> " + activity.phase,
			"<b>Название:</b> " + activity.name,
			"<b>Цель:</b> " + activity.summary,
			"<b>Описание:</b> " + activity.desc.replace(/<[^>]*>/g, ""),
			"https://retromat.org/ru/?id=" + activity.retromatId
		].join("\n")

		let photo = photos[activity.retromatId - 1]
		activity.photos = (photo !== undefined ? photo : [])

		activities[phaseId] = activities[phaseId] || []
		activities[phaseId].push(activity)
	})

	return activities
}

module.exports = {
	fetchPhotos: fetchPhotos,
	fetchActivities: fetchActivities,
	fetchActivitiesWithPhoto: fetchActivitiesWithPhoto
}
