import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css'; // можно использовать тот же стиль, что и для логина

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) return alert('Пароли не совпадают');

    const result = await dispatch(registerThunk({ login, password }));
    if (registerThunk.fulfilled.match(result)) {
      alert('Регистрация успешна. Войдите в систему');
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submit}>
        <h3>Регистрация</h3>
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
        <input
          type="password"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          placeholder="Подтвердите пароль"
        />
        <button type="submit" disabled={loading}>
          Зарегистрироваться
        </button>
        {error && <div className="error">{error}</div>}
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
};
