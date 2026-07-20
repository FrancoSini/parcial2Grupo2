const { CategoriaModel } = require('../dist/models/categoria.model')

const getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaModel.findAll()
    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron categorías' })
    }
    return res.status(200).json(categorias)
  } catch (error) {
    next(error)
  }
}

const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoriaEncontrada = await CategoriaModel.findByPk(id)
    if (!categoriaEncontrada) {
      return res.status(404).json({ msg: `Categoría ${id} no encontrada` })
    }
    return res.status(200).json(categoriaEncontrada)
  } catch (error) {
    next(error)
  }
}

const postCategoria = async (req, res, next) => {
  try {
    const { nombre } = req.body
    const categoriaCreada = await CategoriaModel.create({ nombre })
    return res.status(201).json(categoriaCreada)
  } catch (error) {
    next(error)
  }
}

const putCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre } = req.body
    const categoria = await CategoriaModel.findByPk(id)
    if (!categoria) {
      return res.status(404).json({ msg: `Categoría ${id} no encontrada` })
    }
    await categoria.update({ nombre })
    return res.status(200).json(categoria)
  } catch (error) {
    next(error)
  }
}

const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoria = await CategoriaModel.findByPk(id)
    if (!categoria) {
      return res.status(404).json({ msg: `Categoría ${id} no encontrada` })
    }
    await categoria.destroy()
    return res
      .status(200)
      .json({ msg: `Categoría ${id} eliminada correctamente` })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCategorias,
  getCategoriaById,
  postCategoria,
  putCategoria,
  deleteCategoria
}
