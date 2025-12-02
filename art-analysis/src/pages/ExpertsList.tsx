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
import { AppNavbar } from '../components/Navbar';
import { ExpertCard } from '../components/ExpertCard';
import { getArtExperts } from '../api/expertsApi';
import type { IArtExpert, DraftTaskInfo } from '../types/types';
import { MOCK_ART_EXPERTS } from '../api/mock';
import './styles/ExpertsList.css';

export const ExpertsList = () => {
  const [experts, setExperts] = useState<IArtExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draftTask, setDraftTask] = useState<DraftTaskInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const USE_MOCK = false; // true для mock-режима

  const fetchExperts = async (filterName: string = '') => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const filtered = MOCK_ART_EXPERTS.filter(expert =>
          expert.Title.toLowerCase().includes(filterName.toLowerCase())
        );
        setExperts(filtered);
      } else {
        const data = await getArtExperts(filterName);
        setExperts(Array.isArray(data) ? data : []);
      }
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

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchExperts(searchTerm);
  };

  const handleAddToTask = async (expertId: number) => {
    if (!draftTask || draftTask.ID_task === 0) {
      alert('Сначала создайте черновик задачи!');
      return;
    }
    try {
      console.log(`Добавление эксперта ${expertId} в задачу ${draftTask.ID_task}`);
      setDraftTask(prev => prev ? { ...prev, ExpertsCount: (prev.ExpertsCount || 0) + 1 } : null);
    } catch (err) {
      console.error('Ошибка добавления эксперта:', err);
    }
  };

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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  {draftTask?.ExpertsCount && draftTask.ExpertsCount > 0 ? (
                    <a href={`/center_request/${draftTask.ID_task}`} className="d-flex align-items-center">
                      <Image
                        src="http://127.0.0.1:9000/art-center/basket.png"
                        alt="Корзина"
                        width={60}
                        height={60}
                      />
                    </a>
                  ) : (
                    <span style={{ cursor: 'not-allowed' }} className="d-flex align-items-center">
                      <Image
                        src="http://127.0.0.1:9000/art-center/basket.png"
                        alt="Корзина"
                        width={60}
                        height={60}
                        style={{ opacity: 0.5 }}
                      />
                    </span>
                  )}
                  {draftTask?.ExpertsCount !== undefined && draftTask.ExpertsCount > 0 && (
                    <Badge pill bg="secondary" className="cart-indicator">
                      {draftTask.ExpertsCount}
                    </Badge>
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
                {experts.map(expert => (
                  <Col key={expert.ID_artcenter}>
                    <ExpertCard expert={expert} showExtra={false} showDetails={true}/>
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
