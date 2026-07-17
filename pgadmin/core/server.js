const express = require('express')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('../middleware/error-handler')
const { sequelize } = require('../dist/models/n-index.models')
const morgan = require('../middleware/morgan')
const helmet = require('../middleware/helmet')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }

  middleware() {
    this.app.use(helmet)   
    this.app.use(morgan)  
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  rutas() {
    this.app.use('/api/auth', require('../routes/auth.routes'))
    this.app.use('/api/usuarios', require('../routes/usuario.routes'))
    this.app.use('/api/categorias', require('../routes/categoria.routes'))
    this.app.use('/api/transacciones', require('../routes/transaccion.routes'))
  }

  errorHandlerGlobal() {
    this.app.use(errorHandler)
  }
getApp() {
  return this.app
}
 listen() {
  sequelize.sync().then(() => {
    this.app.listen(this.port, () => {
      console.log(`La API está escuchando en el puerto: ${this.port}`)
    })
  }).catch(err => {
    console.error('Error al conectar con la base de datos:', err)
  })
  }
}

module.exports = Server
