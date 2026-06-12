const { Router } = require('express')
const router = Router()
const  { middlewareUsuarios } = require('../middleware/usuario-validator')

const { getAllUsuarios } = require('../controllers/usuario.controller')


router.get('/',  getAllUsuarios)
router.get('/:id', getUsuarioById)
router.post('/', middlewareUsuarios, postUsuario)
// router.put('/:id', middlewareUsuarios, putUsuario)
// router.delete('/:id', deleteUsuario)


module.exports = router



