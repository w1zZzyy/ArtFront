import { useState } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AppNavbar = () => {
  const [value1, setValue1] = useState(3);
  const [value2, setValue2] = useState(3);

  const handleIncrement1 = () => {
    if (value1 + value2 < 10) {
      setValue1(value1 + 1);
    } else if (value2 > 0) {
      setValue2(value2 - 1);
      setValue1(value1 + 1);
    }
  };

  const handleIncrement2 = () => {
    if (value1 + value2 < 10) {
      setValue2(value2 + 1);
    } else if (value1 > 0) {
      setValue1(value1 - 1);
      setValue2(value2 + 1);
    }
  };

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

        {/* Кнопки с числами */}
        <div className="d-flex gap-3 align-items-center">
          <Button 
            variant="primary" 
            onClick={handleIncrement1}
          >
            Число 1: {value1}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleIncrement2}
          >
            Число 2: {value2}
          </Button>
          <span className="text-muted">Сумма: {value1 + value2}/10</span>
        </div>
      </Container>
    </Navbar>
  );
};