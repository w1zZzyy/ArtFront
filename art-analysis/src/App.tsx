import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/StartPage';
import { ExpertsList } from './pages/ExpertsList';
import { ExpertProp } from './pages/ExpertProp';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* redirect root to /ArtAnalysis for compatibility */}
                <Route path="/" element={<Navigate to="/ArtAnalysis" replace />} />
                <Route path="/ArtAnalysis" element={<HomePage />} />
                <Route path="/experts" element={<ExpertsList />} />
                <Route path="/expert_properties/:id" element={<ExpertProp />} />
                <Route element={<MainLayout />}>
                </Route>
                <Route path="*" element={<div style={{ padding: 20 }}>Страница не найдена. Перейдите на <a href="/ArtAnalysis">Главную</a> или <a href="/experts">Список услуг</a>.</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
/*
<Route path="/factors" element={<FactorsListPage />} />
<Route path="/factors/:id" element={<FactorDetailPage />} />
*/