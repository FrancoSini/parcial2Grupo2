const Categoria = require('../models/categoria')

exports.crearCategoria = async (req, res) => {
  try {
    const nueva = await Categoria.create(req.body)
    res.status(201).json(nueva)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' })
  }
}

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll()
    res.json(categorias)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar categorías' })
  }
}
