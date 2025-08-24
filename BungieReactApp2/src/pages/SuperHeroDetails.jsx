import React, { useState } from 'react';
import { Card, Table, Button, Row, Col, Alert, Modal } from 'react-bootstrap';

export default function SuperHeroDetails({
  detailsHero,
  detailsLoading,
  detailsError,
  detailsPowers,
  detailsSidekicks,
  detailsComics,
  detailsImages,
  onClose
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title as="h4">Super Hero Details</Card.Title>
        {detailsLoading ? (
          <div className="text-center"><span className="spinner-border" /></div>
        ) : detailsError ? (
          <Alert variant="danger">{detailsError}</Alert>
        ) : detailsHero ? (
          <>
            <Table bordered>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{detailsHero.name}</td>
                </tr>
                <tr>
                  <th>Alias</th>
                  <td>{detailsHero.alias}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>{detailsHero.age}</td>
                </tr>
                <tr>
                  <th>Origin</th>
                  <td>{detailsHero.origin}</td>
                </tr>
                <tr>
                  <th>First Appearance</th>
                  <td>{detailsHero.firstAppearance?.replace('T', ' ').slice(0, 16)}</td>
                </tr>
                <tr>
                  <th>Active</th>
                  <td>{detailsHero.isActive ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </Table>
            <h5 className="mt-4">Super Powers</h5>
            {detailsPowers.length === 0 ? (
              <div>No powers found.</div>
            ) : (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Power Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsPowers.map((power) => (
                    <tr key={power.id}>
                      <td>{power.powerName}</td>
                      <td>{power.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <h5 className="mt-4">Sidekicks</h5>
            {detailsSidekicks.length === 0 ? (
              <div>No sidekicks found.</div>
            ) : (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsSidekicks.map((sk) => (
                    <tr key={sk.id}>
                      <td>{sk.name}</td>
                      <td>{sk.age}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <h5 className="mt-4">Comic Appearances</h5>
            {detailsComics.length === 0 ? (
              <div>No comic appearances found.</div>
            ) : (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Issue</th>
                    <th>Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsComics.map((comic) => (
                    <tr key={comic.id}>
                      <td>{comic.comicTitle}</td>
                      <td>{comic.issueNumber}</td>
                      <td>{comic.releaseDate?.replace('T', ' ').slice(0, 16)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <h5 className="mt-4">Images</h5>
            {detailsImages.length === 0 ? (
              <div>No images found.</div>
            ) : (
              <Row className="g-3">
                {detailsImages.map((img) => (
                  <Col key={img.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      className="h-100"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(img)}
                    >
                      <Card.Img
                        variant="top"
                        src={img.url.startsWith('http') ? img.url : `${window.location.origin}${img.url}`}
                        alt={img.title}
                        style={{ objectFit: 'cover', height: '200px' }}
                      />
                      <Card.Body>
                        <Card.Title>{img.title}</Card.Title>
                        <Card.Text>
                          <small>
                            Uploaded: {img.dateCreated?.replace('T', ' ').slice(0, 16)}
                          </small>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            {/* Image Modal */}
            <Modal show={!!selectedImage} onHide={handleCloseImageModal} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>{selectedImage?.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                {selectedImage && (
                  <img
                    src={selectedImage.url.startsWith('http') ? selectedImage.url : `${window.location.origin}${selectedImage.url}`}
                    alt={selectedImage.title}
                    style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }}
                  />
                )}
                <div className="mt-2">
                  <small>
                    Uploaded: {selectedImage?.dateCreated?.replace('T', ' ').slice(0, 16)}
                  </small>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseImageModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : null}
        <Button
          variant="secondary"
          className="mt-3"
          onClick={onClose}
        >
          Close Details
        </Button>
      </Card.Body>
    </Card>
  );
}