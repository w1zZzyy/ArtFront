import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash } from 'react-bootstrap-icons';
import './styles/RequestPage.css';
import { AppNavbar } from '../components/Navbar';

import {
  fetchCurrentDraftRequest,
  updateRequestDescription,
  deleteRequest,
  removeExpertFromRequest,
  formRequest,
  resetOperationSuccess,
  clearCurrentRequest,
} from '../store/requestSlice';

import type { AppDispatch, RootState } from '../store';
import type { ModelExpertsToRequest } from '../api/generated/api';

const RequestPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentRequest,
    loading,
    operationSuccess,
    expertsById,
  } = useSelector((state: RootState) => state.request);

  useEffect(() => {
    dispatch(fetchCurrentDraftRequest());

    return () => {
      dispatch(clearCurrentRequest());
      dispatch(resetOperationSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (operationSuccess) navigate('/');
  }, [operationSuccess, navigate]);

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

  const handleSaveDescription = () => {
    if (requestId) {
      dispatch(
        updateRequestDescription({
          id: requestId,
          description: currentRequest.description ?? '',
        })
      );
    }
  };

  const handleFormRequest = () => {
    if (requestId) {
      if (confirm('Сформировать заявку? Это действие нельзя отменить.')) {
        dispatch(formRequest(requestId));
      }
    }
  };

  return (
    <div className="request-body">
      <AppNavbar />

      <main className="order-page">
        <div className="order-container">

          {/* Описание + действия */}
          <div className="description-row">
            <div className="description">
              <div className="description-header">Описание</div>
              <div className="description-text">
                Добавьте описание задачи, чтобы не перепутать её с другими
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
                onBlur={handleSaveDescription}
              />
            </div>

            <div className="action-buttons">
              <button
                className="form-button"
                onClick={handleFormRequest}
              >
                Сформировать заявку
              </button>

              <button
                className="request-delete-button"
                onClick={() =>
                  requestId &&
                  confirm('Удалить заявку? Это действие нельзя отменить.') &&
                  dispatch(deleteRequest(requestId))
                }
              >
                <Trash size={16} />
                Удалить заявку
              </button>
            </div>
          </div>

          {/* Эксперты */}
          <section className="basket-grid">
            {expertLinks.map((link: ModelExpertsToRequest, index) => {
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

                    <div className="expert-coordinates">
                      <div>
                        <label>X</label>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          value={link.centerX === null ? '' : link.centerX}
                          onChange={(e) => {
                            const v = e.target.value;
                            dispatch({
                              type: 'request/updateExpertLink',
                              payload: {
                                index,
                                field: 'centerX',
                                value: v === '' ? null : Number(v),
                              },
                            });
                          }}
                        />
                      </div>

                      <div>
                        <label>Y</label>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          value={link.centerY === null ? '' : link.centerY}
                          onChange={(e) => {
                            const v = e.target.value;
                            dispatch({
                              type: 'request/updateExpertLink',
                              payload: {
                                index,
                                field: 'centerY',
                                value: v === '' ? null : Number(v),
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

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

                  </div>
                </div>
              );
            })}
          </section>

        </div>
      </main>
    </div>
  );
};

export default RequestPage;
