const { TransaccionModel } = require('../dist/models/transaccion.model')

const getAllTransacciones = async (req, res, next) => {
  try {
    const transacciones = await TransaccionModel.findAll({
      where: { usuario_id: req.user.id }
    })
    if (!transacciones || transacciones.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron transacciones' })
    }
    return res.status(200).json(transacciones)
  } catch (error) {
    next(error)
  }
}

const getTransaccionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaccion = await TransaccionModel.findOne({
      where: { id, usuario_id: req.user.id }
    })
    if (!transaccion) {
      return res.status(404).json({ msg: `Transacción ${id} no encontrada` })
    }
    return res.status(200).json(transaccion)
  } catch (error) {
    next(error)
  }
}

const postTransaccion = async (req, res, next) => {
  try {
    const { monto, fecha, descripcion, tipo, categoria_id } = req.body
    const transaccionCreada = await TransaccionModel.create({
      monto,
      fecha: fecha || new Date(),
      descripcion,
      tipo,
      usuario_id: req.user.id, // viene del token
      categoria_id
    })
    return res.status(201).json(transaccionCreada)
  } catch (error) {
    next(error)
  }
}

const putTransaccion = async (req, res, next) => {
  try {
    const { id } = req.params
    const { monto, fecha, descripcion, tipo, categoria_id } = req.body
    const transaccion = await TransaccionModel.findOne({
      where: { id, usuario_id: req.user.id }
    })
    if (!transaccion) {
      return res.status(404).json({ msg: `Transacción ${id} no encontrada` })
    }
    await transaccion.update({ monto, fecha, descripcion, tipo, categoria_id })
    return res.status(200).json(transaccion)
  } catch (error) {
    next(error)
  }
}

const deleteTransaccion = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaccion = await TransaccionModel.findOne({
      where: { id, usuario_id: req.user.id }
    })
    if (!transaccion) {
      return res.status(404).json({ msg: `Transacción ${id} no encontrada` })
    }
    await transaccion.destroy()
    return res
      .status(200)
      .json({ msg: `Transacción ${id} eliminada correctamente` })
  } catch (error) {
    next(error)
  }
}
const getBalance = async (req, res, next) => {
  try {
    const transacciones = await TransaccionModel.findAll({
      where: { usuario_id: req.user.id }
    })

    let balance = 0
    let totalIngresos = 0
    let totalGastos = 0

    transacciones.forEach((t) => {
      if (t.tipo === 'ingreso') {
        totalIngresos += parseFloat(t.monto)
        balance += parseFloat(t.monto)
      } else {
        totalGastos += parseFloat(t.monto)
        balance -= parseFloat(t.monto)
      }
    })

    return res.status(200).json({
      balance: balance.toFixed(2),
      totalIngresos: totalIngresos.toFixed(2),
      totalGastos: totalGastos.toFixed(2)
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTransacciones,
  getTransaccionById,
  getBalance,
  postTransaccion,
  putTransaccion,
  deleteTransaccion
}
