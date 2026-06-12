const validateInputUsuario = (req, res, next) => {
    const { nombre, apellido, email, password } = req.body;
    const error = [];

    if (nombre && typeof nombre !== 'string') {
        error.push('El campo "nombre" debe ser una cadena de texto.');
    }
    if (apellido && typeof apellido !== 'string') {
        error.push('El campo "apellido" debe ser una cadena de texto.');
    }
    if (email && typeof email !== 'string') {
        error.push('El campo "email" debe ser una cadena de texto.');
    }
    if (password && typeof password !== 'string') {
        error.push('El campo "password" debe ser una cadena de texto.');
    }

    if (error.length > 0) {
        return res.status(400).json({ error: error.join(' ') });
    }
    next();
};

module.exports = { validateInputUsuario };