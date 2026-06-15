const express = require('express')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('../middleware/error-handler')
const { sequelize } = require('../models/n-index.models')


class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  rutas() {

    this.app.use('/usuarios', require('../routes/usuario.routes'))
    
    
  }
  errorHandlerGlobal() {
    //manejo de errores 
    errorHandler
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`La API está escuchando en el puerto: ${this.port}`)
    })
  }
}

module.exports = Server
