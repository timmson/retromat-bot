const Random = require("../lib/random");
const {expect} = require("chai");
require("mocha");

describe("Random should", () => {

	it("return 'undefined' when element is 'undefined'", () => {
		const array = undefined;

		const result = Random.getRandomElement(array);

		expect(result).to.be.undefined;
	});

	it("return 'undefined' when element is not an array", () => {
		const array = "";

		const result = Random.getRandomElement(array);

		expect(result).to.be.undefined;
	});


	it("return 1 when array is [1]", () => {
		const array = [1];

		const result = Random.getRandomElement(array);

		expect(result).is.eq(1);
	});

	it("return random array element when array is [1,2,3]", () => {
		const array = [1, 2, 3];

		const result = Random.getRandomElement(array);

		expect(result).is.not.null;
	});

});