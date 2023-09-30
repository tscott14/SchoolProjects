const bcrypt = require('bcrypt')

const Account = require('../models/Account')
const AuthToken = require('../auth/AuthToken')

module.exports.createAccount = async (req, res) => {
	/**
	 * Before creating an account, the server must check to see if
	 * there already exists a record in the database with either
	 * the usertag or email provided from the client. If either of
	 * these are found in the database, the first instance of this
	 * case will be retrieved by the Account model.
	 */
	const possible_account = await Account.findOne({
		$or: [{ usertag: req.body.usertag }, { email: req.body.email }],
	})

	/**
	 * When creating an account, the server must verify that the account
	 * being created does NOT possess the same usertag present as recorded
	 * in another account record. This is due to the fact that the usertag
	 * is unique to each account and cannot be duplicated amongst two or
	 * more accounts. One usertag for one account, one account for one usertag.
	 */
	if (possible_account && possible_account.usertag === req.body.usertag) {
		res.status(422).json({ error: { msg: 'usertag-taken' } })
		console.info(
			`ACCOUNT CREATION ERROR: usertag \"${req.body.usertag}\" already taken! =(`
		)
		return
	}

	/**
	 * When creating an account, the server must verify that the account
	 * being created does NOT possess the same email present as recorded
	 * in another account record. This is due to the fact that the email
	 * is unique to each account and cannot be duplicated amongst two or
	 * more accounts. One email for one account, one account for one email.
	 */
	if (possible_account && possible_account.email === req.body.email) {
		res.status(422).json({ error: { msg: 'email-taken' } })
		console.info(
			`ACCOUNT CREATION ERROR: email \"${req.body.email}\" already taken! =(`
		)
		return
	}

	/**
	 * The password stored in the database is NOT the character string
	 * entered by the client. Instead, this password provided by the
	 * client is hashed and it is this hashed password which is then
	 * send to the database. This hash also utilizes a salt that only
	 * improves security against brute-force attacks.
	 */
	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(req.body.password, salt)

	/**
	 * Once all the account information is gathered and verified for
	 * entry into the database, the Account model is used to insert
	 * the respective fields below into the database. The success of
	 * this command is uncertain.
	 */
	const account = await Account.create({
		usertag: req.body.usertag,
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
	})

	/**
	 * To verify the success of the account insertion into the database,
	 * the object returned is checked to exist. If it does NOT exist,
	 * then there is a critical and unknown internal server error. No
	 * changes are made to the database.
	 */
	if (!account) {
		res.status(500).json({ error: { msg: 'internal-server-error' } })

		console.error(
			`ACCOUNT CREATION ERROR: unable to create account \"${req.body.usertag}\"! =(`
		)
		return
	}

	/**
	 * To notify the client that the account has been successfully created
	 * and inserted into the database, a basic JSON message is returned;
	 * with it stating no error was encountered. The account creation is
	 * also traced.
	 */
	res.status(201).json({ error: 0, redirect: '/' })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`ACCOUNT CREATION: Successfully created account \"${req.body.usertag}\"! =)`
	)
}

