"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const sequelize_1 = require("sequelize");
const n_index_models_1 = require("./n-index.models");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuarioModel extends sequelize_1.Model {
    static async findAllUsuarios() {
        return await UsuarioModel.findAll();
    }
    static async findUsuarioById(id) {
        return await UsuarioModel.findByPk(id);
    }
    static async findUsuarioByEmail(email) {
        return await UsuarioModel.findOne({ where: { email } });
    }
    static async createUsuario(usuarioInput) {
        return await UsuarioModel.create(usuarioInput);
    }
}
exports.UsuarioModel = UsuarioModel;
UsuarioModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
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
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        beforeCreate: async (usuario) => {
            usuario.password = await bcrypt_1.default.hash(usuario.password, 10);
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                usuario.password = await bcrypt_1.default.hash(usuario.password, 10);
            }
        }
    }
});
