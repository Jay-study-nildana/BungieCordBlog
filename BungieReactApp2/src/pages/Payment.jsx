import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table } from 'react-bootstrap';
import BasketTable from './BasketTable';
import CreditCardForm from './CreditCardForm';
import PaymentDetails from './PaymentDetails';

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

  // Dummy credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

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

  const handlePay = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setPayLoading(true);
    setPayStatus('');
    setShowPayStatus(false);
    setPaymentResponse(null);
    const token = localStorage.getItem('authToken');
    try {
      // Dummy validation
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setPayStatus('Please fill all credit card fields.');
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
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Payment</Card.Title>
              <Card.Text>
                Review your basket and proceed with payment.
              </Card.Text>
              {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  <BasketTable baskets={baskets} />
                  <div className="text-end mt-3">
                    <strong>Total Amount: </strong>
                    <span className="fs-5">${getTotalAmount()}</span>
                  </div>
                  {/* Hide CreditCardForm and Pay button if paymentResponse exists */}
                  {!paymentResponse && (
                    <CreditCardForm
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      cardName={cardName}
                      setCardName={setCardName}
                      expiry={expiry}
                      setExpiry={setExpiry}
                      cvv={cvv}
                      setCvv={setCvv}
                      payLoading={payLoading}
                      onSubmit={handlePay}
                      disabled={getTotalAmount() === 0}
                    />
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
                  <PaymentDetails paymentResponse={paymentResponse} />
                  {/* Show Confirm Order button after payment is successful */}
                  {paymentResponse && !orderResponse && (
                    <div className="mt-4 text-end">
                      <button
                        className="btn btn-success"
                        onClick={handleConfirmOrder}
                        disabled={orderLoading}
                      >
                        {orderLoading ? 'Confirming...' : 'Confirm Order'}
                      </button>
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
                        <Card.Title as="h5">Order Details</Card.Title>
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