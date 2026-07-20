const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_para_desarrollo'

const generarToken = (usuario) => {
  return jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
    expiresIn: '24h'
  })
}

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'No autorizado, token no provisto.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}

module.exports = { generarToken, verificarToken }
