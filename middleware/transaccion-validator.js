const validateInputTransaccion = (req, res, next) => {
    const { monto, fecha, descripcion, tipo, usuario_id, categoria_id } = req.body;
    const validTipos = ['ingreso', 'gasto'];
    const error = [];

    if (monto && typeof monto !== 'number') {
        error.push('El campo "monto" debe ser un número.');
    }
    if (fecha && !(fecha instanceof Date)) {
        error.push('El campo "fecha" debe ser una fecha válida.');
    }
    if (descripcion && typeof descripcion !== 'string') {
        error.push('El campo "descripcion" debe ser una cadena de texto.');
    }
    if (tipo && !validTipos.includes(tipo)) {
        error.push(`El campo "tipo" debe ser uno de los siguientes valores: ${validTipos.join(', ')}.`);
    }
    if (usuario_id && typeof usuario_id !== 'number') {
        error.push('El campo "usuario_id" debe ser un número.');
    }
    if (categoria_id && typeof categoria_id !== 'number') {
        error.push('El campo "categoria_id" debe ser un número.');
    }

    if (error.length > 0) {
        return res.status(400).json({ error: error.join(' ') });
    }
    next();
};

module.exports = { validateInputTransaccion };
