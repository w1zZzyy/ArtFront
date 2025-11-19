// src/pages/HomePage.tsx
import { AppNavbar } from '../components/Navbar';
import './styles/StartPage.css';

export const HomePage = () => {
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

                        {/* Действия можно подключить позже */}
                        {/*
                        <div className="home-page-actions">
                            <a href="/experts" className="home-page-btn primary">Выбрать эксперта</a>
                            <a href="/tasks" className="home-page-btn secondary">Мои задачи</a>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
};
