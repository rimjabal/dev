import { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './Login.module.css';

interface UserWithPassword {
  id: string;
  email: string;
  name: string;
  password: string;
}

export default function Login() {
  const { state, dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await fetch(`http://localhost:4000/users?email=${encodeURIComponent(email)}`);
      const users: UserWithPassword[] = await res.json();

      if (users.length === 0 || users[0].password !== password) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' });
        return;
      }

      const { password: _discardedPassword, ...user } = users[0];
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Erreur de connexion au serveur' });
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer</p>

        {state.error && <div className={styles.error}>{state.error}</div>}

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

        <button type="submit" className={styles.button} disabled={state.loading}>
          {state.loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}