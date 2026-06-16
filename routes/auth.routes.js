const express = require('express')
const router = express.Router()

const { register, login, getPerfil } = require('../controllers/auth.controller')
const { validateInputUsuario } = require('../middleware/usuario-validator')
const { verificarToken } = require('../middleware/auth.middleware')

// Rutas públicas
router.post('/register', validateInputUsuario, register)
router.post('/login', login)

// Ruta protegida
router.get('/perfil', verificarToken, getPerfil)

module.exports = router