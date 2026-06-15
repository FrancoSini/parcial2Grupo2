const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME || 'miapp',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'db', // "db" es el nombre del servicio en docker-compose
    port: 5432,
    dialect: 'postgres',

    define: {
      timestamps: true, // maneja createdAt y updatedAt automáticamente
      underscored: false, // usa camelCase (createdAt / updatedAt), coincide con el SQL
      freezeTableName: true // no pluraliza ni modifica el nombre de la tabla
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

// Probar la conexión — llamar desde app.js al arrancar
const conectarDB = async () => {
  try {
    await sequelize.authenticate()
    console.log(' Conexión a PostgreSQL establecida correctamente.')
  } catch (error) {
    console.error(' No se pudo conectar a la base de datos:', error)
    process.exit(1)
  }
}

module.exports = { sequelize, conectarDB }
