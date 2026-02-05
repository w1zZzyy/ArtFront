import React, { useEffect, useState, useMemo } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Funnel, Calendar, Lightning, CheckCircle, XCircle } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import { fetchRequestsList, resolveRequest, startAsyncAnalysis } from '../store/requestSlice';
import './styles/RequestsList.css';

// Статусы заявок (русские значения для бэкенда)
const STATUS_DRAFT = 'черновик';
const STATUS_FORMED = 'сформирован';
const STATUS_COMPLETED = 'завершён';
const STATUS_REJECTED = 'отклонён';

// Получаем сегодняшнюю дату в формате DD.MM.YYYY для отображения
const getTodayDateRu = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
};

// Конвертация DD.MM.YYYY в YYYY-MM-DD для API
const convertToApiDate = (dateRu: string) => {
  if (!dateRu) return '';
  const parts = dateRu.split('.');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

// Форматирование даты (уже в формате DD.MM.YYYY)
const formatDateRu = (dateStr: string) => {
  return dateStr || '';
};

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case STATUS_DRAFT:
      return <Badge bg="secondary">Черновик</Badge>;
    case STATUS_FORMED:
      return <Badge bg="primary">Сформирована</Badge>;
    case STATUS_COMPLETED:
      return <Badge bg="success">Завершена</Badge>;
    case STATUS_REJECTED:
      return <Badge bg="danger">Отклонена</Badge>;
    default:
      return <Badge bg="light" text="dark">Неизвестно</Badge>;
  }
};

