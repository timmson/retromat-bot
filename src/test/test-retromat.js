const Retromat = require("../lib/retromat");
const {expect} = require("chai");
require("mocha");

describe("When activities is called Retromat should", () => {
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

describe("When photos is called Retromat should", () => {
	const response = "var path = '/static/images/activities/';" +
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
		"];";

	it("throw an error when error", async () => {
		const mockRequest = (url, cb) => {
			cb("unknown error", {statusCode: 200}, response);
		};

		try {
			await Retromat.photos(mockRequest);
			expect(true).to.be.false;
		} catch (e) {
			expect(true).to.be.true;
		}

	});

	it("throw an error when statusCode is not 200", async () => {
		const mockRequest = (url, cb) => {
			cb(null, {statusCode: 500}, response);
		};

		try {
			await Retromat.photos(mockRequest);
			expect(true).to.be.false;
		} catch (e) {
			expect(true).to.be.true;
		}
	});

	it("return list of photos", async () => {
		const mockRequest = (url, cb) => {
			cb(null, {statusCode: 200}, response);
		};

		const result = await Retromat.photos(mockRequest);

		expect(result).to.have.lengthOf(3);

		expect(result[0][0]).is.equal("https://retromat.org//static/images/activities/1_ESVP.jpg");
		expect(result[0][1]).is.equal("http://test/1_ESVP_2.jpg");
		expect(result[1]).to.be.undefined;
		expect(result[2][0]).is.equal("http://test/2_Weather-Report.jpg");
	});

});