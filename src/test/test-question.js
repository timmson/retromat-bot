const Question = require("../lib/question");
const {expect} = require("chai");
require("mocha");

describe("Question should", () => {

	it("return random question.js", () => {
		const result = Question.random();

		expect(result).has.to.have.lengthOf.above(10);
	});

});