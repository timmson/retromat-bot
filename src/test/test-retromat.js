const Retromat = require("../lib/retromat");
const {expect} = require("chai");
require("mocha");

describe("Retromat should", () => {
	const arrange = [{"retromatId": 1, "phase": 0}, {"retromatId": 2, "phase": 2}];

	it("throw an error when error", async () => {
		const mockRequest = (url, cb) => {
			cb("unknown error", {statusCode: 200}, JSON.stringify(arrange));
		};

		try {
			await Retromat.activities(mockRequest);
			expect(true).to.be.false;
		} catch (e) {
			expect(true).to.be.true;
		}

	});

	it("throw an error when statusCode is not 200", async () => {
		const mockRequest = (url, cb) => {
			cb(null, {statusCode: 500}, JSON.stringify(arrange));
		};

		try {
			await Retromat.activities(mockRequest);
			expect(true).to.be.false;
		} catch (e) {
			expect(true).to.be.true;
		}
	});


	it("return list of activities", async () => {
		const mockRequest = (url, cb) => {
			cb(null, {statusCode: 200}, JSON.stringify(arrange));
		};

		const result = await Retromat.activities(mockRequest);

		expect(result).to.have.lengthOf(3);
	});


});