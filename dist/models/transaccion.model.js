"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransaccionModel = void 0;
// models/transaccion.model.ts
const sequelize_1 = require("sequelize");
const n_index_models_1 = require("./n-index.models");
const usuario_model_1 = require("./usuario.model");
const categoria_model_1 = require("./categoria.model");
class TransaccionModel extends sequelize_1.Model {
    static async findAllTransacciones() {
        return await TransaccionModel.findAll();
    }
    static async findTransaccionById(id) {
        return await TransaccionModel.findByPk(id);
    }
    static async findTransaccionesByUsuario(usuario_id) {
        return await TransaccionModel.findAll({ where: { usuario_id } });
    }
    static async createTransaccion(transaccionInput) {
        return await TransaccionModel.create(transaccionInput);
    }
}
exports.TransaccionModel = TransaccionModel;
TransaccionModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monto: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM('ingreso', 'gasto'),
        allowNull: false
    },
    usuario_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: usuario_model_1.UsuarioModel,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    categoria_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: categoria_model_1.CategoriaModel,
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: n_index_models_1.sequelize,
    tableName: 'transacciones',
    timestamps: true
});
