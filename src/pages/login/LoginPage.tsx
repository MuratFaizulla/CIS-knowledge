import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('@trk.nis.edu.kz');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await login(username, password);
      setMessage('✅ Успешный вход');
      navigate('/classes');
    } catch (error) {
      setMessage('❌ Неверные учетные данные или ошибка');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (isAuthenticated) {
    navigate('/classes');
    return null;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <img src={logo} alt="CIS Logo" className={styles.loginLogo} />
         <h2 className={styles.subtitle}>Добро пожаловать!</h2>
        <p className={styles.description}>
          Для доступа к закрытой части портала войдите в систему, используя свою корпоративную учетную запись.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Логин</label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Пароль</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        {message && (
          <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default LoginPage;