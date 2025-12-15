// src/components/ExpertCard.tsx
import './styles/ExpertCard.css';
import type { IArtExpert } from '../types/types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { addExpertToDraft } from '../store/requestSlice';
import { Button, Badge, Spinner } from 'react-bootstrap';

interface ExpertCardProps {
  expert: IArtExpert;
  showExtra?: boolean;
}

export const ExpertCard = ({ expert, showExtra }: ExpertCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { currentRequest, addingExpert } = useSelector((state: RootState) => ({
    currentRequest: state.request.currentRequest,
    addingExpert: state.request.addingExpert, // нужно добавить в requestSlice
  }));

  const isInDraft = currentRequest?.experts?.some(e => e.id_artcenter === expert.id_artcenter);

  const handleAddToRequest = () => {
    if (!expert.id_artcenter) return;
    dispatch(addExpertToDraft(expert.id_artcenter));
  };

  return (
    <div className="card expert-card">
      <div className="expert-crd-img card-image">
        <img
          src={expert.img_url || '/ArtFront/images/imageError.gif'}
          alt={expert.title}
        />
      </div>

      <div className="expert-crd-cnt card-content">
        <div className="expert-crd-txt">
          {expert.name && (
            <div className={expert.status ? 'attribute-editable' : 'attribute-not-editable'}>
              {expert.name}
            </div>
          )}
          <h3 className="expert-crd-ttl">{expert.title}</h3>
          <p className="expert-crd-alg"><strong>Алгоритм:</strong> {expert.algorithm}</p>
          {showExtra && expert.description && (
            <p className="expert-crd-dscr">{expert.description}</p>
          )}
        </div>

        <div className="expert-card__footer">
          <Link
            to={`/expert_properties/${expert.id_artcenter}`}
            className="expert-btn-more card-button"
          >
            Подробнее
          </Link>

          {isAuth && (
            <Button
              className="expert-btn-add card-button"
              onClick={handleAddToRequest}
              disabled={isInDraft || addingExpert === expert.id_artcenter}
              variant={isInDraft ? 'outline-success' : 'success'}
              size="sm"
            >
              {addingExpert === expert.id_artcenter ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-1" />
                  Добавление...
                </>
              ) : isInDraft ? (
                <>
                  В заявке
                </>
              ) : (
                <>
                  Добавить
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
