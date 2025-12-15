// src/pages/Register.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'; // можно использовать тот же CSS, что и для Login

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(registerThunk({ login, password }));

    if (registerThunk.fulfilled.match(resultAction)) {
      // После успешной регистрации редирект на логин
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Регистрация</h3>
        <p className="login-subtitle">
          Создайте аккаунт для анализа композиционного центра на произведении искусства
        </p>

        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Логин"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />

        <button type="submit" disabled={loading}>
          Зарегистрироваться
        </button>

        {error && <div className="error">{error}</div>}

        <p className="register-text">
          Уже есть аккаунт?{' '}
          <span
            className="register-link"
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          >
            Войти
          </span>
        </p>
      </form>
    </div>
  );
};
