const Account = require('../models/Account')
const Group = require('../models/Group')

module.exports.createGroup = async (req, res) => {
	/**
	 * In-order to create a schedule group, the client must be signed-in
	 * to an account. Otherwise, the groups created would be unusable. No
	 * changes could occur. For this reason, if the session token produced
	 * by the AuthToken 'process' middleware does NOT exist as part of the
	 * request, the client is considered NOT signed-in, thus being refused
	 * the authority to create a group. Groups can't be created anonymously.
	 */
	if (!req.session) {
		res.status(401).json({ error: { msg: 'unauthorized' } })
		console.info(
			'GROUP CREATION ERROR: must be signed into an account to create a group! =('
		)
		return
	}

	/**
	 * Since group creation is important, the 'session' provided by the request is checked
	 * to possess a 'usertag' (i.e. a unique handle to an existing user). If no usertag is
	 * provided, then there has been a critical server failure and the process of creating
	 * a group is terminated. A serious internal server error is sent to the client.
	 */
	if (!req.session.usertag) {
		res.status(500).json({ error: { msg: 'known-internal-server-error' } })
		console.error(
			'GROUP CREATION ERROR: the field "req.session.usertag" should have existed! =('
		)
		return
	}

	/**
	 * After a request is shown to originate from a signed-in client. Several
	 * points of input verification must take place. The 'gtag' (group tag) is
	 * a universally unique character sequence that uniquely identifies a group
	 * as diffrent from all other groups. If, in the request body, no 'gtag' is
	 * provided, a client input error is sent back to the client.
	 */
	if (!req.body.gtag) {
		res.status(422).json({ error: { msg: 'gtag-NOT-provided' } })
		console.info(
			'GROUP CREATION ERROR: no group id provided! major internal error! =('
		)
		return
	}

	/**
	 * Additionally, to create a group, the create HTTP POST request must also
	 * provide a 'title' for the group. No default will be automatically created.
	 * If a 'title' is NOT provided, then a client input error is returned to the
	 * client.
	 */
	if (!req.body.title) {
		res.status(422).json({ error: { msg: 'group-title-NOT-provided' } })
		console.info('GROUP CREATION ERROR: no title provided! =(')
		return
	}

	/**
	 * Provided that the 'gtag' does exist, it must also be unique. To check this, the
	 * 'gtag' is searched for within the database. If there exists an entry already with
	 * this entry, then the 'gtag' provided is already in use and cannot be used again.
	 * The client will need to provide an alternative 'gtag' for this HTTP POST request
	 * to pass this check. If the creation fails at this check, then a client input error
	 * is sent back to the client.
	 */
	if (await Group.exists({ gtag: req.body.gtag })) {
		res.status(422).json({ error: { msg: 'gtag-taken' } })
		console.info(
			`GROUP CREATION ERROR: gtag \"${req.body.gtag}\" already taken! =(`
		)
		return
	}

	/**
	 * Once all requirements for the addition of this group to the database are met, the
	 * Group model is used to add the schema define in models/Group.js. This adds all
	 * data required. For the users, the only user available by default is the one who
	 * created the group. This GroupUser will be made the defacto owner of the group.
	 * This attempt at adding the new group could fail.
	 */
	process.stdout.write(`Creating group \"${req.body.gtag}\"...\t`)
	const group = await Group.create({
		gtag: req.body.gtag,
		title: req.body.title,
		pfp: req.body.pfp,
		users: [{ usertag: req.session.usertag, role: 'owner', permissions: {} }],
	})

	/**
	 * To handle the possibility that the group may fail when being added to the database,
	 * the response is checked to exist. If it does NOT exist, then there has been an
	 * internal server error. As a result of this, the response sent to the client declares
	 * that there was a major server side error. No change is made to the database. The
	 * operation is cancelled.
	 */
	if (!group) {
		res.status(500).json({ error: { msg: 'unknown-internal-server-error' } })
		console.error(
			`GROUP CREATION ERROR: internal server error creating group \"${req.body.gtag}\" =(`
		)
		return
	}

	/**
	 * If the 'create' method returns a successful result, then the group has been created
	 * and added to the database. Further actions can now be taken by the owner/client. In
	 * response to the success, a HTTP OK (200) response is sent to the client. Any further
	 * HTTP request send that involves mutating/viewing the group will require authorization
	 * as granted through a JWT 'session' cookie.
	 */
	res.status(201).json({ error: 0 })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`GROUP CREATION: Successfully created group \"${req.body.gtag}\"! =)`
	)
}

