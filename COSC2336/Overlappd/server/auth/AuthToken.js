const jwt = require('jsonwebtoken')

/**
 * This will append the authToken to the request body.
 *
 * @param req -- Request sent by the client/browser.
 * @param res -- The response to be sent back to the client/browser.
 * @param decoded -- This is the decoded JWT given by the cookie/header
 */
const createSession = (req, res, decoded) => {
	// So, if the token sent to the server does not possess all three
	// fields, the authToken will not be propagated to the remaining
	// middleware. Basically, this is an invalid token.
	//console.log(req)
	if (
		decoded.usertag == null ||
		decoded.username == null ||
		decoded.email == null ||
		decoded.dateCreated == null
	) {
		console.error('Necessary fields not decoded!')
		console.error(`\tTag: [${decoded.usertag}]`)
		console.error(`\tUsername: [${decoded.username}]`)
		console.error(`\tEmail: [${decoded.email}]`)
		console.error(`\tDate Created: [${decoded.dateCreated}]`)
		return
	}

	req.session = {
		usertag: decoded.usertag,
		username: decoded.username,
		email: decoded.email,
		dateCreated: decoded.dateCreated,
	}
}

module.exports = {
	/**
	 * Verify the JWT as legitament and enable propagation of an
	 * AuthToken throughout the remaining middlewares.
	 *
	 * @param req -- Request sent by the client/browser.
	 * @param res -- The response to be sent back to the client/browser.
	 * @param token -- The JWT to be decoded and verified.
	 */
	process: (req, res, token) => {
		jwt.verify(token, process.env.JWT_ACCESS_TOKEN_PHRASE, (err, decoded) => {
			if (err == null) createSession(req, res, decoded)
			//console.log(req.session)
		})
		
	},

	/**
	 * Wrapper for jwt sign functionality.
	 *
	 * @param payload -- The data to hash.
	 * @returns The hashed payload as a JSON Web Token.
	 */
	sign: (payload) => {
		return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_PHRASE)
	},
}
