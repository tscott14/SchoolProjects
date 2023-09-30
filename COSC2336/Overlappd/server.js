// Load the environment variable.
let dotenv = require('dotenv')
dotenv.config({ path: './server/config/config.env' })

// Load in the express API.
const express = require('express')
const app = express()

// Setting up cross-origin requests.
const cors = require('cors')
app.use(cors())

// Setting up cookie-parser middleware.
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Basic setup of the Express app.
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Disable caching by the browser.
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store')
	next()
})

// Setting up Authorization/Authentication middleware.
const CookieAuthParser = require('./server/auth/CookieAuthParser')
app.use(CookieAuthParser.process)

// Refresh the session httpOnly cookie per request.
// This could be used to refresh JWT, needs testing first though
// app.use((req, res, next) => {
// 	const session = req.cookies && req.cookies.session
// 	res.clearCookie('session')
// 	res.clearCookie('session-cert')
// 	if (session) {
// 		res.cookie('session', session, { httpOnly: true })
// 		res.cookie('session-cert', '1')
// 	}
// 	next()
// })

// Setup static page loading.
const Globals = require('./root')
app.use(express.static(Globals.getFromBuildDirectory()))

// Load in all the routers.
const accountRouter = require('./server/routes/AccountRouter')
const groupRouter = require('./server/routes/GroupRouter')

// Link all the routers.
app.use('/api/account', accountRouter)
app.use('/api/group', groupRouter)

// Allow for ReactJS to use their internal routing system.
// app.get(
// 	['/', '/edit/:id', '/create', '/scheduler', '/login', '/signup', '/homescreen'],
// (req, res) => {}
// 	)

// Allow for ReactJS to use their internal routing system.
app.get('*', (req, res) => {
	//res.status(301).redirect('/')
	res.sendFile(Globals.getFromBuildDirectory('index.html'))
})

// Start the express server.
process.stdout.write('Starting ExpressJS...\t')
app.listen(process.env.PORT, async () => {
	console.log('Started ExpressJS! =)')

	// Get the .env environment variables.
	const mongoose = require('mongoose')
	const DB_USERNAME = process.env.DATABASE_USERNAME
	const DB_PASSWORD = process.env.DATABASE_PASSWORD
	const DB_CLUSTER = process.env.DATABASE_CLUSTER
	const DB_NAME = process.env.DATABASE_NAME

	// Set a callback to announce errors and connections.
	const dbConnection = mongoose.connection
	dbConnection.on('error', (e) => console.error(e))
	dbConnection.once('open', () => console.log('Connected to Database! =)'))

	// Connect to the database.
	process.stdout.write('Connecting to Mongo Database...\t')
	await mongoose.connect(
		`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
	)
})