module.exports.modifyGroup = async (req, res) => {
	/**
	 * To modify a group requires authorization. If the request sent by the client does NOT
	 * contain a session field, then the client is considered defacto unauthorized. They must
	 * be signed into an account inorder to successfully send envoke this routine.
	 */
	if (!req.session) {
		res.status(401).json({ error: { msg: 'unauthorized' } })
		console.info(
			'GROUP MODIFICATION ERROR: must be signed into an account to mutate a group! =('
		)
		return
	}

	/**
	 * To save a database lookup later in the modifyGroup routine, the contents of the request
	 * body are check to verify that some change is sought to be made. If no modification is
	 * stated, then this routine terminates. The client is sent a client input error.
	 */
	if (!req.body.new_users && !req.body.new_title && !req.body.new_pfp) {
		res.status(422).json({ error: { msg: 'no-change-requested' } })
		console.info(
			`GROUP MODIFICATION WARNING: request possessed no fields to change! =(`
		)
		return
	}

	/**
	 * Once the request has been verified to seek modification of the group, the database can
	 * be queried for a group possessing the name provided by the request's body gtag property.
	 * This group will be modified and later saved, internally updating the database.
	 */
	const group = await Group.findOne({ gtag: req.body.gtag })

	/**
	 * The group recieved by the database query may or may NOT exist. If there wasn't an entry in
	 * the database who's 'gtag' matched the 'gtag' value provided by the requests body gtag
	 * field, then there exists no group with the 'gtag' value provided by the client. In this
	 * case, with the 'group' object not existing, the server will send a response to the client
	 * with a client input error. This routine will be terminated.
	 */
	if (!group) {
		res.status(422).json({ error: { msg: 'unknown-group' } })
		console.info(
			`GROUP MODIFICATION ERROR: group \"${req.body.gtag}\" not found! =(`
		)
		return
	}

	/**
	 * Once the gtag has been verified to be associated with a group, the mutating of the group
	 * entry begins. For the option to add users, the format used by the database differs to the
	 * format expected by the calling of this routine. First the already enlisted users in the
	 * group are mapped into a basic array of strings. Later for each prompted new user, they are
	 * checked to see if they already exist in the group, if NOT, they're added. This subroutine
	 * is optional and only run if the request contains a 'new_users' field in the request's body.
	 */
	if (req.body.new_users.length > 0) {
		// Map complex objects into a simple 1D array of 'gtag's.
		const existing_users = group.users.map((user) => {
			return user.usertag
		})

		// For each newly prompted user, add them to the group if they are NOT already apart of it.
		req.body.new_users.forEach((user) => {
			if (existing_users.includes(user)) return
			group.users.push({
				usertag: user,
				permissions: {},
			})
		})
	}

	/**
	 * The 'title' can also be changed. This is a non-unique character sequence (i.e. two or more groups
	 * can have identical group 'title's but not identical 'gtag's). If the new_title property does NOT
	 * exist, then the groups title remains what it was previously. No change is made in that case. This
	 * option is optional.
	 */
	group.title = req.body.new_title || group.title

	/**
	 * The 'pfp', or ProFile Picture, is a url pointing to the image used to display the group's profile
	 * picture. This option is mainly un-implemented for now. If no new 'pfp' is offered within the request
	 * body, then it remains as it was previously. This option is optional.
	 */
	group.pfp = req.body.new_pfp || group.pfp

	/**
	 * Once all the mutations are made, the group is saved and the database is updated. This is where the
	 * actual change of the database's records occurs; before this, all changes made to the 'group' object
	 * were tempory and solely in the scope of this routine. The process of saving the document, however,
	 * is uncertain.
	 */
	const status = await group.save()

	/**
	 * The status of the Group's model call of the save method presents the success of the update. If there
	 * was an error and the Group model was unable to update the database then the subroutine is terminated.
	 * No changes were made to the database if the call to save() failed.
	 */
	if (!status) {
		res.status(500).json({ error: { msg: 'unknown-internal-server-error' } })
		console.error(
			'GROUP MODIFICATION ERROR: failed to apply changes to database! =('
		)
		return
	}

	/**
	 * The group has been successfully modified. All fields present in the request's body have been processed
	 * and been applied accordingly. If no errors were encountered by the modyifyGroup routine, then the
	 * client is sent a HTTP OK (200) response. Any further operations with the group will reflect the changes
	 * made by the request.
	 */
	res.status(201).json({ error: 0 })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`GROUP MODIFICATION: Successfully modified group \"${req.body.gtag}\"! =)`
	)
}

