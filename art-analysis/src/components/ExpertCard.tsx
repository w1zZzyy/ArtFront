// src/components/ExpertCard.tsx
import { Card } from 'react-bootstrap';
import type { IArtExpert } from '../types/types';
import './styles/ExpertCard.css';

interface ExpertCardProps {
  expert: IArtExpert;
  showExtra?: boolean;    // Name и Description
  showDetails?: boolean;  // кнопка Подробнее
}

export const ExpertCard = ({
  expert,
  showExtra = true,
  showDetails = true
}: ExpertCardProps) => {
  return (
    <Card className="expert-card h-100">
      <div className="expert-crd-cnt">
        {/* Текстовая часть */}
        <div className="expert-crd-txt">
          {showExtra && (
            <div className="attributes">
              {expert.Status ? (
                <div className="attribute-editable">{expert.Name}</div>
              ) : (
                <div className="attribute-not-editable">{expert.Name}</div>
              )}
            </div>
          )}

          <h5 className="expert-crd-ttl">{expert.Title}</h5>

          {showExtra && (
            <p className="expert-crd-dscr">{expert.Description}</p>
          )}

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
        {showDetails && (
          <a
            href={`/expert_properties/${expert.ID_artcenter}`}
            className="expert-btn-more d-block text-center"
          >
            Подробнее
          </a>
        )}

        <form
          method="POST"
          action={`/center_request/add/expert/${expert.ID_artcenter}`}
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
