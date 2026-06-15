export interface InterfaceTransaccion {
  id: number
  monto: number
  fecha: Date
  descripcion: string
  tipo: 'ingreso' | 'gasto'
  usuario_id: number
  categoria_id: number | null
  createdAt: Date
  updatedAt: Date
}