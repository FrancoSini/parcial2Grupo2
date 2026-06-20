const { Router } = require('express')
const router = Router()
const { middlewareTransaccion } = require('../middleware/transaccion-validator')
const { verificarToken } = require('../middleware/auth.middleware')
const {
  getAllTransacciones,
  getTransaccionById,
  getBalance,
  postTransaccion,
  putTransaccion,
  deleteTransaccion
} = require('../controllers/transaccion.controller')

router.get('/', verificarToken, getAllTransacciones)
router.get('/balance', verificarToken, getBalance)
router.get('/:id', verificarToken, getTransaccionById)
router.post('/', verificarToken, middlewareTransaccion, postTransaccion)
router.put('/:id', verificarToken, middlewareTransaccion, putTransaccion)
router.delete('/:id', verificarToken, deleteTransaccion)

module.exports = router
