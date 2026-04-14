import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import styles from './Login.module.css';
import type { AppDispatch, RootState } from '../../store';
import { loginFailure, loginStart, loginSuccess } from './authSlice';

interface UserWithPassword {
  id: string;
  email: string;
  name: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const from = (location.state as { from?: string } | null)?.from || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data: users } = await api.get<UserWithPassword[]>('/users', {
        params: { email },
      });

      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return;
      }

      const { password: _discardedPassword, ...authenticatedUser } = users[0];
      const fakeToken = btoa(
        JSON.stringify({
          userId: authenticatedUser.id,
          email: authenticatedUser.email,
          role: 'admin',
          exp: Date.now() + 3600000,
        }),
      );

      dispatch(loginSuccess({ user: authenticatedUser, token: fakeToken }));
    } catch {
      dispatch(loginFailure('Erreur serveur'));
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer</p>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}