import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Button } from 'react-bootstrap';

const PRODUCT_STOCK_API = 'https://localhost:7226/api/ProductStock/by-superhero';
const ORDER_BASKET_ITEM_API = 'https://localhost:7226/api/Payment/orderbasketitem';
const USER_API = 'https://localhost:7226/api/Auth/me/guid';
const BASKET_API = 'https://localhost:7226/api/Payment/orderbasket/by-user';

export default function SuperHeroCard({ superHeroId }) {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [powers, setPowers] = useState([]);
  const [powersLoading, setPowersLoading] = useState(true);
  const [powersError, setPowersError] = useState('');

  const [sidekicks, setSidekicks] = useState([]);
  const [sidekicksLoading, setSidekicksLoading] = useState(true);
  const [sidekicksError, setSidekicksError] = useState('');

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState('');

  const [productStock, setProductStock] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState('');

  // Basket related state
  const [userId, setUserId] = useState('');
  const [basketId, setBasketId] = useState('');
  const [basketLoading, setBasketLoading] = useState(false);
  const [basketError, setBasketError] = useState('');

  // Cart UI state
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState('');
  const [showCartStatus, setShowCartStatus] = useState(false);

  const API_BASE = 'https://localhost:7226/api/SuperHeroes';
  const POWERS_API_BASE = 'https://localhost:7226/api/SuperPowers/by-superhero';
  const SIDEKICKS_API_BASE = 'https://localhost:7226/api/Sidekicks/by-superhero';

  // Fetch hero details
  useEffect(() => {
    if (!superHeroId) return;
    const fetchHero = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch superhero');
        const data = await res.json();
        setHero(data);
      } catch (err) {
        setError('Error loading superhero details');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [superHeroId]);

  // Fetch powers
  useEffect(() => {
    if (!superHeroId) return;
    const fetchPowers = async () => {
      setPowersLoading(true);
      setPowersError('');
      try {
        const res = await fetch(`${POWERS_API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch powers');
        const data = await res.json();
        setPowers(data);
      } catch (err) {
        setPowersError('Error loading super powers');
      } finally {
        setPowersLoading(false);
      }
    };
    fetchPowers();
  }, [superHeroId]);

  // Fetch sidekicks
  useEffect(() => {
    if (!superHeroId) return;
    const fetchSidekicks = async () => {
      setSidekicksLoading(true);
      setSidekicksError('');
      try {
        const res = await fetch(`${SIDEKICKS_API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch sidekicks');
        const data = await res.json();
        setSidekicks(data);
      } catch (err) {
        setSidekicksError('Error loading sidekicks');
      } finally {
        setSidekicksLoading(false);
      }
    };
    fetchSidekicks();
  }, [superHeroId]);

  // Fetch images
  useEffect(() => {
    if (!superHeroId) return;
    const fetchImages = async () => {
      setImagesLoading(true);
      setImagesError('');
      try {
        const res = await fetch(`${API_BASE}/${superHeroId}/images`);
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setImagesError('Error loading images');
      } finally {
        setImagesLoading(false);
      }
    };
    fetchImages();
  }, [superHeroId]);

  // Fetch product stock
  useEffect(() => {
    if (!superHeroId) return;
    const fetchProductStock = async () => {
      setStockLoading(true);
      setStockError('');
      try {
        const res = await fetch(`${PRODUCT_STOCK_API}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch product stock');
        const data = await res.json();
        setProductStock(data);
      } catch (err) {
        setStockError('Error loading product stock');
      } finally {
        setStockLoading(false);
      }
    };
    fetchProductStock();
  }, [superHeroId]);

  // Fetch userId and basketId
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    const fetchUserId = async () => {
      try {
        const res = await fetch(USER_API, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user ID');
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        setBasketError('Error fetching user ID');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('authToken');
    const fetchBasket = async () => {
      setBasketLoading(true);
      setBasketError('');
      try {
        const res = await fetch(`${BASKET_API}/${userId}`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch order basket');
        const data = await res.json();
        setBasketId(data.id);
      } catch (err) {
        setBasketError('Error fetching order basket');
      } finally {
        setBasketLoading(false);
      }
    };
    fetchBasket();
  }, [userId]);

  // Cart status disappear logic
  useEffect(() => {
    if (showCartStatus) {
      const timer = setTimeout(() => setShowCartStatus(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCartStatus]);

  // Add to Cart handler
  const handleAddToCart = async () => {
    if (!basketId || !productStock?.id || quantity < 1) return;
    const token = localStorage.getItem('authToken');
    setCartStatus('');
    setShowCartStatus(false);
    try {
      const res = await fetch(ORDER_BASKET_ITEM_API, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderBasketId: basketId,
          productId: productStock.id,
          quantity: quantity,
          unitPrice: productStock.unitPrice,
        }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      setCartStatus('Added to cart!');
    } catch (err) {
      setCartStatus('Failed to add to cart.');
    } finally {
      setShowCartStatus(true);
    }
  };

  // Quantity controls
  const handleMinus = () => setQuantity(q => Math.max(1, q - 1));
  const handlePlus = () => setQuantity(q => q + 1);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          {loading ? (
            <div className="text-center"><Spinner animation="border" size="sm" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : !hero ? null : (
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{hero.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{hero.alias}</Card.Subtitle>
                <Card.Text>
                  <strong>Origin:</strong> {hero.origin}<br />
                  <strong>First Appearance:</strong> {hero.firstAppearance?.replace('T', ' ').slice(0, 16)}<br />
                  <strong>Active:</strong> {hero.isActive ? 'Yes' : 'No'}
                </Card.Text>
                <h5 className="mt-4">Super Powers</h5>
                {powersLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : powersError ? (
                  <Alert variant="danger">{powersError}</Alert>
                ) : powers.length === 0 ? (
                  <div>No powers found.</div>
                ) : (
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Power Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {powers.map(power => (
                        <tr key={power.id}>
                          <td>{power.powerName}</td>
                          <td>{power.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <h5 className="mt-4">Sidekicks</h5>
                {sidekicksLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : sidekicksError ? (
                  <Alert variant="danger">{sidekicksError}</Alert>
                ) : sidekicks.length === 0 ? (
                  <div>No sidekicks found.</div>
                ) : (
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sidekicks.map(sk => (
                        <tr key={sk.id}>
                          <td>{sk.name}</td>
                          <td>{sk.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <h5 className="mt-4">Images</h5>
                {imagesLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : imagesError ? (
                  <Alert variant="danger">{imagesError}</Alert>
                ) : images.length === 0 ? (
                  <div>No images found.</div>
                ) : (
                  <Row className="g-3">
                    {images.map(img => (
                      <Col key={img.id} xs={12} sm={6} md={4}>
                        <Card className="h-100">
                          <Card.Img
                            variant="top"
                            src={img.url.startsWith('http') ? img.url : `${window.location.origin}${img.url}`}
                            alt={img.title}
                            style={{ objectFit: 'cover', height: '180px' }}
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
                <h5 className="mt-4">Product Stock</h5>
                {stockLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : stockError ? (
                  <Alert variant="danger">{stockError}</Alert>
                ) : productStock ? (
                  <>
                    <Table bordered>
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
                          <th>Unit Price</th>
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
                          <td>{productStock.isActive ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                          <th>Last Updated</th>
                          <td>{productStock.lastUpdated?.replace('T', ' ').slice(0, 19)}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <div className="d-flex align-items-center gap-2 mt-3">
                      <Button variant="outline-secondary" size="sm" onClick={handleMinus}>-</Button>
                      <span style={{ minWidth: 32, textAlign: 'center' }}>{quantity}</span>
                      <Button variant="outline-secondary" size="sm" onClick={handlePlus}>+</Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="ms-3"
                        onClick={handleAddToCart}
                        disabled={basketLoading || !basketId}
                      >
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
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}