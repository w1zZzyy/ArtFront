import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
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
        <HashRouter> 
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ArtAnalysis" element={<HomePage />} />
                <Route path="/experts" element={<ExpertsList />} />
                <Route path="/expert_properties/:id" element={<ExpertProp />} />
                <Route element={<MainLayout />}>
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;