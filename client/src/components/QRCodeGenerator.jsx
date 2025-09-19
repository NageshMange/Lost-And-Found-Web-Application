import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Modal, Button } from 'react-bootstrap';

const QRCodeGenerator = ({ item, show, onHide }) => {
  const [qrSize, setQrSize] = useState(256);

  if (!item) return null;

  const qrData = {
    id: item._id,
    description: item.description,
    foundLocation: item.foundLocation,
    collectionLocation: item.collectionLocation,
    category: item.category,
    url: `${window.location.origin}/student?item=${item._id}`
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `lost-item-${item._id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-qr-code me-2"></i>
          QR Code for Item
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center">
        <div className="mb-3">
          <h6>{item.description}</h6>
          <p className="text-muted small">
            <i className="bi bi-geo-alt me-1"></i>
            {item.foundLocation} → {item.collectionLocation}
          </p>
        </div>

        <div className="border rounded p-3 mb-3 bg-light">
          <QRCode
            id="qr-code-canvas"
            value={JSON.stringify(qrData)}
            size={qrSize}
            level="M"
            includeMargin={true}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small">QR Code Size:</label>
          <input
            type="range"
            className="form-range"
            min="128"
            max="512"
            step="32"
            value={qrSize}
            onChange={(e) => setQrSize(parseInt(e.target.value))}
          />
          <div className="d-flex justify-content-between small text-muted">
            <span>Small</span>
            <span>{qrSize}px</span>
            <span>Large</span>
          </div>
        </div>

        <div className="alert alert-info small">
          <i className="bi bi-info-circle me-1"></i>
          This QR code contains item details and can be scanned to quickly access item information.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={downloadQR}>
          <i className="bi bi-download me-2"></i>
          Download QR Code
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRCodeGenerator;








