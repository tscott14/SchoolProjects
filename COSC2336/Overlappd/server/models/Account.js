const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * This schema represents a single account.
 * @var tag -- A unique character sequence used in other schemas to
 *                reference this specific user.
 * @var username -- This is the name of the user. Can be whatever.
 * @var email -- A unique email meant for signining in.
 * @var password -- A hashed password used during authentication.
 * @var groups -- A list of groups the account is subscribed to.
 * @var paid -- A field to track if the account has paid.
 * @var options -- Field to hold secondary data.
 *
 * @extra timestamps -- timestamps are automatically generated.
 */
const userSchema = new Schema(
	{
		usertag: {
			type: String,
			required: true,
			lowercase: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		groups: {
			type: [String],
			default: [],
			required: true,
		},
		schedule: {
			type: [[Number]],
			default: [
				[1,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0],
			],
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Account', userSchema)
