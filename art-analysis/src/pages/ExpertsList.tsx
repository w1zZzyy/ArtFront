// src/pages/ExpertsList.tsx
import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  Badge,
  Image,
  Button,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppNavbar } from '../components/Navbar';
import { ExpertCard } from '../components/ExpertCard';
import { getArtExperts, getDraftTaskInfo } from '../api/expertsApi';
import type { IArtExpert, DraftTaskInfo } from '../types/types';
import { MOCK_ART_EXPERTS } from '../api/mock';
import './styles/ExpertsList.css';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setSearchTerm, selectSearchTerm } from '../store/filterSlice';

export const ExpertsList = () => {
  const [experts, setExperts] = useState<IArtExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftTask, setDraftTask] = useState<DraftTaskInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const USE_MOCK = false;

  const searchTerm = useSelector((state: RootState) => selectSearchTerm(state));
  const dispatch = useDispatch<AppDispatch>();

  const fetchExperts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArtExperts(searchTerm);
      setExperts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки экспертов:', err);
      setError('Не удалось загрузить список экспертов');
      if (USE_MOCK) {
        setExperts(MOCK_ART_EXPERTS);
      } else {
        setExperts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Здесь можно вызывать API для получения текущего черновика
  const fetchDraftTask = async () => {
    try {
      const task = await getDraftTaskInfo();
      setDraftTask(task);
      console.info('Проверка загрузки задачи:', task.experts_count);
    } catch (err) {
      console.error('Ошибка загрузки черновика:', err);
      setDraftTask(null);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchDraftTask();
  }, [searchTerm]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchExperts();
  };

  const filteredExperts = experts
    .filter(expert =>
      expert.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) || 
      expert.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const term = searchTerm.toLowerCase();
      const aMatch = a.name.toLowerCase().startsWith(term) || a.algorithm.toLowerCase().startsWith(term);
      const bMatch = b.name.toLowerCase().startsWith(term) || b.algorithm.toLowerCase().startsWith(term);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

  return (
    <div className="experts-body">
      <Container fluid className="pt-4">
        <AppNavbar />
        <div>
          <h1 className="experts-s-t">Выберите эксперта</h1>
        </div>

        <Form onSubmit={handleSearchSubmit}>
          <Row className="experts-s-f">
            <Col xs={12}>
              <div className="d-flex align-items-center w-100">
                <Form.Control
                  type="search"
                  placeholder="Введите имя эксперта"
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="experts-s-f input flex-grow-1"
                />
                <Button
                  variant="dark"
                  type="submit"
                  disabled={loading}
                  className="experts-s-f button"
                  style={{ flexShrink: 0 }}
                >
                  {loading ? 'Поиск...' : 'Найти'}
                </Button>

                <div className="cart-wrapper">
                  {draftTask?.experts_count && draftTask.experts_count > 0 ? (
                    <Link to={`/request/${draftTask.id_request}`} className="d-flex align-items-center">
                      <Image
                        src="/ArtFront/images/cart.png"
                        alt="Корзина"
                        width={60}
                        height={60}
                      />
                      <Badge pill bg="secondary" className="cart-indicator">
                        {draftTask.experts_count}
                      </Badge>
                    </Link>
                  ) : (
                    <span style={{ cursor: 'not-allowed' }} className="d-flex align-items-center">
                      <Image
                        src="/ArtFront/images/cart.png"
                        alt="Корзина"
                        width={60}
                        height={60}
                        style={{ opacity: 0.5 }}
                      />
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="experts-templ">
            <Col xs={12}>
              <Row xs={1} md={2} lg={3} xxl={3} className="g-4">
                {filteredExperts.map(expert => (
                  <Col key={expert.id_artcenter}>
                    <ExpertCard expert={expert} showExtra={false}/>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};