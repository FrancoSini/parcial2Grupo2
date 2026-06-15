const fs = require('fs').promises
const { TransaccionModel } = require('../models/transaccion.model')

const getAllTransacciones = async (req, res, next) => {
  try {
    const transacciones = await TransaccionModel.findAll()
    return res.status(200).json(transacciones)

    if (!transacciones || transacciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron transacciones' })
    }
  } catch (error) {
    next(error)
  }
}

const getTransaccionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaccionEncontrada = await TransaccionModel.findByPk(id)

    if (!transaccionEncontrada || transaccionEncontrada.length === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' })
    }
    return res.status(200).json(transaccionEncontrada)
  } catch (error) {
    next(error)
  }
}

const postTransaccion = async (req, res, next) => {
  try {
    const { monto, fecha, descripcion, tipo, usuario_id, categoria_id } = req.body
    const transaccionCreada = await TransaccionModel.create({ monto, fecha, descripcion, tipo, usuario_id, categoria_id })
    return res.status(201).json(transaccionCreada)
  } catch (error) {
    next(error)
  }
}

const deleteTransaccion = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaccionEncontrada = await TransaccionModel.findByPk(id)

    if (!transaccionEncontrada || transaccionEncontrada.length === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' })
    }
    await TransaccionModel.destroy({ where: { id } })
    return res.status(204).json()
  } catch (error) {
    next(error)
  } 
}

module.exports = {
  getAllTransacciones,
  getTransaccionById,
  postTransaccion,
  deleteTransaccion
}
