"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransaccionModel = exports.CategoriaModel = exports.UsuarioModel = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
});
const usuario_model_1 = require("./usuario.model");
Object.defineProperty(exports, "UsuarioModel", { enumerable: true, get: function () { return usuario_model_1.UsuarioModel; } });
const categoria_model_1 = require("./categoria.model");
Object.defineProperty(exports, "CategoriaModel", { enumerable: true, get: function () { return categoria_model_1.CategoriaModel; } });
const transaccion_model_1 = require("./transaccion.model");
Object.defineProperty(exports, "TransaccionModel", { enumerable: true, get: function () { return transaccion_model_1.TransaccionModel; } });
require("./cardinalidades.model");
