const { Router } = require('express')
const router = Router()
const { middlewareCategoria } = require('../middleware/categoria-validator')
const {
  getAllCategorias,
  getCategoriaById,
  postCategoria,
  putCategoria,
  deleteCategoria
} = require('../controllers/categoria.controller')

router.get('/', getAllCategorias)
router.get('/:id', getCategoriaById)
router.post('/', middlewareCategoria, postCategoria)
router.put('/:id', middlewareCategoria, putCategoria)
router.delete('/:id', deleteCategoria)

module.exports = router
