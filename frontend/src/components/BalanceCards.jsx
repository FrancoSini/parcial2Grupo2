import styles from './BalanceCards.module.css'

function fmt(val) {
  return Number(val).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  })
}

export default function BalanceCards({ balance }) {
  if (!balance) return null

  const balanceNum = parseFloat(balance.balance)

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.main}`}>
        <span className={styles.cardLabel}>Balance total</span>
        <span className={`${styles.amount} ${balanceNum >= 0 ? styles.positive : styles.negative}`}>
          {fmt(balance.balance)}
        </span>
      </div>
      <div className={`${styles.card} ${styles.income}`}>
        <span className={styles.cardLabel}>Total ingresos</span>
        <span className={`${styles.amount} ${styles.positive}`}>
          {fmt(balance.totalIngresos)}
        </span>
      </div>
      <div className={`${styles.card} ${styles.expense}`}>
        <span className={styles.cardLabel}>Total gastos</span>
        <span className={`${styles.amount} ${styles.negative}`}>
          {fmt(balance.totalGastos)}
        </span>
      </div>
    </div>
  )
}
