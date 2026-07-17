import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar({ user }) {
  const { logout } = useAuth()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>₿</span>
          <span className={styles.name}>FinanzasApp</span>
        </div>
        <div className={styles.right}>
          <span className={styles.userInfo}>
            {user?.nombre} {user?.apellido}
          </span>
          <button className={styles.logoutBtn} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}
