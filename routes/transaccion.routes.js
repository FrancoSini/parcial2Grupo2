const { Router } = require('express')
const router = Router()
const { middlewareTransaccion } = require('../middleware/transaccion-validator')
const {
  getAllTransacciones,
  getTransaccionById,
  postTransaccion,
  putTransaccion,
  deleteTransaccion
} = require('../controllers/transaccion.controller')

router.get('/', getAllTransacciones)
router.get('/:id', getTransaccionById)
router.post('/', middlewareTransaccion, postTransaccion)
router.put('/:id', middlewareTransaccion, putTransaccion)
router.delete('/:id', deleteTransaccion)

module.exports = router
