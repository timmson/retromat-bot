const Pinterest = require("../lib/pinterest");
const {expect} = require("chai");
require("mocha");

const Parser = function () {
};

describe("Pinterest should", () => {

	it("return transform rss", async () => {
		Parser.prototype.parseURL = function () {
			return {
				items: [{
					title: "three pigs",
					link: "https://www.pinterest.ru/pin/709317010046941950/",
					content: "<a href=\"https://www.pinterest.ru/pin/709317010046941950/\"> <img src=\"https://i.pinimg.com/236x/39/0b/f3/390bf375d46536683cf055ad924dcb08.jpg\"></a>"
				}]
			};
		};

		const result = await Pinterest.random(new Parser());

		expect(result.title).is.equal("three pigs");
		expect(result.url).is.equal("https://www.pinterest.ru/pin/709317010046941950/");
		expect(result.image).is.equal("https://i.pinimg.com/564x/39/0b/f3/390bf375d46536683cf055ad924dcb08.jpg");
	});

});