export const RequestsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const { list, loading } = useSelector((state: RootState) => state.request);

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
  const userObj = storedUser ? JSON.parse(storedUser) : null;
  const isModerator = !!userObj?.is_admin;

  const isFormedStatus = (status: string | undefined) => {
    return status === STATUS_FORMED;
  };

  // Фильтры (по умолчанию "за сегодня")
  const todayStr = getTodayDateRu();
  const [filters, setFilters] = useState({
    status: 'all',
    from: todayStr,
    to: todayStr,
  });

  const buildApiFilters = () => {
    const apiFilters: any = {};
    if (filters.status !== 'all') apiFilters.status = filters.status;
    if (filters.from) apiFilters.from = convertToApiDate(filters.from) + 'T00:00:00';
    if (filters.to) apiFilters.to = convertToApiDate(filters.to) + 'T23:59:59';
    return apiFilters;
  };

  // Загрузка списка заявок
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const loadRequests = () => {
      dispatch(fetchRequestsList(buildApiFilters()));
    };

    loadRequests();
    const intervalId = setInterval(loadRequests, 10000); // Обновление каждые 10 сек
    return () => clearInterval(intervalId);
  }, [isAuth, navigate, filters, dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRowClick = (id: number | undefined) => {
    if (id) navigate(`/center_request/${id}`);
  };

  return (
    <div className="requests-list-wrapper">
      <AppNavbar />
      <Container fluid className="requests-list-container pt-5 mt-5 px-4">
        <h2 className="fw-bold mb-4 text-center requests-list-title">
          {isModerator ? 'Заявки пользователей (модератор)' : 'История заявок на анализ'}
        </h2>

        <Row>
          <Col lg={12}>
            {/* Панель фильтров */}
            <Card className="mb-4 border-0 shadow-sm requests-filter-card">
              <Card.Body>
                <Row className="g-3 align-items-end">
                  <Col md={4}>
                    <Form.Label className="fw-bold small text-muted">
                      <Funnel size={14} /> Статус
                    </Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      size="sm"
                    >
                      <option value="all">Все статусы</option>
                      <option value={STATUS_DRAFT}>Черновик</option>
                      <option value={STATUS_FORMED}>Сформирована</option>
                      <option value={STATUS_COMPLETED}>Завершена</option>
                      <option value={STATUS_REJECTED}>Отклонена</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold small text-muted">
                      <Calendar size={14} /> Дата от
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="from"
                      value={filters.from}
                      onChange={handleFilterChange}
                      size="sm"
                      placeholder="ДД.ММ.ГГГГ"
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold small text-muted">
                      <Calendar size={14} /> Дата до
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="to"
                      value={filters.to}
                      onChange={handleFilterChange}
                      size="sm"
                      placeholder="ДД.ММ.ГГГГ"
                    />
                  </Col>
                  <Col md={2} className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => setFilters({ status: 'all', from: getTodayDateRu(), to: getTodayDateRu() })}
                    >
                      Сегодня
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setFilters({ status: 'all', from: '', to: '' })}
                    >
                      Все
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Таблица заявок */}
            {loading && (!list || list.length === 0) ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="dark" />
                <p className="mt-3 text-muted">Загрузка заявок...</p>
              </div>
            ) : (
              <div className="table-responsive shadow-sm rounded requests-table-container">
                <Table hover className="align-middle mb-0 requests-table">
                  <thead className="requests-table-head">
                    <tr>
                      <th>ID</th>
                      <th>Описание</th>
                      <th>Статус</th>
                      <th>Дата создания</th>
                      <th>Дата формирования</th>
                      <th>Результат (X / Y)</th>
                      <th>Анализ</th>
                      {isModerator && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {list && list.length > 0 ? (
                      list.map(request => (
                        <tr
                          key={request.id_request}
                          onClick={() => handleRowClick(request.id_request)}
                          className="requests-table-row"
                        >
                          <td className="fw-bold">#{request.id_request}</td>
                          <td className="text-truncate" style={{ maxWidth: '300px' }}>
                            {request.description || 'Без описания'}
                          </td>
                          <td>{getStatusBadge(request.request_status)}</td>
                          <td className="small">
                            {request.date_created
                              ? new Date(request.date_created).toLocaleDateString('ru-RU')
                              : '-'}
                          </td>
                          <td className="small">
                            {request.date_formed && new Date(request.date_formed).getFullYear() > 1900
                              ? new Date(request.date_formed).toLocaleDateString('ru-RU')
                              : '-'}
                          </td>
                          <td>
                            {request.factor_x && request.factor_y ? (
                              <span className="fw-bold text-success">
                                {request.factor_x.toFixed(3)} / {request.factor_y.toFixed(3)}
                              </span>
                            ) : (
                              <span className="text-muted small">--</span>
                            )}
                          </td>
                          <td>
                            {/* Результат асинхронного анализа */}
                            {(request as any).analysis_result ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>
                                    {(request as any).analysis_result}
                                    {(request as any).confidence_score && (
                                      <div>Уверенность: {((request as any).confidence_score * 100).toFixed(1)}%</div>
                                    )}
                                  </Tooltip>
                                }
                              >
                                <span>
                                  {(request as any).analysis_success ? (
                                    <Badge bg="success" className="d-flex align-items-center gap-1">
                                      <CheckCircle size={12} /> Готов
                                    </Badge>
                                  ) : (
                                    <Badge bg="warning" className="d-flex align-items-center gap-1">
                                      <XCircle size={12} /> Ошибка
                                    </Badge>
                                  )}
                                </span>
                              </OverlayTrigger>
                            ) : isModerator && ['сформирован', 'завершён', 'formed', 'completed'].includes((request as any).request_status) ? (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!request.id_request) return;
                                  dispatch(startAsyncAnalysis(request.id_request))
                                    .unwrap()
                                    .then(() => {
                                      alert('Анализ запущен! Результат появится через 5-10 секунд.');
                                    })
                                    .catch(() => {
                                      alert('Не удалось запустить анализ');
                                    });
                                }}
                              >
                                <Lightning size={14} /> Анализ
                              </Button>
                            ) : (
                              <span className="text-muted small">—</span>
                            )}
                          </td>
                          {isModerator && (
                            <td>
                              {isFormedStatus(request.request_status) ? (
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!request.id_request) return;
                                      if (!confirm('Подтвердить заявку и завершить обработку?')) return;
                                      dispatch(
                                        resolveRequest({ id: request.id_request, action: 'complete' })
                                      )
                                        .unwrap()
                                        .then(() => {
                                          dispatch(fetchRequestsList(buildApiFilters()));
                                        })
                                        .catch(() => {
                                          alert('Не удалось подтвердить заявку');
                                        });
                                    }}
                                  >
                                    Подтвердить
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!request.id_request) return;
                                      if (!confirm('Отклонить заявку?')) return;
                                      dispatch(
                                        resolveRequest({ id: request.id_request, action: 'reject' })
                                      )
                                        .unwrap()
                                        .then(() => {
                                          dispatch(fetchRequestsList(buildApiFilters()));
                                        })
                                        .catch(() => {
                                          alert('Не удалось отклонить заявку');
                                        });
                                    }}
                                  >
                                    Отклонить
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-muted small">—</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isModerator ? 8 : 7} className="text-center py-5 text-muted">
                          Заявок не найдено
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
