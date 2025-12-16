import { useState, useEffect } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  PersonCircle, 
  PencilSquare, 
  CheckLg, 
  XLg, 
  BoxArrowRight 
} from 'react-bootstrap-icons';
import { 
  updateMeThunk, 
  logoutThunk, 
  getMeThunk 
} from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { AppNavbar } from '../components/Navbar';
import './styles/UserPage.css';

export const UserPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token, isAuth } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ password: '' });

  useEffect(() => {
    if (!isAuth || !token) {
      navigate('/login');
    } else if (!user) {
      dispatch(getMeThunk());
    }
  }, [isAuth, token, navigate, user, dispatch]);

  const handleSave = () => {
    if (!editData.password.trim()) {
      alert('Введите новый пароль');
      return;
    }

    dispatch(updateMeThunk({ password: editData.password }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setEditData({ password: '' });
        alert('Пароль успешно обновлен');
        dispatch(getMeThunk());
      })
      .catch((err) => {
        alert(`Ошибка: ${err}`);
      });
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate('/login');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ password: '' });
  };

  if (!user) {
    return (
      <div className="user-page-wrapper">
        <AppNavbar />
        <div className="user-page-body">
          <div className="user-page-loading">
            Загрузка профиля...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-wrapper">
      <AppNavbar />
      <div className="user-page-body">
        <Container fluid className="user-page-container">
          <div className="user-page-content">
            <h1 className="user-page-title">ArtAnalysis</h1>
            <p className="user-page-lead">Личный кабинет эксперта по искусству</p>

            <Card className="user-page-card">
              <Card.Body className="p-4">
                {/* Шапка профиля */}
                <div className="user-profile-header">
                  <div className="user-profile-avatar">
                    <PersonCircle size={80} color="#000" />
                  </div>
                  <div className="user-profile-info">
                    <h2 className="user-profile-name">{user.login}</h2>
                    <p className="user-profile-role">Исследователь композиционных центров</p>
                  </div>
                </div>

                {/* Форма */}
                <Form className="user-profile-form">
                  <Form.Group className="mb-3">
                    <Form.Label className="user-profile-label">Логин</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.login || ''}
                      disabled
                      className="user-profile-input disabled"
                    />
                    <Form.Text className="user-profile-hint">
                      Логин нельзя изменить
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="user-profile-label">
                      {isEditing ? 'Новый пароль' : 'Пароль'}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={isEditing ? editData.password : '••••••••'}
                      placeholder={isEditing ? 'Введите новый пароль' : ''}
                      onChange={(e) => setEditData({ password: e.target.value })}
                      disabled={!isEditing}
                      className={`user-profile-input ${isEditing ? 'editing' : ''}`}
                    />
                    {isEditing && (
                      <Form.Text className="user-profile-hint">
                        Введите новый пароль для изменения.
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Кнопки */}
                  <div className="user-profile-actions">
                    <div className="user-profile-edit-actions">
                      {!isEditing ? (
                        <Button
                          type="button"
                          className="user-profile-btn edit"
                          onClick={() => setIsEditing(true)}
                        >
                          <PencilSquare size={16} /> Изменить пароль
                        </Button>
                      ) : (
                        <div className="d-flex gap-2">
                          <Button
                            type="button"
                            className="user-profile-btn save"
                            onClick={handleSave}
                          >
                            <CheckLg size={16} /> Сохранить
                          </Button>
                          <Button
                            type="button"
                            className="user-profile-btn cancel"
                            onClick={handleCancel}
                          >
                            <XLg size={16} /> Отмена
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      className="user-profile-btn logout"
                      onClick={handleLogout}
                    >
                      <BoxArrowRight size={16} /> Выйти
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
};
