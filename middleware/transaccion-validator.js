const middlewareTransaccion = (req, res, next) => {
  const { monto, tipo, usuario_id, categoria_id } = req.body
  const error = []

  if (!monto || isNaN(monto) || monto <= 0) {
    error.push(
      'El campo "monto" es obligatorio y debe ser un número mayor a 0.'
    )
  }
  if (!tipo || !['ingreso', 'gasto'].includes(tipo)) {
    error.push('El campo "tipo" es obligatorio y debe ser "ingreso" o "gasto".')
  }
  if (!usuario_id || isNaN(usuario_id)) {
    error.push('El campo "usuario_id" es obligatorio y debe ser un número.')
  }
  if (!categoria_id || isNaN(categoria_id)) {
    error.push('El campo "categoria_id" es obligatorio y debe ser un número.')
  }

  if (error.length > 0) {
    return res.status(400).json({ error: error.join(' ') })
  }
  next()
}

module.exports = { middlewareTransaccion }
