import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/StartPage';
import { ExpertsList } from './pages/ExpertsList';
import { ExpertProp } from './pages/ExpertProp';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RequestPage } from './pages/RequestPage';

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
        <BrowserRouter basename="/ArtFront"> 
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ArtAnalysis" element={<HomePage />} />
                <Route path="/experts" element={<ExpertsList />} />
                <Route path="/request/:id" element={<RequestPage />} />
                <Route path="/expert_properties/:id" element={<ExpertProp />} />
                <Route element={<MainLayout />}>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;