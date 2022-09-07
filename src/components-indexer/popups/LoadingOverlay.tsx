import Col from '../spacing/Col';
import Loader from './Loader';

import './LoadingOverlay.scss';

const LoadingOverlay = ({
  loading,
  text,
}: {
  loading: boolean;
  text?: string;
}) => {
  if (!loading) {
    return null;
  }

  return (
    <Col className="loading-overlay">
      <Col className={`${text ? 'solid' : ''}`}>
        {!!text && <Col className="loader-text">{text}</Col>}
        <Loader />
      </Col>
    </Col>
  );
};

export default LoadingOverlay;