module.exports.deleteGroup = async (req, res) => {
	/**
	 * Authorization is required. The existence of a session is checked here. If there is no session
	 * contained within the request object, then the client is defacto unauthorized to make this HTTP
	 * request. Without the session token, the authorization of the client cannot be guaranteed.
	 */
	if (!req.session) {
		res.status(401).json({ error: { msg: 'unauthorized' } })
		console.info(
			'GROUP DELETION ERROR: must be signed-in as owner to delete a group! =('
		)
		return
	}

	/**
	 * The validity of the 'gtag' option present in the request's body is needed to verify that the input
	 * supplied by the client matches what is expected by the deleteGroup routine. If no 'gtag' field
	 * is specified, then the deleteGroup routine will return to the client a client input error. No
	 * changes will be made to the database and the routine will be terminated.
	 */
	if (!req.body.gtag) {
		res.status(422).json({ error: { msg: 'gtag-NOT-specified' } })
		console.info(
			'GROUP DELETION ERROR: gtag field NOT specified in deleteGroup request! =('
		)
		return
	}

	/**
	 * Search the database for a group with a 'gtag' matching the one provided in the body. If there is a
	 * match, then it is returned as the variable 'group'. Otherwise, the variable will not exist and be
	 * undefined/null.
	 */
	const group = await Group.findOne({ gtag: req.body.gtag })

	/**
	 * Validating the existence of the group returned from the Group model is crucial. If the 'group' object
	 * is infact undefined/null, then the client will be sent a client input error and the routine will
	 * be immediately terminated.
	 */
	if (!group) {
		res.status(422).json({ error: { msg: 'gtag-NOT-found' } })
		console.info(
			`GROUP DELETION ERROR: could not find gtag \"${req.body.gtag}\"! =(`
		)
		return
	}

	/**
	 * Validate that it is the owner calling this function. Some functional trickery is done to pull out only
	 * the owners of the group. This result should always possess atleast one entry.
	 * TODO: Add error handling for case when 'owners' is empty.
	 */
	const owners = group.users
		.map((user) => {
			if (user.role === 'owner') return user.usertag
		})
		.filter((elem) => elem != null)

	/**
	 * If the 'owners' array is not null/undefined nor empty, then it is checked to contain the usertag provided
	 * in the request's session object. If these two fields match, then the client has been confirmed to be the
	 * user and the deletion of the group can continue. If, however, they do NOT match, the routine is immediately
	 * terminated and the client is sent a HTTP forbidden response. No change is made to the database.
	 */
	if (owners && owners.length > 0 && !owners.includes(req.session.usertag)) {
		res.status(403).json({ error: { msg: 'forbidden' } })
		console.info(
			"GROUP DELETION ERROR: user tried deleting group that doesn't belong to them! =("
		)
		return
	}

	/**
	 * The Group model is tasked with deleting the group record instance. This could fail, so further error handling
	 * will be required.
	 */
	process.stdout.write(`Deleting group \"${req.body.gtag}\"...\t`)
	const record = await group.delete()

	/**
	 * To verify that the record has been successfully deleted from the database, the status of the result
	 * from the previous line must be true. If it is NOT true, then the database failed at deleting the entry,
	 * thus no change had been made to the database. In this case, the routine terminates and the client is
	 * sent an internal server side error message.
	 */
	if (!record) {
		res.status(500).json({ error: { msg: 'gtag-NOT-found' } })
		console.error(
			`GROUP DELETION ERROR: group \"${req.body.gtag}\" could NOT be deleted! =(`
		)
		return
	}

	/**
	 * The routine was a success and the group with the 'gtag' specified in the requests body has been removed
	 * successfully. The group no longer exists. The client is sent a HTTP OK (200) response. Any actions ahead
	 * will reflect the deletion of the group.
	 */
	res.status(201).json({ error: 0 })

	/**
	 * The success is traced to the console.
	 */
	console.info(
		`GROUP DELETION: Successfully deleted group \"${req.body.gtag}\"! =)`
	)
}

module.exports.getPreview = async (req, res) => {
	// TODO: Send JSON for pfp, title, limited user count.
	const gtag = req.params.gtag

	// make sure a gtag is provided
	if (!gtag) {
		res.status(500).json({ error: { msg: 'gtag-param-NOT-supplied' } })
		console.error(`GROUP USERS ERROR: no group supplied! =(`)
		return
	}

	// get the group from the database
	const group = await Group.findOne({ gtag: gtag })

	// make sure a group exists
	if (!group) {
		res.status(422).json({ error: { msg: 'gtag-NOT-known' } })
		console.error(`GROUP USERS ERROR: no group supplied! =(`)
		return
	}

	const title = group.title || 'unknown'
	const pfp = group.pfp || 'url'

	const count = Math.min(3, group.users.length)
	const users = group.users.slice(0, count).map((user) => user.usertag) || []

	res
		.status(200)
		.json({ error: 0, gtag: gtag, title: title, pfp: pfp, users: users })
}

