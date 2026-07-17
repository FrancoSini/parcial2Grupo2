// models/categoria.model.ts
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './n-index.models'
import { InterfaceCategoria } from '../interfaces/categoria.interface'

type InputCategoria = Omit<InterfaceCategoria, 'id' | 'createdAt' | 'updatedAt'>
interface CategoriaCreationAttributes extends Optional<
  InterfaceCategoria,
  'id' | 'createdAt' | 'updatedAt'
> {}

export class CategoriaModel
  extends Model<InterfaceCategoria, CategoriaCreationAttributes>
  implements InterfaceCategoria
{
  declare id: number
  declare nombre: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllCategorias(): Promise<CategoriaModel[]> {
    return await CategoriaModel.findAll()
  }

  static async findCategoriaById(id: number): Promise<CategoriaModel | null> {
    return await CategoriaModel.findByPk(id)
  }

  static async createCategoria(
    categoriaInput: InputCategoria
  ): Promise<CategoriaModel> {
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
    tableName: 'categorias',
    timestamps: true
  }
)
