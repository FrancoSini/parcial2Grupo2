import styles from './TransaccionList.module.css'

function fmt(val) {
  return Number(val).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  })
}

function fmtFecha(fechaStr) {
  const d = new Date(fechaStr)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function TransaccionList({ transacciones, categorias, onDelete, onEdit }) {
  const getNombreCategoria = (id) =>
    categorias.find((c) => c.id === id)?.nombre ?? '—'

  if (!transacciones || transacciones.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Sin transacciones</p>
        <p className={styles.emptyHint}>Creá tu primera transacción con el botón de arriba.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.sectionTitle}>Mis transacciones</h3>
      <div className={styles.table}>
        <div className={styles.thead}>
          <span>Fecha</span>
          <span>Descripción</span>
          <span>Categoría</span>
          <span>Tipo</span>
          <span className={styles.right}>Monto</span>
          <span></span>
        </div>

        {transacciones.map((t) => (
          <div key={t.id} className={styles.row}>
            <span className={styles.fecha}>{fmtFecha(t.fecha)}</span>
            <span className={styles.desc}>{t.descripcion || '—'}</span>
            <span className={styles.cat}>{getNombreCategoria(t.categoria_id)}</span>
            <span>
              <span className={`${styles.badge} ${t.tipo === 'ingreso' ? styles.ingreso : styles.gasto}`}>
                {t.tipo}
              </span>
            </span>
            <span className={`${styles.monto} ${styles.right} ${t.tipo === 'ingreso' ? styles.montoIngreso : styles.montoGasto}`}>
              {t.tipo === 'ingreso' ? '+' : '-'} {fmt(t.monto)}
            </span>
            <span className={styles.actions}>
              <button className={styles.editBtn}   onClick={() => onEdit(t)}>Editar</button>
              <button className={styles.deleteBtn} onClick={() => onDelete(t.id)}>Eliminar</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
