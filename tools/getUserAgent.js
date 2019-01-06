const { USERAGENT } = require('./userAgent')

const randomUserAgent = () => USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]

module.exports = {
	randomUserAgent,
}
