import { useState, useEffect } from 'react'
import {
  createTransaccionRequest,
  updateTransaccionRequest,
  createCategoriaRequest
} from '../services/api'
import styles from './TransaccionForm.module.css'

const EMPTY = {
  monto:       '',
  fecha:       new Date().toISOString().slice(0, 10),
  descripcion: '',
  tipo:        'gasto',
  categoria_id: ''
}

const NUEVA_CATEGORIA = '__nueva__'

export default function TransaccionForm({ transaccion, categorias, onSuccess, onClose, onCategoriaCreada }) {
  const isEditing = Boolean(transaccion)
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // Estado para la creación inline de categoría
  const [creandoCategoria,    setCreandoCategoria]    = useState(false)
  const [nombreNuevaCategoria, setNombreNuevaCategoria] = useState('')
  const [guardandoCategoria,  setGuardandoCategoria]  = useState(false)

  // Si viene una transacción para editar, pre-carga el formulario
  useEffect(() => {
    if (transaccion) {
      setForm({
        monto:        transaccion.monto,
        fecha:        transaccion.fecha?.slice(0, 10) ?? EMPTY.fecha,
        descripcion:  transaccion.descripcion ?? '',
        tipo:         transaccion.tipo,
        categoria_id: transaccion.categoria_id ?? ''
      })
    } else {
      setForm(EMPTY)
    }
  }, [transaccion])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'categoria_id' && value === NUEVA_CATEGORIA) {
      setCreandoCategoria(true)
      return
    }

    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleCrearCategoria = async () => {
    const nombre = nombreNuevaCategoria.trim()
    if (!nombre) return

    setGuardandoCategoria(true)
    setError('')
    try {
      const { data: nuevaCategoria } = await createCategoriaRequest({ nombre })
      onCategoriaCreada?.(nuevaCategoria)
      setForm((f) => ({ ...f, categoria_id: nuevaCategoria.id }))
      setCreandoCategoria(false)
      setNombreNuevaCategoria('')
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo crear la categoría.')
    } finally {
      setGuardandoCategoria(false)
    }
  }

  const handleCancelarCategoria = () => {
    setCreandoCategoria(false)
    setNombreNuevaCategoria('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.categoria_id) {
      setError('Elegí una categoría para la transacción.')
      return
    }

    setLoading(true)

    const payload = {
      ...form,
      monto:        parseFloat(form.monto),
      categoria_id: Number(form.categoria_id)
    }

    try {
      if (isEditing) {
        await updateTransaccionRequest(transaccion.id, payload)
      } else {
        await createTransaccionRequest(payload)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || 'Error al guardar la transacción.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {isEditing ? 'Editar transacción' : 'Nueva transacción'}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Tipo */}
          <div className={styles.tipoToggle}>
            <button
              type="button"
              className={`${styles.tipoBtn} ${form.tipo === 'gasto' ? styles.gastoActive : ''}`}
              onClick={() => setForm((f) => ({ ...f, tipo: 'gasto' }))}
            >
              Gasto
            </button>
            <button
              type="button"
              className={`${styles.tipoBtn} ${form.tipo === 'ingreso' ? styles.ingresoActive : ''}`}
              onClick={() => setForm((f) => ({ ...f, tipo: 'ingreso' }))}
            >
              Ingreso
            </button>
          </div>

          <label className={styles.label}>
            Monto *
            <input
              className={styles.input}
              type="number"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </label>

          <label className={styles.label}>
            Fecha *
            <input
              className={styles.input}
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.label}>
            Descripción
            <input
              className={styles.input}
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: supermercado, sueldo..."
            />
          </label>

          <label className={styles.label}>
            Categoría *
            {!creandoCategoria ? (
              <select
                className={styles.input}
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Elegí una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
                <option value={NUEVA_CATEGORIA}>+ Crear nueva categoría...</option>
              </select>
            ) : (
              <div className={styles.nuevaCategoriaRow}>
                <input
                  className={styles.input}
                  type="text"
                  value={nombreNuevaCategoria}
                  onChange={(e) => setNombreNuevaCategoria(e.target.value)}
                  placeholder="Nombre de la categoría"
                  autoFocus
                />
                <button
                  type="button"
                  className={styles.miniBtn}
                  onClick={handleCrearCategoria}
                  disabled={guardandoCategoria || !nombreNuevaCategoria.trim()}
                >
                  {guardandoCategoria ? '...' : 'Crear'}
                </button>
                <button
                  type="button"
                  className={styles.miniBtnGhost}
                  onClick={handleCancelarCategoria}
                  disabled={guardandoCategoria}
                >
                  Cancelar
                </button>
              </div>
            )}
          </label>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading || creandoCategoria}>
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear transacción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
