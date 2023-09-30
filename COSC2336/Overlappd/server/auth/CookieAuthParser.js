const AuthToken = require('./AuthToken')

/**
 * This will process the cookies from the user
 * and check for authentication and authorization.
 *
 * @param req -- The request from the client/browser.
 * @param res -- The response to the client/browser.
 * @param next -- The next piece of middleware.
 */
module.exports.process = (req, res, next) => {
	if (req.session) {
		res.status(500).json({
			error: { msg: 'INTERNAL SERVER ERROR in CookieAuthParser.js' },
		})
		console.error('This branch should NEVER have been called!')
		return
	}

	const session = req.cookies && req.cookies.session
	AuthToken.process(req, res, session)
	next()
}
