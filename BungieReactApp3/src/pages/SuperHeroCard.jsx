import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Button } from 'react-bootstrap';
import { FaUserSecret, FaRocket, FaBolt, FaUsers, FaCheckCircle, FaTimesCircle, FaBoxOpen, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import SuperHeroImages from './SuperHeroImages';
import { useSuperHeroCard } from './useSuperHeroCard';

export default function SuperHeroCard({ superHeroId }) {
  const {
    hero,
    loading,
    error,
    powers,
    powersLoading,
    powersError,
    sidekicks,
    sidekicksLoading,
    sidekicksError,
    images,
    imagesLoading,
    imagesError,
    productStock,
    stockLoading,
    stockError,
    basketId,
    basketLoading,
    basketError,
    quantity,
    cartStatus,
    showCartStatus,
    handleAddToCart,
    handleMinus,
    handlePlus,
  } = useSuperHeroCard(superHeroId);

  return (
    <Container fluid className="mt-4 px-0">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={7} className="mx-auto">
          {loading ? (
            <div className="text-center"><Spinner animation="border" size="sm" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : !hero ? null : (
            <Card className="mb-3 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6f3 100%)' }}>
              <Card.Body>
                <Row>
                  {/* Left: Images */}
                  <Col xs={12} md={5} className="d-flex flex-column align-items-center justify-content-center mb-4 mb-md-0">
                    <SuperHeroImages
                      loading={imagesLoading}
                      error={imagesError}
                      images={images}
                    />
                  </Col>
                  {/* Right: Details */}
                  <Col xs={12} md={7} className="text-center d-flex flex-column justify-content-center">
                    <div className="mb-3">
                      <FaUserSecret size={48} className="text-primary mb-2" />
                      <Card.Title className="fw-bold display-5">{hero.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted fs-5">{hero.alias}</Card.Subtitle>
                    </div>
                    <Card.Text className="fs-5">
                      <span className="me-3">
                        <FaRocket className="text-info me-1" />
                        <strong>Origin:</strong> {hero.origin}
                      </span>
                      <span className="me-3">
                        <FaCalendarAlt className="text-warning me-1" />
                        <strong>First Appearance:</strong> {hero.firstAppearance?.replace('T', ' ').slice(0, 16)}
                      </span>
                      <span>
                        {hero.isActive ? (
                          <FaCheckCircle className="text-success me-1" />
                        ) : (
                          <FaTimesCircle className="text-danger me-1" />
                        )}
                        <strong>Active:</strong> {hero.isActive ? 'Yes' : 'No'}
                      </span>
                    </Card.Text>
                    <hr className="my-4" />
                    <h5 className="mt-4 mb-3 text-primary">
                      <FaBolt className="me-2" />
                      Super Powers
                    </h5>
                    {powersLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : powersError ? (
                      <Alert variant="danger">{powersError}</Alert>
                    ) : powers.length === 0 ? (
                      <div>No powers found.</div>
                    ) : (
                      <Table bordered size="sm" className="text-center align-middle">
                        <thead className="table-light">
                          <tr>
                            <th><FaBolt className="text-warning" /> Power Name</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {powers.map(power => (
                            <tr key={power.id}>
                              <td className="fw-bold">{power.powerName}</td>
                              <td>{power.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                    <h5 className="mt-4 mb-3 text-success">
                      <FaUsers className="me-2" />
                      Sidekicks
                    </h5>
                    {sidekicksLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : sidekicksError ? (
                      <Alert variant="danger">{sidekicksError}</Alert>
                    ) : sidekicks.length === 0 ? (
                      <div>No sidekicks found.</div>
                    ) : (
                      <Table bordered size="sm" className="text-center align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Age</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sidekicks.map(sk => (
                            <tr key={sk.id}>
                              <td className="fw-bold">{sk.name}</td>
                              <td>{sk.age}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                    <h5 className="mt-4 mb-3 text-secondary">
                      <FaBoxOpen className="me-2" />
                      Product Stock
                    </h5>
                    {stockLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : stockError ? (
                      <Alert variant="danger">{stockError}</Alert>
                    ) : productStock ? (
                      <>
                        <Table bordered className="text-center align-middle">
                          <tbody>
                            <tr>
                              <th>SKU</th>
                              <td>{productStock.sku}</td>
                            </tr>
                            <tr>
                              <th>Description</th>
                              <td>{productStock.description}</td>
                            </tr>
                            <tr>
                              <th><FaDollarSign className="text-success" /> Unit Price</th>
                              <td>{productStock.unitPrice}</td>
                            </tr>
                            <tr>
                              <th>Quantity</th>
                              <td>{productStock.quantity}</td>
                            </tr>
                            <tr>
                              <th>Currency</th>
                              <td>{productStock.currency}</td>
                            </tr>
                            <tr>
                              <th>Active</th>
                              <td>
                                {productStock.isActive ? (
                                  <FaCheckCircle className="text-success me-1" />
                                ) : (
                                  <FaTimesCircle className="text-danger me-1" />
                                )}
                                {productStock.isActive ? 'Yes' : 'No'}
                              </td>
                            </tr>
                            <tr>
                              <th>Last Updated</th>
                              <td>
                                <FaCalendarAlt className="text-warning me-1" />
                                {productStock.lastUpdated?.replace('T', ' ').slice(0, 19)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        <div className="d-flex align-items-center gap-2 mt-3 justify-content-center">
                          <Button variant="outline-secondary" size="sm" onClick={handleMinus}>-</Button>
                          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{quantity}</span>
                          <Button variant="outline-secondary" size="sm" onClick={handlePlus}>+</Button>
                          <Button
                            variant="success"
                            size="sm"
                            className="ms-3"
                            onClick={handleAddToCart}
                            disabled={basketLoading || !basketId}
                          >
                            <FaBoxOpen className="me-1" />
                            Add to Cart
                          </Button>
                        </div>
                        {showCartStatus && (
                          <Alert
                            variant={cartStatus === 'Added to cart!' ? 'success' : 'danger'}
                            className="mt-3 p-2"
                            style={{ transition: 'opacity 0.5s' }}
                          >
                            {cartStatus}
                          </Alert>
                        )}
                      </>
                    ) : (
                      <div>No product stock found.</div>
                    )}
                    {basketError && (
                      <Alert variant="danger" className="mt-3">{basketError}</Alert>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}