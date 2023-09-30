const express = require('express')
const router = express.Router()

const controller = require('../controllers/Group')

router.post('/create', controller.createGroup)
router.post('/modify', controller.modifyGroup)
router.post('/delete', controller.deleteGroup)

router.get('/:gtag/view', controller.getPreview)

router.get('/:gtag/users', controller.getGroupUsers)
router.get('/:gtag/users/:usertag', controller.getSpecificGroupUser)

router.get('/:gtag/schedule', controller.getSchedule)

module.exports = router
