const fs = require('fs').promises
const { CategoriaModels } = require('../models/categoria.model')

const getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaModels.findAll()
    return res.status(200).json(categorias)

    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorías' })
    }
  } catch (error) {
    next(error)
  }
}

const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoriaEncontrada = await CategoriaModels.findById()

    if (!categoriaEncontrada || categoriaEncontrada.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    return res.status(200).json(categoriaEncontrada)
  } catch (error) {
    next(error)
  }
}

const postCategoria = async (req, res, next) => {
  try {
    const { nombre, id } = req.body
    const categoriaCreada = await CategoriaModels.create({ nombre, id })
    return res.status(201).json(categoriaCreada)
  } catch (error) {
    next(error)
  }
}
