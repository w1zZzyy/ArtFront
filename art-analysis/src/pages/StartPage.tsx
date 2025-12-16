// src/pages/HomePage.tsx
import { AppNavbar } from '../components/Navbar';
import { Carousel } from 'react-bootstrap';
import './styles/StartPage.css';

export const HomePage = () => {
    const artworks = [
        { src: '/ArtFront/images/abstract_1.jpg', title: 'Композиция 1', description: 'Анализ линий и форм' },
        { src: '/ArtFront/images/abstract_2.jpg', title: 'Композиция 2', description: 'Цветовой баланс' },
        { src: '/ArtFront/images/abstract_3.jpg', title: 'Композиция 3', description: 'Перспектива и глубина' },
        { src: '/ArtFront/images/abstract_4.jpg', title: 'Композиция 4', description: 'Ритм и движение' },
        { src: '/ArtFront/images/abstract_5.jpg', title: 'Композиция 5', description: 'Контраст и гармония' },
        { src: '/ArtFront/images/abstract_6.jpg', title: 'Композиция 6', description: 'Фокус внимания' },
    ];

    return (
        <div className="homepage-wrapper">
            <AppNavbar />

            <div className="home-page-body">
                <div className="home-page-container">
                    <div className="home-page-content">
                        <h1 className="home-page-title">
                            Анализ композиционного центра на произведении искусства
                        </h1>
                        <p className="home-page-lead">
                            Инструменты и эксперты для изучения замысла художника через композицию
                        </p>
                    </div>

                    <div className="carousel-content">
                        <Carousel interval={3000} pause="hover">
                            {artworks.map((artwork, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block carousel-image"
                                        src={artwork.src}
                                        alt={artwork.title}
                                    />
                                    <Carousel.Caption className="carousel-caption-custom">
                                        <h3>{artwork.title}</h3>
                                        <p>{artwork.description}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};
