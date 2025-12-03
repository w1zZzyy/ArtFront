// src/components/ExpertCard.tsx
import { Card } from 'react-bootstrap';
import type { IArtExpert } from '../types/types';
import './styles/ExpertCard.css';

interface ExpertCardProps {
  expert: IArtExpert;
  showExtra?: boolean;    // Description
}

export const ExpertCard = ({
  expert, 
  showExtra
}: ExpertCardProps) => {
  return (
    <Card className="expert-card h-100">
      <div className="expert-crd-cnt">
        {/* Текстовая часть */}
        <div className="expert-crd-txt">
          { (
            <div className="attributes">
              {expert.status ? (
                <div className="attribute-editable">{expert.name}</div>
              ) : (
                <div className="attribute-not-editable">{expert.name}</div>
              )}
            </div>
          )}

          <h5 className="expert-crd-ttl">{expert.title}</h5>

          {showExtra && (
            <p className="expert-crd-dscr">{expert.description}</p>
          )}

          <p className="expert-crd-alg">
            <strong>Алгоритм:</strong> {expert.algorithm}
          </p>
        </div>

        {/* Изображение эксперта */}
        <div className="expert-crd-img">
          <img
            src={expert.img_url || 'http://localhost:9000/art-center/imageError.gif'}
            alt={expert.title}
            className="img-fluid"
          />
        </div>
      </div>

      {/* Футер карточки с кнопками */}
      <div className="expert-card__footer mt-3">
        { (
          <a
            href={`/expert_properties/${expert.id_artcenter}`}
            className="expert-btn-more d-block text-center"
          >
            Подробнее
          </a>
        )}

        <form
          method="POST"
          action={`/center_request/add/expert/${expert.id_artcenter}`}
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
