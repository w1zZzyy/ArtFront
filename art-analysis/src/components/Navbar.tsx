import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logoutThunk } from '../store/authSlice';

export const AppNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  return (
    <Navbar bg="light" variant="light" fixed="top" className="shadow-sm border-bottom">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/ArtAnalysis" className="fs-4">
          ArtAnalysis
        </Navbar.Brand>

        <div className="me-auto">
          <Link to="/experts" className="fs-5 text-dark text-decoration-none">
            Experts
          </Link>
        </div>

        {/* AUTH BLOCK */}
        <div className="d-flex align-items-center gap-3">
          {isAuth ? (
            <>
              <span className="fw-semibold">{user?.login}</span>
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => dispatch(logoutThunk())}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-dark btn-sm">
                Войти
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-sm">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};