module.exports.getGroupUsers = async (req, res) => {
	const gtag = req.params.gtag

	// make sure a gtag is provided
	if (!gtag) {
		res.status(500).json({ error: { msg: 'gtag-param-NOT-supplied' } })
		console.error(`GROUP USERS ERROR: no group supplied! =(`)
		return
	}

	// get the group from the database
	const group = await Group.findOne({ gtag: gtag })

	// make sure a group exists
	if (!group) {
		res.status(422).json({ error: { msg: 'gtag-NOT-known' } })
		console.error(`GROUP USERS ERROR: no group supplied! =(`)
		return
	}

	const users = group.users.map((user) => {
		return {
			usertag: user.usertag,
			role: user.role,
		}
	})

	res.status(200).json({ error: 0, users: users })
}

module.exports.getSpecificGroupUser = async (req, res) => {
	const gtag = req.params.gtag
	const usertag = req.params.usertag

	// make sure the group tag (gtag) is supplied.
	if (!gtag) {
		res.status(500).json({ error: { msg: 'gtag-param-NOT-supplied' } })
		console.error(`GROUP USER VIEW ERROR: no group supplied! =(`)
		return
	}

	// make sure the group tag (gtag) is supplied.
	if (!usertag) {
		res.status(500).json({ error: { msg: 'user-param-NOT-supplied' } })
		console.error(`GROUP USER VIEW ERROR: no user supplied for group! =(`)
		return
	}

	// Get the group from the database
	const group = await Group.findOne({ gtag: gtag })

	// Validating the gtag is associated with a group.
	if (!group) {
		res.status(422).json({ error: { msg: 'unknown-gtag' } })
		console.error(
			`GROUP USER VIEW ERROR: gtag supplied not associated with existing group! =(`
		)
		return
	}

	// Get all users with the unique usertag of usertag
	const filtered_users = group.users.filter((user) => user.usertag === usertag)

	// check to see if any user was found.
	if (filtered_users.length > 0) {
		res.status(422).json({ error: { msg: 'usertag-NOT-found-in-group' } })
		console.error(`GROUP USER VIEW ERROR: no user with usertag in group! =(`)
		return
	}

	// Check for multiple users, if there is more than 1 entry
	// in the array, a critical database or server error has
	// occured. Hopefully this will never happen.

	// Get the one and only entry
	const user = filtered_users[0]

	// return data
	res.status(200).json({ error: 0, usertag: user.usertag, role: user.role })
}

module.exports.getSchedule = async (req, res) => {
	// TODO: Send JSON in the format specified in /models/schedule.json

	const gtag = req.params.gtag

	// make sure the group tag (gtag) is supplied.
	if (!gtag) {
		res.status(500).json({ error: { msg: 'gtag-param-NOT-supplied' } })
		console.error(`SCHEDULAR ERROR: no group supplied! =(`)
		return
	}

	// Find the gtag in the database
	const group = await Group.findOne({ gtag: gtag })

	// Validating the gtag is associated with a group.
	if (!group) {
		res.status(422).json({ error: { msg: 'unknown-gtag' } })
		console.error(
			`SCHEDULAR ERROR: gtag supplied not associated with existing group! =(`
		)
		return
	}

	// Get title and length of users count.
	const group_name = group.title
	const user_count = group.users.length

	// Get a list of all users including their usertag, username, role, and schedule.
	const users = await Promise.all(
		group.users.map(async (user) => {
			const usertag = user.usertag
			const username = user.username
			const role = user.role
			const schedule = user.schedule

			// got to make an algorythm :sad_face:
			const account = await Account.findOne({ usertag: usertag })
			//TODO: check account existence

			return {
				usertag: usertag,
				username: account.username,
				role: role,
				schedule: account.schedule,
			}
		})
	)

	// From the users generated previously, all their
	// associated schedules are summated into a final
	// schedule containing the values specified.
	const group_schedule = users
		.map((user) => user.schedule)
		.reduce((sum, curr) => {
			let result = [
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
			]
			for (let i = 0; i < result.length; i++) {
				const timeslots = result[i]
				for (let j = 0; j < timeslots.length; j++) {
					timeslots[j] = sum[i][j] + curr[i][j]
				}
			}
			return result
		})

	const result = {
		gtag: gtag,
		title: group_name,
		user_count: user_count,
		schedule: group_schedule,
		users: users,
	}

	res.status(200).json({ error: 0, ...result })
}
