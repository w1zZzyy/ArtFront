// src/components/ExpertCard.tsx
import { Card } from 'react-bootstrap';
import type { IArtExpert } from '../types/types';
import './styles/ExpertCard.css';

interface ExpertCardProps {
  expert: IArtExpert;
}

export const ExpertCard = ({ expert }: ExpertCardProps) => {
  return (
    <Card className="expert-card h-100">
      <div className="expert-crd-cnt">
        {/* Текстовая часть */}
        <div className="expert-crd-txt">
          {/* Имя эксперта с бейджем в зависимости от статуса */}
          <div className="attributes">
            {expert.Status ? (
              <div className="attribute-editable">{expert.Name}</div>
            ) : (
              <div className="attribute-not-editable">{expert.Name}</div>
            )}
          </div>

          <h5 className="expert-crd-ttl">{expert.Title}</h5>
          <p className="expert-crd-dscr">{expert.Description}</p>
          <p className="expert-crd-alg">
            <strong>Алгоритм:</strong> {expert.Algorithm}
          </p>
        </div>

        {/* Изображение эксперта */}
        <div className="expert-crd-img">
          <img
            src={expert.Image || 'http://localhost:9000/art-center/imageError.gif'}
            alt={expert.Title}
            className="img-fluid"
          />
        </div>
      </div>

      {/* Футер карточки с кнопками */}
      <div className="expert-card__footer mt-3">
        <a
          href={`/expert/${expert.ID_artcenter}`}
          className="expert-btn-more d-block text-center"
        >
          Подробнее
        </a>

        <form
          method="POST"
          action={`/analysis_order/add/expert/${expert.ID_artcenter}`}
          className="mt-2"
        >
          <button type="submit" className="expert-btn-add w-100">
            Добавить в заявку
          </button>
        </form>
      </div>
    </Card>
  );
};