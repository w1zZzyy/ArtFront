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
      <Container fluid className="px-2 px-md-4">
        <Navbar.Brand as={Link} to="/ArtAnalysis" className="fs-5 fs-md-4">
          ArtAnalysis
        </Navbar.Brand>

        <div className="me-auto d-none d-md-flex gap-4">
          <Link to="/experts" className="fs-5 text-dark text-decoration-none">
            Experts
          </Link>
          {isAuth && (
            <Link to="/requests" className="fs-5 text-dark text-decoration-none">
              History
            </Link>
          )}
        </div>

        {/* Мобильная навигация */}
        <div className="d-flex d-md-none gap-2 me-auto">
          <Link to="/experts" className="text-dark text-decoration-none" style={{ fontSize: '0.9rem' }}>
            Experts
          </Link>
          {isAuth && (
            <Link to="/requests" className="text-dark text-decoration-none" style={{ fontSize: '0.9rem' }}>
              History
            </Link>
          )}
        </div>

        {/* AUTH BLOCK */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {isAuth ? (
            <>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <img 
                  src="/ArtFront/images/profile.png" 
                  alt="Profile" 
                  className="d-none d-md-block"
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <img 
                  src="/ArtFront/images/profile.png" 
                  alt="Profile" 
                  className="d-md-none"
                  style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
              </Link>
              <span className="fw-semibold d-none d-md-inline" style={{ fontSize: '0.95rem' }}>{user?.login}</span>
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => dispatch(logoutThunk())}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                Войти
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-sm" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};