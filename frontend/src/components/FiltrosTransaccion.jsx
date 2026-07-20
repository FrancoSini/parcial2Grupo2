import styles from './FiltrosTransaccion.module.css'

const FILTROS_VACIOS = {
  categoria_id: '',
  fechaDesde: '',
  fechaHasta: '',
  tipo: ''
}

export default function FiltrosTransaccion({
  filtros,
  categorias,
  onChange,
  onLimpiar,
  total,
  filtrado
}) {
  const hayFiltros =
    filtros.categoria_id ||
    filtros.fechaDesde ||
    filtros.fechaHasta ||
    filtros.tipo

  const handleChange = (e) =>
    onChange({ ...filtros, [e.target.name]: e.target.value })

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        {/* Filtro por tipo */}
        <label className={styles.field}>
          <span className={styles.label}>Tipo</span>
          <select
            className={styles.input}
            name="tipo"
            value={filtros.tipo}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </label>

        {/* Filtro por categoría */}
        <label className={styles.field}>
          <span className={styles.label}>Categoría</span>
          <select
            className={styles.input}
            name="categoria_id"
            value={filtros.categoria_id}
            onChange={handleChange}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        {/* Filtro fecha desde */}
        <label className={styles.field}>
          <span className={styles.label}>Desde</span>
          <input
            className={styles.input}
            type="date"
            name="fechaDesde"
            value={filtros.fechaDesde}
            onChange={handleChange}
          />
        </label>

        {/* Filtro fecha hasta */}
        <label className={styles.field}>
          <span className={styles.label}>Hasta</span>
          <input
            className={styles.input}
            type="date"
            name="fechaHasta"
            value={filtros.fechaHasta}
            onChange={handleChange}
          />
        </label>

        {/* Limpiar */}
        {hayFiltros && (
          <button className={styles.limpiarBtn} onClick={onLimpiar}>
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Resultado del filtro */}
      {hayFiltros && (
        <p className={styles.resultado}>
          Mostrando <strong>{filtrado}</strong> de {total} transacciones
        </p>
      )}
    </div>
  )
}

export { FILTROS_VACIOS }
