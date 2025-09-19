import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CollectItemModal = ({ show, onHide, item, onCollect }) => {
  const [collectedBy, setCollectedBy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collectedBy.trim()) return;

    setLoading(true);
    try {
      await onCollect(collectedBy.trim());
      setCollectedBy('');
    } catch (error) {
      console.error('Error collecting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCollectedBy('');
    onHide();
  };

  if (!item) return null;

  const buildImageUrl = (rawPath) => {
    const raw = rawPath || '';
    const lower = raw.toLowerCase();
    const idx = lower.lastIndexOf('uploads');
    const rel = (idx !== -1 ? raw.slice(idx) : raw).replace(/\\\\/g, '/');
    return `http://localhost:5000/${rel}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-check-circle me-2"></i>
          Mark Item as Collected
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="mb-3">
          <h6>Item Details:</h6>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={buildImageUrl(item.imagePath)}
                    alt={item.description}
                    className="img-fluid rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="bg-light rounded d-none align-items-center justify-content-center"
                    style={{ height: '120px' }}
                  >
                    <i className="bi bi-image text-muted"></i>
                  </div>
                </div>
                <div className="col-md-8">
                  <h6 className="card-title">{item.description}</h6>
                  <p className="card-text">
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      <strong>Found:</strong> {item.foundLocation}<br />
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      <strong>Collection:</strong> {item.collectionLocation}
                    </small>
                  </p>
                  <span className={`badge bg-${item.category === 'electronics' ? 'info' : 
                    item.category === 'clothing' ? 'warning' : 
                    item.category === 'accessories' ? 'danger' : 
                    item.category === 'books' ? 'success' : 
                    item.category === 'bags' ? 'dark' : 'secondary'}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Collected By <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              placeholder="Enter the name of the person who collected the item"
              required
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Enter the student's name or ID who claimed this item
            </Form.Text>
          </Form.Group>

          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Important:</strong> Once marked as collected, this item will be moved to the collected items list and cannot be undone.
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit}
          disabled={loading || !collectedBy.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Mark as Collected
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CollectItemModal;


