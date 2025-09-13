import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBasket, FaUser, FaCalendarAlt, FaBoxOpen, FaDollarSign, FaCheckCircle, FaTimesCircle, FaClipboardList } from 'react-icons/fa';

const USER_API = 'https://localhost:7226/api/Auth/me/guid';
const BASKET_API = 'https://localhost:7226/api/Payment/orderbasket/by-user';

export default function OrderBasket() {
  const [userId, setUserId] = useState('');
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basketLoading, setBasketLoading] = useState(false);
  const [error, setError] = useState('');
  const [basketError, setBasketError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }
    const fetchUserId = async () => {
      setLoading(true);
      setError('');
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
        setError('Error fetching user ID');
      } finally {
        setLoading(false);
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
        setBasket(data);
      } catch (err) {
        setBasketError('Error fetching order basket');
      } finally {
        setBasketLoading(false);
      }
    };
    fetchBasket();
  }, [userId]);

  const handleCheckout = () => {
    navigate('/payment');
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4 border-0" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6f3 100%)' }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaShoppingBasket size={40} className="text-success me-3" />
                <Card.Title as="h2" className="mb-0 fw-bold">Order Basket</Card.Title>
              </div>
              <Card.Text className="fs-5 mb-4">
                <FaClipboardList className="me-2 text-primary" />
                This page displays your order basket and items.
              </Card.Text>
              {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  {basketLoading ? (
                    <div className="text-center"><Spinner animation="border" /></div>
                  ) : basketError ? (
                    <Alert variant="danger">{basketError}</Alert>
                  ) : basket ? (
                    <>
                      <Table bordered className="text-center align-middle mb-4">
                        <tbody>
                          {/* <tr>
                            <th><FaShoppingBasket className="text-success me-1" /> Basket ID</th>
                            <td>{basket.id}</td>
                          </tr>
                          <tr>
                            <th><FaUser className="text-info me-1" /> User ID</th>
                            <td>{basket.userId}</td>
                          </tr> */}
                          <tr>
                            <th><FaCalendarAlt className="text-warning me-1" /> Created Date</th>
                            <td>{basket.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                          </tr>
                          <tr>
                            <th><FaCalendarAlt className="text-warning me-1" /> Updated Date</th>
                            <td>{basket.updatedDate?.replace('T', ' ').slice(0, 19)}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <h5 className="mt-4 mb-3 text-primary">
                        <FaBoxOpen className="me-2" />
                        Items
                      </h5>
                      {basket.items && basket.items.length > 0 ? (
                        <Table bordered size="sm" className="text-center align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Item ID</th>
                              <th>Product ID</th>
                              <th>Quantity</th>
                              <th><FaDollarSign className="text-success" /> Unit Price</th>
                              <th><FaCalendarAlt className="text-warning" /> Added Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {basket.items.map(item => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.productId}</td>
                                <td>
                                  {item.quantity > 0 ? (
                                    <span className="text-success fw-bold">
                                      <FaCheckCircle className="me-1" />
                                      {item.quantity}
                                    </span>
                                  ) : (
                                    <span className="text-danger fw-bold">
                                      <FaTimesCircle className="me-1" />
                                      {item.quantity}
                                    </span>
                                  )}
                                </td>
                                <td>{item.unitPrice}</td>
                                <td>{item.addedDate?.replace('T', ' ').slice(0, 19)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="text-muted">No items in basket.</div>
                      )}
                      <div className="mt-4 text-end">
                        <Button variant="success" size="lg" className="px-4 py-2" onClick={handleCheckout}>
                          <FaDollarSign className="me-2" />
                          CheckOut
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted">No basket found.</div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}