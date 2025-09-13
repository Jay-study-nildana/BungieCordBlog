import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

const ORDERS_API = 'https://localhost:7226/api/Payment/orders';
const ORDER_API = 'https://localhost:7226/api/Payment/order';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [details, setDetails] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(ORDERS_API);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Show order details
  const handleShowDetails = async (orderId) => {
    setShowDetailsModal(true);
    setDetailsLoading(true);
    setDetailsError('');
    setDetails(null);
    try {
      const res = await fetch(`${ORDER_API}/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      setDetailsError('Error loading order details');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Open edit modal
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditError('');
    setEditSuccess('');
    setShowEditModal(true);
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError('');
    setEditSuccess('');
    try {
      const res = await fetch(`${ORDER_API}/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({ status: Number(editStatus) }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      const data = await res.json();
      setEditSuccess('Order status updated!');
      setTimeout(() => setShowEditModal(false), 1200);
      fetchOrders();
    } catch (err) {
      setEditError('Error updating order');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">All Orders</Card.Title>
              <Card.Text>
                Manage all orders below. You can view details and update order status.
              </Card.Text>
            </Card.Body>
          </Card>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Payment ID</th>
                  <th>Status</th>
                  <th>Status String</th>
                  <th>Created Date</th>
                  <th>Updated Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{order.email}</td>
                    <td>{order.paymentId}</td>
                    <td>{order.status}</td>
                    <td>{order.statusString}</td>
                    <td>{order.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                    <td>{order.updatedDate?.replace('T', ' ').slice(0, 19)}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowDetails(order.id)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Details Modal */}
          <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailsLoading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : detailsError ? (
                <Alert variant="danger">{detailsError}</Alert>
              ) : details ? (
                <Table bordered size="sm">
                  <tbody>
                    <tr>
                      <th>Order ID</th>
                      <td>{details.id}</td>
                    </tr>
                    <tr>
                      <th>User ID</th>
                      <td>{details.userId}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{details.email}</td>
                    </tr>
                    <tr>
                      <th>Payment ID</th>
                      <td>{details.paymentId}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{details.status}</td>
                    </tr>
                    <tr>
                      <th>Status String</th>
                      <td>{details.statusString}</td>
                    </tr>
                    <tr>
                      <th>Created Date</th>
                      <td>{details.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                    </tr>
                    <tr>
                      <th>Updated Date</th>
                      <td>{details.updatedDate?.replace('T', ' ').slice(0, 19)}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : null}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Form onSubmit={handleEditSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Order Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    required
                  >
                    <option value="0">Pending</option>
                    <option value="1">Processing</option>
                    <option value="2">Shipped</option>
                    <option value="3">Delivered</option>
                    <option value="4">Cancelled</option>
                  </Form.Select>
                </Form.Group>
                {editError && <Alert variant="danger">{editError}</Alert>}
                {editSuccess && <Alert variant="success">{editSuccess}</Alert>}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={editSubmitting}>
                  {editSubmitting ? 'Updating...' : 'Update'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}