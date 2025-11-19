import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AppNavbar = () => {
  return (
    <Navbar bg="light" variant="light" fixed="top" className="shadow-sm border-bottom">
      <Container fluid className="px-4">
        {/* Единый бренд как ссылка */}
        <Navbar.Brand as={Link} to="/ArtAnalysis" className="fs-4">
          ArtAnalysis
        </Navbar.Brand>

        {/* Отдельная навигация */}
        <div className="me-auto">
          <Link to="/experts" className="fs-5 text-dark text-decoration-none">
            Experts
          </Link>
        </div>
      </Container>
    </Navbar>
  );
};