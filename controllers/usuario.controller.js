const { UsuarioModel } = require('../dist/models/usuario.model')

const getAllUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuarioModel.findAll()
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron usuarios' })
    }
    return res.status(200).json(usuarios)
  } catch (error) {
    next(error)
  }
}

const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params
    const usuarioEncontrado = await UsuarioModel.findByPk(id)
    if (!usuarioEncontrado) {
      return res
        .status(404)
        .json({ msg: `No se pudo encontrar el usuario ${id}` })
    }
    return res.status(200).json(usuarioEncontrado)
  } catch (error) {
    next(error)
  }
}

const postUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body
    const usuarioCreado = await UsuarioModel.create({
      nombre,
      apellido,
      email,
      password
    })
    return res.status(201).json(usuarioCreado)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllUsuarios, getUsuarioById, postUsuario }
