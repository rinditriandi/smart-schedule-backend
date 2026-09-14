const router = require('express').Router()
const { readPlots, readPlotById, createPlot, cancelPlot, refreshPlot, updatePlot, sendProgramChater } = require('../../controller/plotController')
const { authentication } = require('../../middlewares')

router.get('/:id', authentication, readPlotById)
router.get('/', authentication, readPlots)
router.post('/cancel/:id', authentication, cancelPlot)
router.post('/refresh/:id', authentication, refreshPlot)
router.post('/sendProgramCharter/:id', authentication, sendProgramChater)
router.post('/', authentication, createPlot)
router.put('/:id', authentication, updatePlot)

module.exports = router