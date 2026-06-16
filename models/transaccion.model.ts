// models/transaccion.model.ts
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './n-index.models'
import { InterfaceTransaccion } from '../interfaces/transaccion.interface'
import { UsuarioModel } from './usuario.model'
import { CategoriaModel } from './categoria.model'

type InputTransaccion = Omit<
  InterfaceTransaccion,
  'id' | 'createdAt' | 'updatedAt'
>
interface TransaccionCreationAttributes extends Optional<
  InterfaceTransaccion,
  'id' | 'createdAt' | 'updatedAt'
> {}

export class TransaccionModel
  extends Model<InterfaceTransaccion, TransaccionCreationAttributes>
  implements InterfaceTransaccion
{
  declare id: number
  declare monto: number
  declare fecha: Date
  declare descripcion: string
  declare tipo: 'ingreso' | 'gasto'
  declare usuario_id: number
  declare categoria_id: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllTransacciones(): Promise<TransaccionModel[]> {
    return await TransaccionModel.findAll()
  }

  static async findTransaccionById(
    id: number
  ): Promise<TransaccionModel | null> {
    return await TransaccionModel.findByPk(id)
  }

  static async findTransaccionesByUsuario(
    usuario_id: number
  ): Promise<TransaccionModel[]> {
    return await TransaccionModel.findAll({ where: { usuario_id } })
  }

  static async createTransaccion(
    transaccionInput: InputTransaccion
  ): Promise<TransaccionModel> {
    return await TransaccionModel.create(transaccionInput)
  }
}

TransaccionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'gasto'),
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsuarioModel,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CategoriaModel,
        key: 'id'
      },
      onDelete: 'SET NULL'
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
    tableName: 'transacciones',
    timestamps: true
  }
)