module.exports.modifyAccount = async (req, res) => {
	/**
	 * In-order to modify an account requires access to an account; for
	 * access to an account requires the client to send an HTTP
	 * request, to be signed-in. The session, which is obtained through
	 * possessing the appropriate cookies, is the means of verifying that
	 * the client is signed into an account.
	 */
	if (!req.session) {
		res.status(401).json({ error: { msg: 'unauthorized' } })
		console.info(
			'ACCOUNT MUTATION ERROR: client is NOT logged in. Who to modify?! =('
		)
		return
	}

	/**
	 * Before quering the database, which could be time consuming depending
	 * on the number of registered accounts, the modifyAccount routine will
	 * verify that some change is ultimately being requested by the user. If
	 * no change is requested, then the routine is terminated and the client
	 * is send a client input error.
	 */
	if (
		req.body.new_username == null &&
		req.body.new_email == null &&
		req.body.new_password == null
	) {
		res.status(422).json({ error: { msg: 'no-change-requested' } })
		console.info(
			`ACCOUNT MUTATION ERROR: request possessed no fields to change! =(`
		)
		return
	}

	// Assuming the req.session is properly setup.

	/**
	 * To get the account record associated with the usertag provided by the
	 * request's session, the Account model is used to get an account with
	 * a 'usertag' value that matches the 'usertag' field present in the
	 * request's session object. Once the record associated with the 'usertag'
	 * is found, it will be validated and mutated. If no such 'usertag' exists,
	 * then further processing will be required.
	 */
	const account = await Account.findOne({ usertag: req.session.usertag })

	/**
	 * To check the existence of the record, the 'account' object returned above
	 * will be null if no such record was found which matched the 'usertag' provided
	 * by the request's session. If this 'account' object is non-existent, then
	 * a client input error is returned to the client. Afterwards, this routine will
	 * immediately terminate.
	 */
	if (!account) {
		res.status(422).json({ error: { msg: 'usertag-NOT-found' } })
		console.info(
			`ACCOUNT MUTATION ERROR: usertag \"${req.session.usertag}\" NOT found in database! =(`
		)
		return
	}

	/**
	 * The 'username' can be mutated easily by providing the field 'new_username' within
	 * the body of the request. This will change the 'username' present on the account to
	 * the value of 'new_username' if it exists, else it will preserve it as it was before.
	 * This option is optional for this request, it does NOT need to be specified.
	 */
	account.username = req.body.new_username || account.username

	/**
	 * Before changing the email on the local copy of the account record matching the
	 * usertag of the client's session, the 'new_email' suggested by the request must
	 * be matched against all other emails to verify that the new email is still a
	 * unique email that is NOT being used by any other accounts. If another account
	 * is already using the email, the routine is terminated and the client is sent
	 * a client input error. No changes were made in this case.
	 */
	if (await Account.exists({ email: req.body.new_email })) {
		res.status(422).json({ error: { msg: 'new-email-already-taken' } })
		console.info(
			`ACCOUNT MUTATION ERROR: new email ${req.body.new_email} is already taken! =(`
		)
		return
	}

	/**
	 * The 'email' can be mutated easily by providing the field 'new_email' within
	 * the body of the request. This will change the 'email' present on the account to
	 * the value of 'new_email' if it exists, else it will preserve it as it was before.
	 * This option is optional for this request, it does NOT need to be specified.
	 */
	account.email = req.body.new_email || account.email

	/**
	 * The 'password' can be mutated easily by providing the field 'new_password' within
	 * the body of the request. This will change the 'password' present on the account to
	 * the value of 'new_password' if it exists, else it will preserve it as it was before.
	 * This option is optional for this request, it does NOT need to be specified.
	 */
	if (req.body.new_password) {
		const salt = await bcrypt.genSalt()
		account.password = await bcrypt.hash(req.body.new_password, salt)
	}

	/**
	 * The mutations made to the account can now be applied. This will be the line that
	 * actually changes the database entry. The previous lines only modified our local
	 * copy. This method may fail, so that will need to be taken into account.
	 */
	const status = account.save()

	/**
	 * To check for any errors in regards to the account database collection update, the
	 * value 'status' is check to verify the status returned by the Account model. If it
	 * failed to save the changes to the database, then no changes have been made to the
	 * database and the program will immediately terminate. The client will be sent an
	 * internal server error.
	 */
	if (!status) {
		res.status(500).json({ error: { msg: 'internal-server-error' } })
		console.error(
			'ACCOUNT MUTATION ERROR: failed to apply changes to database! =('
		)
		return
	}

	/**
	 * Once all validation has been successfully completed, the account has been updated.
	 * Any actions taken in regards to the changes made will reflect the new state of the
	 * account as presented within the database. The client is send a simple created HTTP
	 * (201) response.
	 */
	res.status(201).json({ error: 0 })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`ACCOUNT MUTATION: Successfully modified account \"${account.usertag}\"! =)`
	)
}

module.exports.deleteAccount = async (req, res) => {
	/**
	 * In-order to delete an account requires access to an account; for
	 * access to an account will require the client that sent the HTTP
	 * request, to be signed-in. The session, which is obtained through
	 * possessing the appropriate cookies, is the means of verifying that
	 * the client is signed into an account.
	 */
	if (!req.session) {
		res.status(401).json({ error: { msg: 'unauthorized' } })
		console.info(
			'ACCOUNT DELETION ERROR: client is NOT logged in. Who to delete?! =('
		)
		return
	}

	// Assuming the req.session is properly setup.

	/**
	 * To delete the account, this routine will task the Account model to
	 * remove a record that possesses the same 'usertag' as the one provided
	 * by the request's session field. This could fail.
	 */
	process.stdout.write(`Deleting account \"${req.session.usertag}\"...\t`)
	const record = await Account.findOneAndDelete({
		usertag: req.session.usertag,
	})

	/**
	 * To verify that the deletion was a success, the status is being check
	 * to verify it is true, meaning the deletion was successful. Otherwise,
	 * the deletion was failed and no deletion or mutation occured within the
	 * database. The client is sent an internal server error and the routine
	 * will immediately be terminated.
	 */
	if (!record) {
		res.status(500).json({ error: { msg: 'usertag-NOT-known' } })
		console.error(
			`ACCOUNT DELETION ERROR: account \"${req.session.usertag}\" could NOT be deleted! =(`
		)
		return
	} else console.log('deleted account successfully! =)')

	/**
	 * When all validation has been accomplished, the deleteAccount routine will
	 * proceed to return a HTTP Created (201) response to indicate a change in the
	 * database resource. All further actions will reflect the deletion of the
	 * account used for this route.
	 */
	res.status(201).json({ error: 0 })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`ACCOUNT DELETION: Successfully deleted account \"${req.session.usertag}\"! =)`
	)
}


