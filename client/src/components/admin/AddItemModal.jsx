import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddItemModal = ({ show, onHide, onAdd }) => {
  const [formData, setFormData] = useState({
    description: '',
    foundLocation: '',
    collectionLocation: '',
    category: 'other',
    tags: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAdd(formData);
      // Reset form
      setFormData({
        description: '',
        foundLocation: '',
        collectionLocation: '',
        category: 'other',
        tags: '',
        image: null
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      foundLocation: '',
      collectionLocation: '',
      category: 'other',
      tags: '',
      image: null
    });
    setImagePreview(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Lost Item
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the lost item in detail..."
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Found Location *</Form.Label>
                <Form.Control
                  type="text"
                  name="foundLocation"
                  value={formData.foundLocation}
                  onChange={handleChange}
                  placeholder="Where was it found?"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Collection Location *</Form.Label>
                <Form.Control
                  type="text"
                  name="collectionLocation"
                  value={formData.collectionLocation}
                  onChange={handleChange}
                  placeholder="Where can students collect it?"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="other">Other</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="books">Books</option>
                  <option value="bags">Bags</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas (e.g., red, wallet, leather)"
                />
                <Form.Text className="text-muted">
                  Separate multiple tags with commas
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Photo *</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <Form.Text className="text-muted">
                  Upload a clear photo of the item (max 5MB)
                </Form.Text>
              </Form.Group>

              {imagePreview && (
                <div className="mb-3">
                  <Form.Label>Preview</Form.Label>
                  <div className="border rounded p-2 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                </div>
              )}

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Tips for better results:</strong>
                <ul className="mb-0 mt-2">
                  <li>Take clear, well-lit photos</li>
                  <li>Include multiple angles if possible</li>
                  <li>Write detailed descriptions</li>
                  <li>Add relevant tags for easier searching</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Add Item
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddItemModal;








