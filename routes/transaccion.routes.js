const { Router } = require('express')
const router = Router()
const { middlewareTransaccion } = require('../middleware/transaccion-validator')
const {
  getAllTransacciones,
  getTransaccionById,
  postTransaccion,
  deleteTransaccion
} = require('../controllers/transaccion.controller')

router.get('/', getAllTransacciones)
router.get('/:id', getTransaccionById)
router.post('/', middlewareTransaccion, postTransaccion)
router.delete('/:id', deleteTransaccion)

module.exports = router
