const { Router } = require('express')

const {
  getUsuarioAll,
  getUsuarioById,
  postNewUsuario,
  putUsuarioById,
  deleteUsuarioById
} = require('../controllers/usuario.controller')

const rutas = Router()

rutas.get('/', getUsuarioAll)
rutas.get('/:id', getUsuarioById)
rutas.post('/', postNewUsuario)
rutas.put('/:id', putUsuarioById)
rutas.delete('/:id', deleteUsuarioById)

module.exports = rutas
