import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Form, Button } from 'react-bootstrap';
import { FaCreditCard, FaShoppingBasket, FaDollarSign, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClipboardList, FaUser } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa';

const BASKETS_API = 'https://localhost:7226/api/Payment/orderbaskets';
const PAYMENT_API = 'https://localhost:7226/api/Payment/payment';
const USER_API = 'https://localhost:7226/api/Auth/me/guid';
const COMPLETE_ORDER_API = 'https://localhost:7226/api/Payment/complete-order';

export default function Payment() {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payStatus, setPayStatus] = useState('');
  const [showPayStatus, setShowPayStatus] = useState(false);

  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardError, setCardError] = useState('');

  // Store payment response
  const [paymentResponse, setPaymentResponse] = useState(null);

  // Store complete order response
  const [orderResponse, setOrderResponse] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }
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
        setError('Error fetching user ID');
      }
    };
    fetchUserId();

    const fetchBaskets = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(BASKETS_API, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch baskets');
        const data = await res.json();
        setBaskets(data);
      } catch (err) {
        setError('Error fetching basket information');
      } finally {
        setLoading(false);
      }
    };
    fetchBaskets();
  }, []);

  // Calculate total amount for all baskets
  const getTotalAmount = () => {
    let total = 0;
    baskets.forEach(basket => {
      if (basket.items && basket.items.length > 0) {
        basket.items.forEach(item => {
          total += (item.unitPrice || 0) * (item.quantity || 0);
        });
      }
    });
    return total;
  };

  // Hide pay status after 2 seconds
  useEffect(() => {
    if (showPayStatus) {
      const timer = setTimeout(() => setShowPayStatus(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPayStatus]);

  useEffect(() => {
    // Automatically confirm order 3 seconds after paymentResponse is set
    if (paymentResponse && !orderResponse) {
      const timer = setTimeout(() => {
        handleConfirmOrder();
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [paymentResponse, orderResponse]);

  // Basic credit card validation
  const validateCard = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      setCardError('Please fill all credit card fields.');
      return false;
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      setCardError('Card number must be 16 digits.');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(cardName)) {
      setCardError('Card name must contain only letters and spaces.');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setCardError('Expiry must be in MM/YY format.');
      return false;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setCardError('CVV must be 3 or 4 digits.');
      return false;
    }
    setCardError('');
    return true;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setPayLoading(true);
    setPayStatus('');
    setShowPayStatus(false);
    setPaymentResponse(null);

    if (!validateCard()) {
      setPayLoading(false);
      setShowPayStatus(true);
      setPayStatus(cardError);
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      if (getTotalAmount() === 0) {
        setPayStatus('Total amount is $0. Please add items to your basket before paying.');
        setShowPayStatus(true);
        setPayLoading(false);
        return;
      }
      const res = await fetch(PAYMENT_API, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          amount: getTotalAmount(),
          method: 'Credit Card',
          status: 1,
          transactionId: '',
        }),
      });
      if (!res.ok) throw new Error('Payment failed');
      const data = await res.json();
      setPaymentResponse(data);
      setPayStatus('Payment successful!');
    } catch (err) {
      setPayStatus('Payment failed.');
    } finally {
      setPayLoading(false);
      setShowPayStatus(true);
    }
  };

  // Confirm Order handler
  const handleConfirmOrder = async () => {
    if (!userId || !paymentResponse?.id) return;
    setOrderLoading(true);
    setOrderError('');
    setOrderResponse(null);
    const token = localStorage.getItem('authToken');
    try {
      const url = `${COMPLETE_ORDER_API}?UserId=${userId}&PaymentId=${paymentResponse.id}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
        body: '', // as per your curl example
      });
      if (!res.ok) throw new Error('Order confirmation failed');
      const data = await res.json();
      setOrderResponse(data);
    } catch (err) {
      setOrderError('Order confirmation failed.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4 border-0" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e3e6f3 100%)' }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaCreditCard size={40} className="text-primary me-3" />
                <Card.Title as="h2" className="mb-0 fw-bold">Payment</Card.Title>
              </div>
              <Card.Text className="fs-5 mb-4">
                <FaClipboardList className="me-2 text-success" />
                Proceed with payment.
              </Card.Text>
              {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  {/* Basket Table */}
                  {/* <Table bordered className="text-center align-middle mb-4">
                    <thead className="table-light">
                      <tr>
                        <th><FaShoppingBasket className="text-success me-1" /> Basket ID</th>
                        <th><FaUser className="text-info me-1" /> User ID</th>
                        <th><FaCalendarAlt className="text-warning me-1" /> Created Date</th>
                        <th><FaCalendarAlt className="text-warning me-1" /> Updated Date</th>
                        <th>Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {baskets.map(basket => (
                        <tr key={basket.id}>
                          <td>{basket.id}</td>
                          <td>{basket.userId}</td>
                          <td>{basket.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                          <td>{basket.updatedDate?.replace('T', ' ').slice(0, 19)}</td>
                          <td>
                            {basket.items && basket.items.length > 0 ? (
                              <ul className="list-unstyled mb-0">
                                {basket.items.map(item => (
                                  <li key={item.id}>
                                    <FaBoxOpen className="text-secondary me-1" />
                                    <strong>{item.productId}</strong> x {item.quantity} @ ${item.unitPrice}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-muted">No items</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table> */}
                  <div className="text-end mt-3">
                    <strong>Total Amount: </strong>
                    <span className="fs-5 text-success">
                      <FaDollarSign className="me-1" />
                      ${getTotalAmount()}
                    </span>
                  </div>
                  <div className="mt-2 mb-3 text-muted">
                    {getTotalAmount() === 0 && (
                      <span>
                        <FaTimesCircle className="text-danger me-1" />
                        You cannot pay if your basket total is $0. Please add items to your basket.
                      </span>
                    )}
                  </div>
                  {/* Credit Card Form */}
                  {!paymentResponse && (
                    <Form className="mt-4" onSubmit={handlePay}>
                      <h5 className="mb-3 text-primary">
                        <FaCreditCard className="me-2" />
                        Enter Credit Card Details
                      </h5>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 16))}
                              maxLength={16}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Name on Card</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="John Doe"
                              value={cardName}
                              onChange={e => setCardName(e.target.value)}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Expiry (MM/YY)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={e => setExpiry(e.target.value)}
                              maxLength={5}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="CVV"
                              value={cvv}
                              onChange={e => setCvv(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                              maxLength={4}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                          <Button
                            type="submit"
                            variant="success"
                            size="lg"
                            className="w-100"
                            disabled={payLoading || getTotalAmount() === 0}
                          >
                            <FaDollarSign className="me-2" />
                            {payLoading ? 'Processing...' : 'Pay Now'}
                          </Button>
                        </Col>
                      </Row>
                      {cardError && (
                        <Alert variant="danger" className="mt-3 p-2">
                          {cardError}
                        </Alert>
                      )}
                    </Form>
                  )}
                  {showPayStatus && (
                    <Alert
                      variant={payStatus === 'Payment successful!' ? 'success' : 'danger'}
                      className="mt-3 p-2"
                      style={{ transition: 'opacity 0.5s' }}
                    >
                      {payStatus}
                    </Alert>
                  )}
                  {/* Payment Details */}
                  {paymentResponse && (
                    <Card className="mt-4">
                      <Card.Body>
                        <Card.Title as="h5">
                          <FaCheckCircle className="text-success me-2" />
                          Payment Details
                        </Card.Title>
                        <Table bordered size="sm">
                          <tbody>
                            <tr>
                              <th>Payment ID</th>
                              <td>{paymentResponse.id}</td>
                            </tr>
                            <tr>
                              <th>User ID</th>
                              <td>{paymentResponse.userId}</td>
                            </tr>
                            <tr>
                              <th>Amount</th>
                              <td>${paymentResponse.amount}</td>
                            </tr>
                            <tr>
                              <th>Status</th>
                              <td>{paymentResponse.status}</td>
                            </tr>
                            <tr>
                              <th>Created Date</th>
                              <td>{paymentResponse.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  )}
                  {/* Confirm Order button after payment is successful */}
                  {paymentResponse && !orderResponse && (
                    <div className="mt-4 text-end">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleConfirmOrder}
                        disabled={orderLoading}
                      >
                        {orderLoading ? 'Confirming...' : 'Confirm Order'}
                      </Button>
                      {orderError && (
                        <Alert variant="danger" className="mt-3 p-2">
                          {orderError}
                        </Alert>
                      )}
                    </div>
                  )}
                  {/* Show order response */}
                  {orderResponse && (
                    <Card className="mt-4">
                      <Card.Body>
                        <Card.Title as="h5">
                          <FaCheckCircle className="text-success me-2" />
                          Order Details
                        </Card.Title>
                        <Table bordered size="sm">
                          <tbody>
                            <tr>
                              <th>Order ID</th>
                              <td>{orderResponse.id}</td>
                            </tr>
                            <tr>
                              <th>User ID</th>
                              <td>{orderResponse.userId}</td>
                            </tr>
                            <tr>
                              <th>Payment ID</th>
                              <td>{orderResponse.paymentId}</td>
                            </tr>
                            <tr>
                              <th>Status</th>
                              <td>{orderResponse.status}</td>
                            </tr>
                            <tr>
                              <th>Created Date</th>
                              <td>{orderResponse.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                            </tr>
                            <tr>
                              <th>Updated Date</th>
                              <td>{orderResponse.updatedDate?.replace('T', ' ').slice(0, 19)}</td>
                            </tr>
                          </tbody>
                        </Table>
                        <h6 className="mt-3">Order Items</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>Item ID</th>
                              <th>Product ID</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderResponse.items?.map(item => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.productId}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unitPrice}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
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