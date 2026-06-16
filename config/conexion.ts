// config/conexion.ts
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'miapp',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'db',
    port: 5432,
    dialect: 'postgres',

    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 30000
    },

    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
)

export const conectarDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log(' Conexión a PostgreSQL establecida correctamente.')

    // Importar modelos después de autenticar
    require('../models/usuario.model')
    require('../models/categoria.model')
    require('../models/transaccion.model')

    await sequelize.sync({ alter: true })
    console.log(' Tablas sincronizadas correctamente.')
  } catch (error) {
    console.error(' No se pudo conectar a la base de datos:', error)
    process.exit(1)
  }
}
