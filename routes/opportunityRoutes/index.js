const router = require('express').Router()
const { readOpportunities, readOpportunityById, readOpportunityContactRoles } = require('../../controller/opportunityController')
const { authentication } = require('../../middlewares')

router.get('/contactRoles/:opportunityId', authentication, readOpportunityContactRoles)
router.get('/:id', authentication, readOpportunityById)
router.get('/', authentication, readOpportunities)

module.exports = router