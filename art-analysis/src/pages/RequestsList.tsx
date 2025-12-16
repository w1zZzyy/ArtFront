import { useEffect, useState, useMemo } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Funnel, Calendar } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import { AppNavbar } from '../components/Navbar';
import { fetchRequestsList } from '../store/requestSlice';
import './styles/RequestsList.css';

// Статусы заявок
const STATUS_DRAFT = 'draft';
const STATUS_FORMED = 'formed';
const STATUS_COMPLETED = 'completed';
const STATUS_REJECTED = 'rejected';

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

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { list, loading } = useSelector((state: RootState) => state.request);

  // Фильтры
  const [filters, setFilters] = useState({
    status: 'all',
    from: '',
    to: '',
  });

  // Загрузка списка заявок
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const loadRequests = () => {
      const apiFilters: any = {};
      if (filters.status !== 'all') apiFilters.status = filters.status;
      if (filters.from) apiFilters.from = filters.from;
      if (filters.to) apiFilters.to = filters.to;
      
      dispatch(fetchRequestsList(apiFilters));
    };

    loadRequests();
    const intervalId = setInterval(loadRequests, 10000); // Обновление каждые 10 сек
    return () => clearInterval(intervalId);
  }, [isAuth, navigate, filters, dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRowClick = (id: number | undefined) => {
    if (id) navigate(`/request/${id}`);
  };

  return (
    <div className="requests-list-wrapper">
      <AppNavbar />
      <Container fluid className="requests-list-container pt-5 mt-5 px-4">
        <h2 className="fw-bold mb-4 text-center requests-list-title">
          История заявок на анализ
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
                      type="date"
                      name="from"
                      value={filters.from}
                      onChange={handleFilterChange}
                      size="sm"
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="fw-bold small text-muted">
                      <Calendar size={14} /> Дата до
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="to"
                      value={filters.to}
                      onChange={handleFilterChange}
                      size="sm"
                    />
                  </Col>
                  <Col md={2} className="text-end">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => setFilters({ status: 'all', from: '', to: '' })}
                    >
                      Сбросить
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
                            {request.date_formed
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-5 text-muted">
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
