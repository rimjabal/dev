import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';
import styles from './Header.module.css'; 

interface HeaderProps { 
  title: string; 
  onMenuClick: () => void; 
} 

export default function Header({ title, onMenuClick }: HeaderProps) { 
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  return (
    <header className={styles.header}> 
      <div className={styles.left}> 
        <button className={styles.menuBtn} onClick={onMenuClick}>☰</button> 
        <h1 className={styles.logo}>{title}</h1> 
      </div>
      <div className={styles.right}>
        {userName && <span className={styles.userName}>{userName}</span>}
        {userName && (
          <button className={styles.logoutBtn} onClick={() => dispatch(logout())}>
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
} 