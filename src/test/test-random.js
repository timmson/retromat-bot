const Random = require("../lib/random")


describe("Random should", () => {

	it("return 'undefined' when element is 'undefined'", () => {
		const array = undefined

		const result = Random.elementOf(array)

		expect(result).toBeUndefined()
	})

	it("return 'undefined' when element is not an array", () => {
		const array = ""

		const result = Random.elementOf(array)

		expect(result).toBeUndefined()
	})


	it("return 1 when array is [1]", () => {
		const array = [1]

		const result = Random.elementOf(array)

		expect(result).toEqual(1)
	})

	it("return random array element when array is [1,2,3]", () => {
		const array = [1, 2, 3]

		const result = Random.elementOf(array)

		expect(result).not.toBeNull()
	})

})