import { sequelize } from './n-index.models'
import { DataTypes, Model, Optional } from 'sequelize'

import { InterfaceUsuario } from '../interfaces/usuario.interface'

type InputUsuario = Omit<InterfaceUsuario, 'id'>
interface UsuarioCreationAtribbutes extends Optional<InterfaceUsuario, 'id'> {}



export class UsuarioModel extends Model<InterfaceUsuario, UsuarioCreationAtribbutes> implements InterfaceUsuario  {
    
        declare id: number
        declare nombre: string
        declare apellido: string
        declare email: string
        declare password: string
        declare readonly createdAt: Date
        declare readonly updatedAt: Date

        static async findAllUsuarios(): Promise<UsuarioModel[]> {
            return await UsuarioModel.findAll()
        }
        static async findUsuarioById(id: number): Promise<UsuarioModel | null> {
            return await UsuarioModel.findByPk(id)
        }
        static async createUsuario(usuarioInput: InputUsuario): Promise<UsuarioModel> {
            return await UsuarioModel.create(usuarioInput)
        }

    }
UsuarioModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'Usuario',
        timestamps: true
    }
)