const router = require('express').Router()
const { addRequirement, updateRequirement, deleteRequirement } = require('../../controller/requirementController')
const { authentication } = require('../../middlewares')

router.post('/', authentication, addRequirement)
router.put('/', authentication, updateRequirement)
router.delete('/', authentication, deleteRequirement)

module.exports = router