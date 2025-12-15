// src/pages/RequestPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash } from 'react-bootstrap-icons';
import './styles/RequestPage.css';
import { AppNavbar } from '../components/Navbar';
import { RootState, AppDispatch } from '../store';
import { deleteRequest, fetchRequestById, clearCurrentRequest } from '../store/requestSlice';
import { api } from '../api'; // <-- импортируем глобальный api с securityWorker
import type { HandlerDTORespCenterRequestExpert, HandlerDTORespCenterRequest } from '../api/generated/api';

export const RequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRequest, loading, error } = useSelector((state: RootState) => state.request);

  const [expertsWithImages, setExpertsWithImages] = useState<(HandlerDTORespCenterRequestExpert & { img_url?: string })[]>([]);

  // Загрузка заявки по ID
  useEffect(() => {
    if (id) {
      dispatch(fetchRequestById(Number(id)));
    }

    return () => {
      dispatch(clearCurrentRequest());
    };
  }, [id, dispatch]);

  // Загрузка данных экспертов (img_url)
  useEffect(() => {
    if (currentRequest?.experts?.length) {
      Promise.all(
        currentRequest.experts.map(async (e) => {
          if (e.id_artcenter == null) return e;
          try {
            const res = await api.api.expertsDetail(Number(e.id_artcenter));
            return { ...e, ...res.data };
          } catch (err) {
            console.error('Ошибка загрузки эксперта:', err);
            return e;
          }
        })
      ).then(setExpertsWithImages);
    } else {
      setExpertsWithImages([]);
    }
  }, [currentRequest]);

  const handleDeleteRequest = () => {
    if (currentRequest?.id_request && confirm('Удалить заявку? Это действие нельзя отменить.')) {
      dispatch(deleteRequest(currentRequest.id_request));
      navigate('/');
    }
  };

  if (loading) {
    return <div className="request-loading">Загрузка…</div>;
  }

  if (error) {
    return <div className="request-error">{error}</div>;
  }

  if (!currentRequest) {
    return <div className="request-empty">Заявка не найдена</div>;
  }

  return (
    <div className="request-body">
      <AppNavbar />
      <header className="header">
        <div className="header__title">Анализ композиционного центра</div>
        <a href="/" className="header__home-button">Домой</a>
      </header>

      <main className="order-page">
        <div className="order-container">
          <div className="description-section">
            <div className="description">
              <div className="description-header">Описание</div>
              <div className="description-text">
                Добавьте описание задачи, чтобы не перепутать её с другими.
              </div>
              <textarea
                className="desc-form"
                value={currentRequest.description || ''}
                readOnly
              />
            </div>

            <div className="delete-container">
              <button
                className="delete-button"
                onClick={handleDeleteRequest}
              >
                <Trash size={16} style={{ marginRight: '6px' }} />
                Удалить заявку
              </button>
            </div>
          </div>

          <section className="basket-grid">
            {expertsWithImages.length ? (
              expertsWithImages.map((e) => (
                <div key={e.id_artcenter} className="basket-card">
                  <div className="basket-card__image">
                    <img src={e.img_url || '/ArtFront/images/imageError.gif'} alt={e.title} />
                  </div>
                  <div className="basket-card__info">
                    <h3>{e.title}</h3>
                    <p><strong>Эксперт:</strong> {e.name}</p>
                    {e.center_x != null && e.center_y != null && (
                      <p><strong>X:</strong> {e.center_x}, <strong>Y:</strong> {e.center_y}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-basket">
                <p className="empty-basket__text">В этой заявке пока нет выбранных экспертов.</p>
              </div>
            )}
          </section>

          {currentRequest.factor_x != null && currentRequest.factor_y != null && (
            <div className="global-result-card">
              <h2>Результат анализа</h2>
              <p><strong>X:</strong> {currentRequest.factor_x}</p>
              <p><strong>Y:</strong> {currentRequest.factor_y}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestPage;
