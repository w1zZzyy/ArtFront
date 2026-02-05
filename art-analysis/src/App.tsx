import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/StartPage';
import { ExpertsList } from './pages/ExpertsList';
import { ExpertProp } from './pages/ExpertProp';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserPage } from './pages/UserPage';
import { RequestsList } from './pages/RequestsList';
import RequestPage from './pages/RequestPage';
import { getMeThunk } from './store/authSlice';
import type { RootState, AppDispatch } from './store';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

// Компонент инициализации авторизации
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { token, isAuth } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // При загрузке приложения, если есть токен, проверяем его и получаем данные пользователя
        const storedToken = localStorage.getItem('authToken');
        if (storedToken && isAuth) {
            console.log('AuthInitializer: Token found, validating session...');
            dispatch(getMeThunk());
        }
    }, []); // Выполняется один раз при монтировании

    return <>{children}</>;
};

function App() {
    return (
        <AuthInitializer>
            <BrowserRouter basename="/ArtFront"> 
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ArtAnalysis" element={<HomePage />} />
                    <Route path="/experts" element={<ExpertsList />} />
                    <Route path="/center_request/:id" element={<RequestPage />} />
                    <Route path="/request/:id" element={<RequestPage />} />
                    <Route path="/expert_properties/:id" element={<ExpertProp />} />
                    <Route path="/profile" element={<UserPage />} />
                    <Route path="/center_requests" element={<RequestsList />} />
                    <Route path="/requests" element={<RequestsList />} />
                    <Route element={<MainLayout />}>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthInitializer>
    );
}

export default App;