import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/Login.css';

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuth } = useSelector((s: RootState) => s.auth);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ login, password }));
  };

  // После успешного входа перенаправляем на страницу экспертов
  useEffect(() => {
    if (isAuth) {
      navigate('/experts');
    }
  }, [isAuth, navigate]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submit}>
        <h3>Вход</h3>
        <p className="login-subtitle">
          Анализ композиционного центра на произведении искусства
        </p>
        <input
          value={login}
          onChange={e => setLogin(e.target.value)}
          placeholder="Логин"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button type="submit" disabled={loading}>
          Войти
        </button>
        {error && <div className="error">{error}</div>}

        <p className="register-text">
          Нет аккаунта? <Link to="/register" className="register-link">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
};
