const axios = require("axios")
const retromat = require("../lib/retromat-v2")

jest.mock("axios")

describe("Retromat should", () => {


	test("load activities", async () => {
		const arrange = [{"retromatId": 1, "phase": 0}, {"retromatId": 2, "phase": 2}]

		axios.get.mockResolvedValue({statusCode: 200, data: arrange})

		const result = await retromat.fetchActivities()

		expect(result).toHaveLength(2)
	})


	test("throw an error when statusCode is not 200", async () => {
		axios.get.mockResolvedValue({statusCode: 200, data: ""})

		try {
			await retromat.fetchActivities()
			expect(true).toBeFalsy()
		} catch (e) {
			expect(true).toBeTruthy()
		}
	})


	test("should load photos", async () => {
		const arrange = "var path = '/static/images/activities/';" +
            "" +
            "all_photos = [];" +
            "all_photos[0] = [" +
            "{filename:    path + \"1_ESVP.jpg\", contributor: \"Reguel Wermelinger\"}," +
            "{filename:    \"http://test/1_ESVP_2.jpg\", contributor: \"Manuel\"}" +
            "];" +
            "all_photos[2] = [" +
            "{filename:    \"http://test/2_Weather-Report.jpg\", contributor: \"Philipp Flenker\"}," +
            "{filename:    path + \"2_Weather-Report-2.jpg\", contributor: \"Stefanie Kreidler\"}," +
            "{filename:    path + \"2_Weather-Report-3.jpg\", contributor: \"Cornelia Jost\"}" +
            "];"

		axios.get.mockResolvedValue({statusCode: 200, data: arrange})

		const result = await retromat.fetchPhotos()

		expect(result).toHaveLength(3)

		expect(result[0][0]).toEqual("https://retromat.org//static/images/activities/1_ESVP.jpg")
		expect(result[0][1]).toEqual("http://test/1_ESVP_2.jpg")
		expect(result[1]).toBeUndefined()
		expect(result[2][0]).toEqual("http://test/2_Weather-Report.jpg")
	})

	test("throw an error when statusCode is 500", async () => {
		axios.get.mockResolvedValue({statusCode: 500, data: []})

		try {
			await retromat.fetchPhotos()
			expect(true).toBeFalsy()
		} catch (e) {
			expect(true).toBeTruthy()
		}
	})

})
