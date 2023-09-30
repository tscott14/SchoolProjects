const bcrypt = require('bcrypt')
const { response } = require('express')

const AuthDispatcher = require('../auth/AuthDispatcher')
const Account = require('../models/Account')

/**
 * This will process the POST request and will attempt
 * to create a new user and add them to the database.
 *
 * @param req -- Request send from the user/client.
 * @param res -- The responce for the user/client.
 *
 * @return A success JSON message if successful, an error JSON msg otherwise.
 */
module.exports.signup = async (req, res) => {
	const { usertag, username, email, password /*paid*/ } = req.body
	//console.log(usertag)

	// Validate unique usernamecontroller
	if (await Account.exists({ usertag: usertag })){
		console.log("usertag-taken")
		return res.status(422).json({ error: 1, error_msg: 'usertag-taken' })
	}
		

	// Validate unique email
	if (await Account.exists({ email: email })){
		console.log("email-taken")
		return res.status(422).json({ error: 1, error_msg: 'email-taken' })
	}
		

	// Salt and Hash password for database storage
	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(password, salt)

	// Print out debug info
	console.log(
		`Adding user ${username}:\n\temail: ${email}\n\tpassword: ${hashedPassword}`
	)

	// Add the user to the database
	await Account.create({
		usertag: usertag,
		username: username,
		email: email,
		password: hashedPassword,
	})

	// Tell the client that they registered successfully.
	res.status(201).json({ error: 0, redirect: '/' })
}
