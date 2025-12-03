import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button } from 'react-bootstrap';
import { getArtExpertById } from '../api/expertsApi';
import type { IArtExpert } from '../types/types';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { AppNavbar } from '../components/Navbar';
import './styles/ExpertProp.css';

export const ExpertProp = () => {
    const { id } = useParams<{ id: string }>();
    const [expert, setExpert] = useState<IArtExpert | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getArtExpertById(id)
                .then(data => setExpert(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="expert-prop-body">
                <AppNavbar />
                <div className="expert-prop-loading">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                </div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="expert-prop-body">
                <AppNavbar />
                <Container className="expert-prop-not-found">
                    <h2>Эксперт не найден</h2>
                    <Link to="/experts">
                        <Button variant="outline-primary" className="mt-3">Вернуться к списку экспертов</Button>
                    </Link>
                </Container>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Эксперты', path: '/experts' },
        { label: expert.title, active: true },
    ];

    return (
        <div className="expert-prop-body">
            <AppNavbar />
            <div className="expert-prop-start-text">Подробнее об эксперте</div>
            <Container className="expert-prop-card">
                <CustomBreadcrumbs crumbs={breadcrumbs} />
                <Row className="expert-prop-card-row">
                    <Col lg={5} className="mb-4">
                        <div className="expert-prop-crd-img">
                            <img
                                src={expert.img_url || 'http://127.0.0.1:9000/art-center/imageError.gif'}
                                alt={expert.title}
                                className="expert-prop-crd-img-inner"
                            />
                        </div>
                    </Col>
                    <Col lg={7}>
                        <h2 className="expert-prop-crd-ttl">{expert.title}</h2>
                        <p className="expert-prop-crd-name"><strong>Эксперт:</strong> {expert.name}</p>
                        <p className="expert-prop-crd-alg"><strong>Алгоритм:</strong> {expert.algorithm}</p>
                        {expert.description && (
                            <div className="expert-prop-crd-dscr">
                                <p>{expert.description}</p>
                            </div>
                        )}

                        <div className="expert-prop-actions mt-4">
                            {/* <form
                                method="POST"
                                action={`/analysis_order/add/expert/${expert.ID_artcenter}`}
                            >
                                <button type="submit" className="card-button-add w-100 mb-2">
                                    Добавить в заявку
                                </button>
                            </form>

                            <Link to="/experts" className="d-block">
                                <button className="card-button-back w-100">
                                    Назад к списку экспертов
                                </button>
                            </Link> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
