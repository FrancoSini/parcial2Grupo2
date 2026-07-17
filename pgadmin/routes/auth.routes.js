const express = require('express')
const router = express.Router()

const { register, login, getPerfil } = require('../controllers/auth.controller')
const { middlewareUsuarios } = require('../middleware/usuario-validator')
const { verificarToken } = require('../middleware/auth.middleware')

// Rutas públicas
router.post('/register', middlewareUsuarios, register)
router.post('/login', login)

// Ruta protegida
router.get('/perfil', verificarToken, getPerfil)

module.exports = router
