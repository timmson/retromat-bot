class Random {

	static elementOf(array) {
		if (array !== undefined && Array.isArray(array) && array.length > 0) {
			return array[Math.floor(Math.random() * array.length)]
		}
		return undefined
	}

}

module.exports = Random