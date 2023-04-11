const Question = require("../lib/question")

describe("Question should", () => {

	it("return random question", () => {
		const result = Question.random()

		expect(result.length).toBeGreaterThanOrEqual(10)
	})

})