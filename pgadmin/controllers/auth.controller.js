const bcrypt = require('bcrypt')
const { UsuarioModel } = require('../dist/models/usuario.model')
const { generarToken } = require('../middleware/auth.middleware')

// Registrar un nuevo usuario
const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body

    // Verificar si el email ya existe
    const usuarioExistente = await UsuarioModel.findOne({ where: { email } })
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ error: 'El email ya se encuentra registrado.' })
    }

    const nuevoUsuario = await UsuarioModel.create({
      nombre,
      apellido,
      email,
      password
    })

    const token = generarToken(nuevoUsuario)

    return res.status(201).json({
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

// Iniciar sesión
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const usuario = await UsuarioModel.findOne({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    // Comparar password con bcrypt
    const passwordValida = await bcrypt.compare(password, usuario.password)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const token = generarToken(usuario)

    return res.status(200).json({
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

// Obtener perfil del usuario autenticado
const getPerfil = async (req, res, next) => {
  try {
    const usuario = await UsuarioModel.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    return res.status(200).json(usuario)
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getPerfil }
