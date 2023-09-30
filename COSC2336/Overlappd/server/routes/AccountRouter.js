const express = require('express')
const router = express.Router()

const controller = require('../controllers/Account')
const AuthToken = require('../auth/AuthToken')

router.post('/create', controller.createAccount)
router.post('/modify', controller.modifyAccount)
router.post('/delete', controller.deleteAccount)
router.route('/tokenAuth').get(AuthToken.process, controller.tokenAuth)

router.post('/signin', controller.signin)
router.post('/signout', controller.signout)

module.exports = router