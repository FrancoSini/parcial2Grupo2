const middlewareCategoria = (req, res, next) => {
  const { nombre } = req.body
  const error = []

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    error.push(
      'El campo "nombre" es obligatorio y debe ser una cadena de texto no vacía.'
    )
  }

  if (error.length > 0) {
    return res.status(400).json({ error: error.join(' ') })
  }
  next()
}

module.exports = { middlewareCategoria }