//trying authentication for homepage may need to take out
module.exports.tokenAuth = async (req, res) => {
	console.log(req)

	/**
	 * Before signing in a user, it must be verified that the email provided
	 * exists in a database record, otherwise there exists no account
	 * associated with this email, thus the signing-in process cannot
	 * continue. The email provided is used as the primary key for this search.
	 */
	console.log(req.body.email)
	const account = await Account.findOne({ email: req.body.email })

	/**
	 * The account returned to the server could still not exist. To check
	 * this, the object returned is tested to see if its not null. If it is
	 * then a client input error is returned to the client. Additionally,
	 * the server will print a warning in regards to this failure in
	 * validation.
	 */
	if (!account) {
		// User does NOT exist and thus can't sign-in
		res.status(422).json({ error: { msg: 'unknown-email' } })
		console.info(
			`SIGNING-IN ERROR: Unknown email entered \"${req.body.email}\"! =(`
		)
		return
	}

	/**
	 * Once the email provided is verified to be associated with a record in
	 * the database, the password provided by the client is then salted with
	 * the same salt used to create the account and then hashed. If the hash
	 * of the client provided password does NOT match the hashed password
	 * contained in the database, then authentication has failed and an error
	 * is sent to the client containing a client input error status.
	 */
	if (!(await bcrypt.compare(req.body.password, account.password))) {
		console.info(
			`SIGNING-IN ERROR: Incorrect password entered for \"${account.usertag}\"! =(`
		)
		res.status(422).json({ error: { msg: 'incorrect-password' } })
		return
	}

	/**
	 * Once authentication is verified, the contents of the account record's
	 * usertag, username, and email are all bundled into a object that will
	 * be converted into a JSON Web Token (JWT). This format will ensure the
	 * integrety of the session token against any 3rd-party tinkering and/or
	 * malformation. This token will be used for authorization in later routes.
	 */
	const session = AuthToken.sign({
		usertag: account.usertag,
		username: account.username,
		email: account.email,
		dateCreated: Date.now(),
	})

	/**
	 * To run various tests, these cookies will need to be set. This is handled
	 * manually by the browser in production since httpOnly tokens cannot be set
	 * within the javascript. These will only do what they appear to do when the
	 * HTTP request is sent by the browser directly or by a 3rd-party REST testing
	 * tool. Any fetch commands ran by the browser's javascript engine will NOT
	 * be able to properly set the browser's cookies.
	 */
	//if (process.env.NODE_ENV != 'production') {
	// Only for testing, will not work in production.
	res.cookie('session', session, { httpOnly: true })
	res.cookie('session-cert', '1')
	//}

	/**
	 * Account authentication was a success. To finish signing-in, the response
	 * sent to the client will give an OK status (200) and several fields needed
	 * to complete the signing-in process on the clients side. The JWT session
	 * token is sent as just token. The client will need to add this session to
	 * the their browser's cookies with the key being 'session'. This session will
	 * however NOT be secure. To ensure security, it is recommended that the client
	 * gets redirected to the homepage (i.e. http://*the-url*.com/). The other two
	 * fields returned are the signed-in users usertag and username. The client
	 * can use these in what ever way they desire.
	 */
	res.status(200).json({
		error: 0,
		session: session,
		session_usertag: account.usertag,
		session_username: account.username,
	})

	/**
	 * The success is traced to the console.
	 */
	console.info(`AuthCheck: Successfully authenticated \"${account.usertag}\"! =)`)
}

