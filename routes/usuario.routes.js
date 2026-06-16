const { Router } = require('express')
const router = Router()
const { middlewareUsuarios } = require('../middleware/usuario-validator')
const {
  getAllUsuarios,
  getUsuarioById,
  postUsuario
} = require('../controllers/usuario.controller')

router.get('/', getAllUsuarios)
router.get('/:id', getUsuarioById)
router.post('/', middlewareUsuarios, postUsuario)

module.exports = router
