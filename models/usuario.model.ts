// models/usuario.model.ts
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './n-index.models'
import { InterfaceUsuario } from '../interfaces/usuario.interface'

type InputUsuario = Omit<InterfaceUsuario, 'id' | 'createdAt' | 'updatedAt'>
interface UsuarioCreationAttributes extends Optional<
  InterfaceUsuario,
  'id' | 'createdAt' | 'updatedAt'
> {}

export class UsuarioModel
  extends Model<InterfaceUsuario, UsuarioCreationAttributes>
  implements InterfaceUsuario
{
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

  static async findUsuarioByEmail(email: string): Promise<UsuarioModel | null> {
    return await UsuarioModel.findOne({ where: { email } })
  }

  static async createUsuario(
    usuarioInput: InputUsuario
  ): Promise<UsuarioModel> {
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: true // en el diagrama ER no era obligatorio
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'usuarios', // minúsculas, coincide con freezeTableName en conexion.js
    timestamps: true
  }
)