module.exports.signin = async (req, res) => {
	/**
	 * Before signing in a user, it must be verified that the email provided
	 * exists in a database record, otherwise there exists no account
	 * associated with this email, thus the signing-in process cannot
	 * continue. The email provided is used as the primary key for this search.
	 */
	const account = await Account.findOne({ email: req.body.email })

	/**
	 * The account returned to the server could still not exist. To check
	 * this, the object returned is tested to see if its not null. If it is
	 * then a client input error is returned to the client. Additionally,
	 * the server will print a warning in regards to this failure in
	 * validation.
	 */
	if (!account) {
		// User does NOT exist and thus can't sign-in
		res.status(422).json({ error: { msg: 'unknown-email' } })
		console.info(
			`SIGNING-IN ERROR: Unknown email entered \"${req.body.email}\"! =(`
		)
		return
	}

	/**
	 * Once the email provided is verified to be associated with a record in
	 * the database, the password provided by the client is then salted with
	 * the same salt used to create the account and then hashed. If the hash
	 * of the client provided password does NOT match the hashed password
	 * contained in the database, then authentication has failed and an error
	 * is sent to the client containing a client input error status.
	 */
	if (!(await bcrypt.compare(req.body.password, account.password))) {
		console.info(
			`SIGNING-IN ERROR: Incorrect password entered for \"${account.usertag}\"! =(`
		)
		res.status(422).json({ error: { msg: 'incorrect-password' } })
		return
	}

	/**
	 * Once authentication is verified, the contents of the account record's
	 * usertag, username, and email are all bundled into a object that will
	 * be converted into a JSON Web Token (JWT). This format will ensure the
	 * integrety of the session token against any 3rd-party tinkering and/or
	 * malformation. This token will be used for authorization in later routes.
	 */
	const session = AuthToken.sign({
		usertag: account.usertag,
		username: account.username,
		email: account.email,
		dateCreated: Date.now(),
	})

	/**
	 * To run various tests, these cookies will need to be set. This is handled
	 * manually by the browser in production since httpOnly tokens cannot be set
	 * within the javascript. These will only do what they appear to do when the
	 * HTTP request is sent by the browser directly or by a 3rd-party REST testing
	 * tool. Any fetch commands ran by the browser's javascript engine will NOT
	 * be able to properly set the browser's cookies.
	 */
	//if (process.env.NODE_ENV != 'production') {
	// Only for testing, will not work in production.
	res.cookie('session', session, { httpOnly: true })
	res.cookie('session-cert', '1')
	//}

	/**
	 * Account authentication was a success. To finish signing-in, the response
	 * sent to the client will give an OK status (200) and several fields needed
	 * to complete the signing-in process on the clients side. The JWT session
	 * token is sent as just token. The client will need to add this session to
	 * the their browser's cookies with the key being 'session'. This session will
	 * however NOT be secure. To ensure security, it is recommended that the client
	 * gets redirected to the homepage (i.e. http://*the-url*.com/). The other two
	 * fields returned are the signed-in users usertag and username. The client
	 * can use these in what ever way they desire.
	 */
	res.status(200).json({
		error: 0,
		session: session,
		session_usertag: account.usertag,
		session_username: account.username,
	})

	/**
	 * The success is traced to the console.
	 */
	console.info(`SIGNING-IN: Successfully logged in \"${account.usertag}\"! =)`)
}

module.exports.signout = (req, res) => {
	/**
	 * Since the authorization method used in this project is essentially
	 * state-less, the need to delete some record of a session utilized by
	 * the browser is non-existant. To sign out a client, all that is needed
	 * is to delete the HTTPOnly 'session' cookie. When signing out, these
	 * cookies will be cleared. In production, the two non-HTTPOnly cookies
	 * 'session-usertag' and 'session-username' may possibly NOT exist on the
	 * browser. If this is true, then no harm is done by trying to delete them
	 * anyways.
	 */
	res.clearCookie('session')
	res.clearCookie('session-cert')

	/**
	 * To verify that the client being signed-out is infact signed-in to an account
	 * the requests session field produced by the AuthToken process middleware is
	 * checked. If this field does NOT exist, then the client is NOT signed-in to
	 * an account. If this is the case, then a unauthorized message is sent to the
	 * client. If, however, the 'session' field does exists, then the signing out
	 * process continues.
	 */
	if (!req.session) {
		res.status(401).json({ error: { msg: 'unauthorized' } })
		console.info(
			'SIGNING-OUT ERROR: user tried of logging out without being logged-in! =('
		)
		return
	}

	/**
	 * Once the user has been functionally signed-out of their account, the server
	 * will send a HTTP OK response. No functionality available solely to a signed-in
	 * user should be available to the client any longer.
	 */
	res.status(200).json({ error: 0 })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`SIGNING-OUT: successfully logged out user \"${req.session.usertag}\"! =)`
	)
}
