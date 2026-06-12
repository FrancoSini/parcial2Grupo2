const fs = require('fs').promises
const { UsuarioModels } = require('../models/usuario.models')


const getAllUsuarios = async (req, res, next) => {
  try{  
    const usuarios = await UsuarioModels.findAll()
    return res.status(200).json(usuarios)
    
    if (!usuarios || usuarios===undefined) {
      return res.status(400).json({ msg: 'no se encontraron usuarios' })
    }

  }catch(error){
    next(error)
  }
}
const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuarioEncontrado = await UsuarioModels.findById()

    if (!usuarioEncontrado || id === undefined) {
      return res.status(400).json({ msg: 'no se pudo encontrar el usuario ${id}' })
    }
    return res.status(200).json(usuarioEncontrado)
  }catch(error){
    next(error)
  }
}
const postUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body

    UsuarioModels.create({ nombre, apellido, email, password })
    const usuarioCreado = await UsuarioModels.FindLastOne()
    return res.status(201).json(usuarioCreado)

  }catch(error){
    next(error)
  }
}
