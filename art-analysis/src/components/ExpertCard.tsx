// src/components/ExpertCard.tsx
import './styles/ExpertCard.css';
import type { IArtExpert } from '../types/types';

interface ExpertCardProps {
  expert: IArtExpert;
  showExtra?: boolean;    // Description
}

export const ExpertCard = ({
  expert, 
  showExtra
}: ExpertCardProps) => {
  return (
    <div className="card expert-card">
      {/* Изображение эксперта */}
      <div className="expert-crd-img card-image">
        <img
          src={expert.img_url || 'http://localhost:9000/art-center/imageError.gif'}
          alt={expert.title}
        />
      </div>

      {/* Контент карточки */}
      <div className="expert-crd-cnt card-content">
        {/* Атрибуты/статус */}
        <div className="expert-crd-txt">
          {expert.name && (
            <div className="attributes">
              {expert.status ? (
                <div className="attribute-editable">{expert.name}</div>
              ) : (
                <div className="attribute-not-editable">{expert.name}</div>
              )}
            </div>
          )}

          <h3 className="expert-crd-ttl">{expert.title}</h3>

          <p className="expert-crd-alg" style={{ margin: '0.05rem 0 0.5rem 0 !important' }}>
            <strong>Алгоритм:</strong> {expert.algorithm}
          </p>

          {showExtra && expert.description && (
            <p className="expert-crd-dscr">{expert.description}</p>
          )}
        </div>

        {/* Футер карточки с кнопками */}
        <div className="expert-card__footer">
          <a
            href={`/expert_properties/${expert.id_artcenter}`}
            className="expert-btn-more card-button"
          >
            Подробнее
          </a>

          <form
            method="POST"
            action={`/center_request/add/expert/${expert.id_artcenter}`}
          >
            <button type="submit" className="expert-btn-add card-button">
              Добавить в заявку
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};