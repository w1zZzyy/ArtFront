import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button, Form } from 'react-bootstrap';
import { getArtExpertById, deleteExpertMedia, uploadExpertMedia } from '../api/expertsApi';
import type { IArtExpert } from '../types/types';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { AppNavbar } from '../components/Navbar';
import { MediaCarousel } from '../components/MediaCarousel';
import './styles/ExpertProp.css';

export const ExpertProp = () => {
    const { id } = useParams<{ id: string }>();
    const [expert, setExpert] = useState<IArtExpert | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Проверяем, является ли пользователь модератором (можно расширить логику)
    const [isModerator, setIsModerator] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        // Проверяем роль пользователя из localStorage
        const checkModerator = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const userStr = localStorage.getItem('userInfo');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        setIsModerator(user.is_admin === true);
                    }
                } catch {
                    setIsModerator(false);
                }
            }
        };
        checkModerator();
    }, []);

    const loadExpert = () => {
        if (id) {
            setLoading(true);
            getArtExpertById(id)
                .then(data => setExpert(data))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        loadExpert();
    }, [id]);

    const handleDeleteMedia = async (mediaId: number) => {
        if (!id || !expert) return;
        
        const confirmed = window.confirm('Вы уверены, что хотите удалить этот медиафайл?');
        if (!confirmed) return;
        
        const success = await deleteExpertMedia(id, mediaId);
        if (success) {
            // Обновляем локальное состояние
            setExpert(prev => {
                if (!prev || !prev.media) return prev;
                return {
                    ...prev,
                    media: prev.media.filter(m => m.id_media !== mediaId)
                };
            });
        } else {
            alert('Ошибка при удалении медиафайла');
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!id || !e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        setUploading(true);
        
        try {
            const newMedia = await uploadExpertMedia(id, file);
            if (newMedia) {
                // Добавляем новый медиафайл в состояние
                setExpert(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        media: [...(prev.media || []), newMedia]
                    };
                });
            } else {
                alert('Ошибка при загрузке файла');
            }
        } catch (error) {
            alert('Ошибка при загрузке файла');
        } finally {
            setUploading(false);
            // Сбрасываем input для возможности повторной загрузки того же файла
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

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
                        <MediaCarousel
                            media={expert.media || []}
                            fallbackImage={expert.img_url || '/ArtFront/images/imageError.gif'}
                            expertTitle={expert.title}
                            onDeleteMedia={handleDeleteMedia}
                            canDelete={isModerator}
                        />
                        
                        {/* Форма загрузки медиа для модератора */}
                        {isModerator && (
                            <div className="mt-3">
                                <Form.Control
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*,video/*"
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="outline-primary"
                                    className="w-100"
                                    onClick={handleUploadClick}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Загрузка...
                                        </>
                                    ) : (
                                        '📎 Добавить фото/видео'
                                    )}
                                </Button>
                            </div>
                        )}
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
                                action={`/center_request/add/expert/${expert.ID_artcenter}`}
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
