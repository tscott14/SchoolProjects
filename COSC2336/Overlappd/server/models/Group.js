const mongoose = require('mongoose')
const Schema = mongoose.Schema

// A internal exclusively used to transmit more complex data in the groupSchema.
const groupUserSchema = new Schema({})

const groupSchema = new Schema(
	{
		/**
		 * The group_id is a unique sequence of characters that will
		 * uniquely identify this group. This serves as the key.
		 */
		gtag: {
			type: String,
			required: true,
		},

		/**
		 * The title is the name given to the group and is displayed
		 * anytime some views the group's page or previews it.
		 */
		title: {
			type: String,
			required: true,
		},

		/**
		 * The pfp, or Profile Picture, is a URL pointing to an image
		 * that the browser can display for the group upon preview.
		 */
		pfp: {
			type: String,
			required: true,
			default: '.',
		},

		/**
		 * The users are the members that apart of the group. This contains
		 * all indivisuals in the group, possessing their permissions as well.
		 */
		users: {
			type: [
				{
					/**
					 * The usertag is a link to the account that is being represented
					 * within the group. This is globally unique.
					 */
					usertag: {
						type: String,
						required: true,
					},

					/**
					 * The role is the position that the specific user within the group
					 * possesses. This could be, for example, a 'member', a 'moderator'
					 * or even a 'owner'. 'member' is the default rank unless otherwise
					 * specified.
					 */
					role: {
						type: String,
						default: 'member',
						required: true,
					},

					/**
					 * The permissions is a JSON object that will contain various keys
					 * defining roles, permissions, etc of a user. Used for authorization
					 * of various requests.
					 */
					permissions: {
						type: Object,
						default: {},
						required: true,
					},
				},
			],
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Group', groupSchema)
