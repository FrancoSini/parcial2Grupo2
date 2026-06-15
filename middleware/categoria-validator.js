const validateCategoria = (req, res, next) => {
  const { nombre } = req.body
  const error = []
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    error.push(
      'El campo "nombre" es obligatorio y debe ser una cadena de texto no vacía.'
    )
  }

  //el id lo pone automaticamente la base de datos, no es necesario validarlo

  if (error.length > 0) {
    return res.status(400).json({ errors })
  }
  next()
}

module.exports = validateCategoria
