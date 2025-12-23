import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash } from 'react-bootstrap-icons';
import './styles/RequestPage.css';
import { AppNavbar } from '../components/Navbar';

import {
  fetchCurrentDraftRequest,
  fetchRequestById,
  updateRequestDescription,
  deleteRequest,
  removeExpertFromRequest,
  formRequest,
  resetOperationSuccess,
  clearCurrentRequest,
  saveExpertsCoordinates,
  resolveRequest,
} from '../store/requestSlice';

import type { AppDispatch, RootState } from '../store';
import type { HandlerDTORespCenterRequestExpert } from '../api/generated/api';

const RequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [showResultModal, setShowResultModal] = useState(false);

  const {
    currentRequest,
    loading,
    operationSuccess,
    expertsById,
  } = useSelector((state: RootState) => state.request);

  const storedUser = localStorage.getItem('userInfo');
  const userObj = storedUser ? JSON.parse(storedUser) : null;
  const isModerator = userObj?.is_admin || false;

  useEffect(() => {
    if (routeId) {
      // Открываем конкретную заявку (для истории и модератора)
      const numericId = Number(routeId);
      if (!Number.isNaN(numericId)) {
        dispatch(fetchRequestById(numericId));
      }
    } else {
      // Для пользователя без ID — работаем с его текущим черновиком
      dispatch(fetchCurrentDraftRequest());
    }

    return () => {
      dispatch(clearCurrentRequest());
      dispatch(resetOperationSuccess());
    };
  }, [dispatch, routeId]);

  if (loading || !currentRequest) {
    return (
      <div className="request-loading-container">
        <div className="request-spinner" />
        <span>Загрузка…</span>
      </div>
    );
  }

  const requestId = currentRequest.id_request;
  const expertLinks = currentRequest.experts ?? [];

  console.log('RequestPage: currentRequest =', currentRequest);
  console.log('RequestPage: expertLinks =', expertLinks);

  const handleSaveDescription = () => {
    if (!requestId) return;

    const desc = (currentRequest.description ?? '').trim();
    if (!desc) {
      // Не отправляем пустое описание на бэк, чтобы не ловить 400
      return;
    }

    dispatch(
      updateRequestDescription({
        id: requestId,
        description: desc,
      })
    );
  };

  const handleFormRequest = () => {
    if (!requestId) return;

    if (!confirm('Сформировать заявку? Это действие нельзя отменить.')) {
      return;
    }

    dispatch(formRequest(requestId))
      .unwrap()
      .then(() => {
        // После успешного оформления отправляем пользователя
        // в список заявок, где он увидит заявку в статусе "Сформирована"
        navigate('/requests');
      })
      .catch(() => {
        // Ошибку уже обработает слайс через state.error
      });
  };

  const handleSaveData = () => {
    if (requestId) {
      dispatch(saveExpertsCoordinates());
    }
  };

  const handleCompleteRequest = () => {
    if (requestId) {
      if (confirm('Завершить обработку заявки?')) {
        dispatch(resolveRequest({ id: requestId, action: 'complete' }))
          .unwrap()
          .then(() => {
            setShowResultModal(true);
          });
      }
    }
  };

  // Статус заявки может приходить как на английском (из swagger-генерации),
  // так и на русском (как в модельках бэкенда). Поддерживаем оба варианта.
  const status = currentRequest.request_status as string | undefined;
  const isDraft =
    status === 'draft' || status === 'черновик';
  const isFormed =
    status === 'formed' || status === 'сформирован';
  const isCompleted =
    status === 'completed' || status === 'завершён';

  console.log('RequestPage DEBUG:', {
    isModerator,
    isDraft,
    isFormed,
    request_status: currentRequest.request_status,
    userObj,
  });

  return (
    <div className="request-body">
      <AppNavbar />

      <main className="order-page">
        <div className="order-container">

          {/* Описание + действия */}
          <div className="description-row">
            <div className="description">
              <div className="description-header">
                <span className="description-title">Название расчёта</span>
                <span className="description-status-pill">
                  {isDraft && 'Черновик'}
                  {isFormed && 'Сформирована'}
                  {isCompleted && 'Завершена'}
                  {!isDraft && !isFormed && !isCompleted && currentRequest.request_status}
                </span>
              </div>
              <div className="description-text">
                Укажите понятное название и короткое описание расчёта, чтобы позже было легко найти нужную задачу.
              </div>

              <textarea
                className="desc-form"
                value={currentRequest.description ?? ''}
                onChange={(e) =>
                  dispatch({
                    type: 'request/setCurrentRequestField',
                    payload: {
                      field: 'description', 
                      value: e.target.value,
                    },
                  })
                }
                disabled={!isDraft}
                style={{ opacity: isDraft ? 1 : 0.7, cursor: isDraft ? 'text' : 'not-allowed' }}
                placeholder="Введите описание заявки..."
              />
            </div>

            <div className="action-buttons">
              {/* Для модератора в сформированной заявке */}
              {isModerator && isFormed && (
                <>
                  <button className="save-button" onClick={handleSaveData}>
                    <img src="/ArtFront/images/save.png" alt="" style={{ width: '20px', height: '20px' }} />
                    Сохранить данные
                  </button>

                  <button
                    className="resolve-button"
                    onClick={handleCompleteRequest}
                  >
                    <img src="/ArtFront/images/resolve.png" alt="" style={{ width: '20px', height: '20px' }} />
                    Завершить обработку
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Эксперты */}
          <section className="basket-grid">
            {expertLinks.map((link: HandlerDTORespCenterRequestExpert, index) => {
              const expert =
                link.id_artcenter != null
                  ? expertsById[link.id_artcenter]
                  : undefined;

              return (
                <div key={index} className="basket-card">
                  <div className="basket-card__image">
                    {expert?.img_url ? (
                      <img src={expert.img_url} alt="" />
                    ) : (
                      <div className="basket-card__placeholder">—</div>
                    )}
                  </div>

                  <div className="basket-card__info">
                    <div className="expert-algorithm">
                      <span className="value">
                        {expert?.algorithm ?? '—'}
                      </span>
                    </div>

                    <div className="expert-coordinates-with-actions">
                      <div className="expert-coordinates">
                        <div>
                          <label>X</label>
                          <input
                            type="number"
                            step="any"
                            inputMode="decimal"
                            value={link.center_x === null || link.center_x === undefined ? '' : link.center_x}
                            onChange={(e) => {
                              const v = e.target.value;
                              console.log('X onChange: index =', index, ', value =', v);
                              dispatch({
                                type: 'request/updateExpertLink',
                                payload: {
                                  index,
                                  field: 'center_x',
                                  value: v === '' ? null : Number(v),
                                },
                              });
                            }}
                            disabled={!isDraft && !(isModerator && isFormed)}
                          />
                        </div>

                        <div>
                          <label>Y</label>
                          <input
                            type="number"
                            step="any"
                            inputMode="decimal"
                            value={link.center_y === null || link.center_y === undefined ? '' : link.center_y}
                            onChange={(e) => {
                              const v = e.target.value;
                              dispatch({
                                type: 'request/updateExpertLink',
                                payload: {
                                  index,
                                  field: 'center_y',
                                  value: v === '' ? null : Number(v),
                                },
                              });
                            }}
                            disabled={!isDraft && !(isModerator && isFormed)}
                          />
                        </div>
                      </div>

                      {(isDraft || (isModerator && isFormed)) && (
                        <div className="expert-actions">
                          <button
                            className="expert-save-btn"
                            onClick={() => handleSaveData()}
                            disabled={link.center_x === null || link.center_x === undefined || link.center_y === null || link.center_y === undefined}
                          >
                            Сохранить координаты
                          </button>
                        </div>
                      )}
                    </div>

                    {isDraft && (
                      <button
                        className="basket-remove-btn"
                        onClick={() =>
                          link.id_artcenter &&
                          dispatch(
                            removeExpertFromRequest({
                              requestId: requestId!,
                              expertId: link.id_artcenter,
                            })
                          )
                        }
                      >
                        <img
                          src="/ArtFront/images/bin.png"
                          alt="Удалить"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </section>

          {/* Нижняя панель действий */}
          <div className="request-footer">
            {isDraft && (
              <>
                <button
                  className="form-button"
                  onClick={handleFormRequest}
                  disabled={expertLinks.length === 0}
                >
                  Оформить заявку
                </button>

                <button
                  className="request-delete-button"
                  onClick={() => {
                    if (!requestId) return;
                    if (!confirm('Удалить заявку? Это действие нельзя отменить.')) return;
                    dispatch(deleteRequest(requestId))
                      .unwrap()
                      .then(() => {
                        navigate('/experts');
                      });
                  }}
                >
                  <Trash size={16} />
                  Удалить заявку
                </button>
              </>
            )}

            {/* Для завершённых заявок - кнопка просмотра результатов */}
            {isCompleted && (
              <button
                className="form-button"
                onClick={() => setShowResultModal(true)}
              >
                Показать результаты
              </button>
            )}

            {/* Кнопка "Сохранить описание" для черновиков */}
            {isDraft && (
              <button
                className="save-description-button"
                onClick={handleSaveDescription}
                disabled={!(currentRequest.description ?? '').trim()}
              >
                <img src="/ArtFront/images/save.png" alt="" style={{ width: '20px', height: '20px' }} />
                Сохранить описание
              </button>
            )}
          </div>

          {/* Модальное окно с результатом */}
          {showResultModal && isCompleted && (
            <div className="result-modal-overlay" onClick={() => setShowResultModal(false)}>
              <div className="result-modal" onClick={(e) => e.stopPropagation()}>
                <div className="result-modal-header">
                  <h2>Результаты анализа</h2>
                  <button className="modal-close-btn" onClick={() => setShowResultModal(false)}>
                    ×
                  </button>
                </div>

                <div className="result-modal-content">
                  <div className="result-section">
                    <h3>Композиционный центр</h3>
                    <div className="result-coordinates">
                      <div className="result-coord">
                        <span className="coord-label">X:</span>
                        <span className="coord-value">{currentRequest.factor_x?.toFixed(2) ?? '—'}</span>
                      </div>
                      <div className="result-coord">
                        <span className="coord-label">Y:</span>
                        <span className="coord-value">{currentRequest.factor_y?.toFixed(2) ?? '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>Данные экспертов</h3>
                    <div className="result-experts-list">
                      {expertLinks.map((link, index) => {
                        const expert = link.id_artcenter != null ? expertsById[link.id_artcenter] : undefined;
                        return (
                          <div key={index} className="result-expert-item">
                            <div className="result-expert-name">{expert?.title ?? '—'}</div>
                            <div className="result-expert-coords">
                              X: {link.center_x?.toFixed(2) ?? '—'}, 
                              Y: {link.center_y?.toFixed(2) ?? '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>Информация о заявке</h3>
                    <div className="result-info">
                      <p><strong>Создана:</strong> {currentRequest.date_created ? new Date(currentRequest.date_created).toLocaleString('ru-RU') : '—'}</p>
                      <p><strong>Завершена:</strong> {currentRequest.date_conclusion ? new Date(currentRequest.date_conclusion).toLocaleString('ru-RU') : '—'}</p>
                      <p><strong>Описание:</strong> {currentRequest.description || 'Нет описания'}</p>
                    </div>
                  </div>
                </div>

                <div className="result-modal-footer">
                  <button className="modal-ok-btn" onClick={() => setShowResultModal(false)}>
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default RequestPage;
