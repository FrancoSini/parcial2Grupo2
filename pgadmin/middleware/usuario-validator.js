const middlewareUsuarios = (req, res, next) => {
  const { nombre, apellido, email, password } = req.body
  const error = []

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    error.push('El campo "nombre" es obligatorio.')
  }
  if (apellido && typeof apellido !== 'string') {
    error.push('El campo "apellido" debe ser una cadena de texto.')
  }
  if (!email || typeof email !== 'string' || email.trim() === '') {
    error.push('El campo "email" es obligatorio.')
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    error.push('El campo "password" es obligatorio.')
  }

  if (error.length > 0) {
    return res.status(400).json({ error: error.join(' ') })
  }
  next()
}

module.exports = { middlewareUsuarios }
