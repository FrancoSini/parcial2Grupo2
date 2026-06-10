const pool = require('../config/conexion.js') // conexión a Postgres
const bcrypt = require('bcrypt') 

const getUsuarioAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios')
    return res.status(200).json(result.rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'No se pudieron obtener los usuarios' })
  }
}

const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: `No existe el usuario con id ${id}` })
    }
    return res.status(200).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: `No se pudo obtener el usuario con id ${id}` })
  }
}

const postNewUsuario = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, hashedPassword]
    )
    return res.status(201).json({
      msg: 'Usuario creado correctamente',
      usuario: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'No se pudo crear el usuario' })
  }
}

const putUsuarioById = async (req, res) => {
  const { id } = req.params
  const { nombre, email, password } = req.body
  try {
    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, password = COALESCE($3, password), creado = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [nombre, email, hashedPassword, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: `No se encontró el usuario con id ${id}` })
    }
    return res.status(200).json({
      msg: 'Usuario modificado correctamente',
      usuario: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: `No se pudo modificar el usuario con id ${id}` })
  }
}

const deleteUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: `No se encontró el usuario con id ${id}` })
    }
    return res.status(200).json({
      msg: 'Usuario eliminado correctamente',
      usuario: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'No se pudo eliminar el usuario' })
  }
}

module.exports = {
  getUsuarioAll,
  getUsuarioById,
  postNewUsuario,
  putUsuarioById,
  deleteUsuarioById
}
