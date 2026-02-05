import { useState, useRef, useEffect } from 'react';
import { Carousel, Button } from 'react-bootstrap';
import type { IExpertMedia } from '../types/types';
import './styles/MediaCarousel.css';

interface MediaCarouselProps {
    media: IExpertMedia[];
    fallbackImage?: string;
    expertTitle?: string;
    onDeleteMedia?: (mediaId: number) => void;
    canDelete?: boolean;
}

export const MediaCarousel = ({
    media,
    fallbackImage = '/ArtFront/images/imageError.gif',
    expertTitle = 'Эксперт',
    onDeleteMedia,
    canDelete = false
}: MediaCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Сортировка по id_media
    const sortedMedia = [...media].sort((a, b) => a.id_media - b.id_media);

    // Автовоспроизведение видео при смене слайда
    useEffect(() => {
        // Останавливаем все видео
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === activeIndex) {
                    video.play().catch(() => {
                        // Autoplay может быть заблокирован браузером
                    });
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }, [activeIndex]);

    const handleSelect = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    const handleDelete = (e: React.MouseEvent, mediaId: number) => {
        e.stopPropagation();
        if (onDeleteMedia) {
            onDeleteMedia(mediaId);
        }
    };

    // Если нет медиа, показываем fallback изображение
    if (sortedMedia.length === 0) {
        return (
            <div className="media-carousel-container">
                <div className="media-carousel-single">
                    <img
                        src={fallbackImage}
                        alt={expertTitle}
                        className="media-carousel-img"
                    />
                </div>
            </div>
        );
    }

    // Если только один элемент, показываем без карусели
    if (sortedMedia.length === 1) {
        const item = sortedMedia[0];
        return (
            <div className="media-carousel-container">
                <div className="media-carousel-single">
                    {item.media_type === 'video' ? (
                        <video
                            ref={(el) => { videoRefs.current[0] = el; }}
                            src={item.media_url}
                            className="media-carousel-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <img
                            src={item.media_url}
                            alt={`${expertTitle} - 1`}
                            className="media-carousel-img"
                        />
                    )}
                    {canDelete && onDeleteMedia && (
                        <Button
                            variant="danger"
                            size="sm"
                            className="media-carousel-delete-btn"
                            onClick={(e) => handleDelete(e, item.id_media)}
                            title="Удалить медиафайл"
                        >
                            ✕
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="media-carousel-container">
            <Carousel
                activeIndex={activeIndex}
                onSelect={handleSelect}
                interval={null}
                indicators={true}
                controls={true}
                className="media-carousel"
            >
                {sortedMedia.map((item, index) => (
                    <Carousel.Item key={item.id_media}>
                        <div className="media-carousel-item">
                            {item.media_type === 'video' ? (
                                <video
                                    ref={(el) => { videoRefs.current[index] = el; }}
                                    src={item.media_url}
                                    className="media-carousel-video"
                                    autoPlay={index === activeIndex}
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.media_url}
                                    alt={`${expertTitle} - ${index + 1}`}
                                    className="media-carousel-img"
                                />
                            )}
                            {canDelete && onDeleteMedia && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="media-carousel-delete-btn"
                                    onClick={(e) => handleDelete(e, item.id_media)}
                                    title="Удалить медиафайл"
                                >
                                    ✕
                                </Button>
                            )}
                            <div className="media-carousel-counter">
                                {index + 1} / {sortedMedia.length}
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};
