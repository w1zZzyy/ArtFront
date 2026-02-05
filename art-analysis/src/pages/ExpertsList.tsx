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
import { getArtExperts } from '../api/expertsApi';
import type { IArtExpert } from '../types/types';
import { MOCK_ART_EXPERTS } from '../api/mock';
import './styles/ExpertsList.css';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setSearchTerm, selectSearchTerm } from '../store/filterSlice';
import { fetchCurrentDraftRequest } from '../store/requestSlice';

export const ExpertsList = () => {
  const [experts, setExperts] = useState<IArtExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const USE_MOCK = false;

  const searchTerm = useSelector((state: RootState) => selectSearchTerm(state));
  const currentRequest = useSelector((state: RootState) => state.request.currentRequest);
  const dispatch = useDispatch<AppDispatch>();

  // Вычисляем данные для корзины из Redux store
  // Статус может быть "draft" или "черновик" (на русском в БД)
  const draftTask = currentRequest && (currentRequest.request_status === 'draft' || currentRequest.request_status === 'черновик') ? {
    id_request: currentRequest.id_request,
    experts_count: currentRequest.experts?.length ?? 0,
  } : null;

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

  useEffect(() => {
    fetchExperts();
    // Загружаем текущий черновик через Redux
    dispatch(fetchCurrentDraftRequest());
  }, [searchTerm, dispatch]);

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
      <AppNavbar />
      
      {/* Sticky header with search and cart */}
      <div className="experts-sticky-header">
        <Container fluid className="px-3 px-md-4">
          <h1 className="experts-s-t">Выберите эксперта</h1>

          <Form onSubmit={handleSearchSubmit}>
            <Row className="experts-s-f align-items-center">
              <Col xs={12}>
                <div className="d-flex align-items-center w-100">
                  <div className="d-flex flex-grow-1" style={{ marginRight: '10px' }}>
                    <Form.Control
                      type="search"
                      placeholder="Введите имя эксперта"
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      className="flex-grow-1"
                      style={{ 
                        borderRadius: '8px 0 0 8px',
                        border: '2px solid #e1e5eb',
                        borderRight: 'none'
                      }}
                    />
                    <Button
                      variant="dark"
                      type="submit"
                      disabled={loading}
                      style={{ 
                        borderRadius: '0 8px 8px 0',
                        border: '2px solid #000000',
                        borderLeft: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {loading ? 'Поиск...' : 'Найти'}
                    </Button>
                  </div>

                  <div className="cart-wrapper">
                    {draftTask?.experts_count && draftTask.experts_count > 0 ? (
                      <Link to={`/request/${draftTask.id_request}`} className="d-flex align-items-center position-relative">
                        <Image
                          src="/ArtFront/images/cart.png"
                          alt="Корзина"
                          className="d-none d-md-block"
                          width={50}
                          height={50}
                        />
                        <Image
                          src="/ArtFront/images/cart.png"
                          alt="Корзина"
                          className="d-md-none"
                          width={40}
                          height={40}
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
                          className="d-none d-md-block"
                          width={50}
                          height={50}
                          style={{ opacity: 0.5 }}
                        />
                        <Image
                          src="/ArtFront/images/cart.png"
                          alt="Корзина"
                          className="d-md-none"
                          width={40}
                          height={40}
                          style={{ opacity: 0.5 }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container fluid className="px-3 px-md-4 experts-cards-container">
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="experts-templ">
            <Col xs={12}>
              <Row className="g-4">
                {filteredExperts.map(expert => (
                  <Col key={expert.id_artcenter} xs={12} sm={12} md={6} lg={4} xl={4} xxl={4}>
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