"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaModel = void 0;
// models/categoria.model.ts
const sequelize_1 = require("sequelize");
const n_index_models_1 = require("./n-index.models");
class CategoriaModel extends sequelize_1.Model {
    static async findAllCategorias() {
        return await CategoriaModel.findAll();
    }
    static async findCategoriaById(id) {
        return await CategoriaModel.findByPk(id);
    }
    static async createCategoria(categoriaInput) {
        return await CategoriaModel.create(categoriaInput);
    }
}
exports.CategoriaModel = CategoriaModel;
CategoriaModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(100),
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
    tableName: 'categorias',
    timestamps: true
});
