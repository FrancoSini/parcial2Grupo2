import { sequelize } from './n-index.models';
import {DataTypes, Model, Optional} from 'sequelize';

import { InterfaceCategoria } from '../interfaces/categoria.interface';
    
type InputCategoria = Omit<InterfaceCategoria, 'id'>;

interface CategoriaCreationAtributes extends Optional<InputCategoria, 'id'> {}

export class CategoriaModel extends Model<InterfaceCategoria, CategoriaCreationAtributes> implements InterfaceCategoria {

        declare id: number
        declare nombre: string

        static async findAllCategorias(): Promise<InterfaceCategoria[]> {
            return await CategoriaModel.findAll();
        }

        static async findCategoriaById(id: number): Promise<CategoriaModel | null> {
            return await CategoriaModel.findByPk(id)
        }
        static async createCategoria(categoriaInput: InputCategoria): Promise<CategoriaModel> {
            return await CategoriaModel.create(categoriaInput)
        }

    }

CategoriaModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'Categoria'
        timestamps: true
    }
);

