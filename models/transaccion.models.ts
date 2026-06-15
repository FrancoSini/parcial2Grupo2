import { sequelize } from './n-index.models'
import { DataTypes, Model, Optional } from 'sequelize'

import { InterfaceTransaccion } from '../interfaces/transaccion.interface'

type InputTransaccion = Omit<InterfaceTransaccion, 'id'>
interface TransaccionCreationAttributes extends Optional<InterfaceTransaccion, 'id'> {}



export class TransaccionModel extends Model<InterfaceTransaccion, TransaccionCreationAttributes> implements InterfaceTransaccion  {
    
        declare id: number
        declare monto: number
        declare fecha: Date
        declare descripcion: string
        declare tipo: 'ingreso' | 'gasto'
        declare usuario_id: number
        declare categoria_id: number | null
        declare readonly createdAt: Date
        declare readonly updatedAt: Date

        static async findAllTransacciones(): Promise<TransaccionModel[]> {
            return await TransaccionModel.findAll()
        }
        static async findTransaccionById(id: number): Promise<TransaccionModel | null> {
            return await TransaccionModel.findByPk(id)
        }
        static async createTransaccion(transaccionInput: InputTransaccion): Promise<TransaccionModel> {
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
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('ingreso', 'gasto'),
            allowNull: false
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
        },
    {
        sequelize,
        tableName: 'Transacciones',
        timestamps: true
    }
)