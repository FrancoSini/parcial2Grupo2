import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getTransaccionesRequest,
  getBalanceRequest,
  getCategoriasRequest,
  deleteTransaccionRequest
} from '../services/api'
import Navbar from '../components/Navbar'
import BalanceCards from '../components/BalanceCards'
import TransaccionList from '../components/TransaccionList'
import TransaccionForm from '../components/TransaccionForm'
import FiltrosTransaccion, {
  FILTROS_VACIOS
} from '../components/FiltrosTransaccion'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()

  const [transacciones, setTransacciones] = useState([])
  const [balance, setBalance] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)

  // Aplica los filtros en memoria sobre la lista completa
  const transaccionesFiltradas = useMemo(() => {
    return transacciones.filter((t) => {
      if (filtros.tipo && t.tipo !== filtros.tipo) return false

      if (
        filtros.categoria_id &&
        String(t.categoria_id) !== String(filtros.categoria_id)
      )
        return false

      if (filtros.fechaDesde) {
        const desde = new Date(filtros.fechaDesde)
        const fecha = new Date(t.fecha)
        if (fecha < desde) return false
      }

      if (filtros.fechaHasta) {
        const hasta = new Date(filtros.fechaHasta)
        hasta.setHours(23, 59, 59)
        const fecha = new Date(t.fecha)
        if (fecha > hasta) return false
      }

      return true
    })
  }, [transacciones, filtros])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [tRes, bRes, cRes] = await Promise.all([
        getTransaccionesRequest().catch(() => ({ data: [] })),
        getBalanceRequest().catch(() => ({
          data: { balance: 0, totalIngresos: 0, totalGastos: 0 }
        })),
        getCategoriasRequest().catch(() => ({ data: [] }))
      ])
      setTransacciones(tRes.data)
      setBalance(bRes.data)
      setCategorias(cRes.data)
    } catch (err) {
      setError('Error al cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta transacción?')) return
    try {
      await deleteTransaccionRequest(id)
      await fetchData()
    } catch {
      setError('No se pudo eliminar la transacción.')
    }
  }

  const handleEdit = (transaccion) => {
    setEditando(transaccion)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditando(null)
  }

  const handleFormSuccess = async () => {
    handleFormClose()
    await fetchData()
  }

  const handleCategoriaCreada = (nuevaCategoria) => {
    setCategorias((prev) => [...prev, nuevaCategoria])
  }

  return (
    <div className={styles.page}>
      <Navbar user={user} />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.greeting}>Hola, {user?.nombre} 👋</h2>
            <p className={styles.subtitle}>
              Acá está el resumen de tus finanzas
            </p>
          </div>
          <button
            className={styles.newBtn}
            onClick={() => {
              setEditando(null)
              setShowForm(true)
            }}
          >
            + Nueva transacción
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.loading}>Cargando...</p>
        ) : (
          <>
            <BalanceCards balance={balance} />
            <FiltrosTransaccion
              filtros={filtros}
              categorias={categorias}
              onChange={setFiltros}
              onLimpiar={() => setFiltros(FILTROS_VACIOS)}
              total={transacciones.length}
              filtrado={transaccionesFiltradas.length}
            />
            <TransaccionList
              transacciones={transaccionesFiltradas}
              categorias={categorias}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </>
        )}
      </main>

      {showForm && (
        <TransaccionForm
          transaccion={editando}
          categorias={categorias}
          onSuccess={handleFormSuccess}
          onClose={handleFormClose}
          onCategoriaCreada={handleCategoriaCreada}
        />
      )}
    </div>
  )
}
