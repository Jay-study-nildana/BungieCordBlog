import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/SidekickComicAppearances';
const SIDEKICKS_API_BASE = 'https://localhost:7226/api/Sidekicks';
const COMIC_APPEARANCES_API_BASE = 'https://localhost:7226/api/ComicAppearances';

export default function SideKickComicAppearance() {
  const [entries, setEntries] = useState([]);
  const [sidekicks, setSidekicks] = useState([]);
  const [comicAppearances, setComicAppearances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidekicksLoading, setSidekicksLoading] = useState(true);
  const [comicsLoading, setComicsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [form, setForm] = useState({
    sidekickId: '',
    comicAppearanceId: '',
  });
  const [selectedEntry, setSelectedEntry] = useState(null); // {sidekickId, comicAppearanceId}
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Fetch all entries
  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError('Error loading entries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all sidekicks for dropdown
  const fetchSidekicks = async () => {
    setSidekicksLoading(true);
    try {
      const res = await fetch(SIDEKICKS_API_BASE);
      if (!res.ok) throw new Error('Failed to fetch sidekicks');
      const data = await res.json();
      setSidekicks(data);
    } catch {
      setSidekicks([]);
    } finally {
      setSidekicksLoading(false);
    }
  };

  // Fetch all comic appearances for dropdown
  const fetchComicAppearances = async () => {
    setComicsLoading(true);
    try {
      const res = await fetch(COMIC_APPEARANCES_API_BASE);
      if (!res.ok) throw new Error('Failed to fetch comic appearances');
      const data = await res.json();
      setComicAppearances(data);
    } catch {
      setComicAppearances([]);
    } finally {
      setComicsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchSidekicks();
    fetchComicAppearances();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for create or edit
  const openModal = (mode, entry = null) => {
    setModalMode(mode);
    setSelectedEntry(entry ? { sidekickId: entry.sidekickId, comicAppearanceId: entry.comicAppearanceId } : null);
    setForm(
      entry
        ? {
            sidekickId: entry.sidekickId,
            comicAppearanceId: entry.comicAppearanceId,
          }
        : {
            sidekickId: '',
            comicAppearanceId: '',
          }
    );
    setShowModal(true);
  };

  // Create or update entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        sidekickId: form.sidekickId,
        comicAppearanceId: form.comicAppearanceId,
      };
      let res;
      if (modalMode === 'create') {
        res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(
          `${API_BASE}/${selectedEntry.sidekickId}/${selectedEntry.comicAppearanceId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      }
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      fetchEntries();
      setNotification({ show: true, message: 'Entry saved successfully!', variant: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error saving entry');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete entry
  const handleDelete = async (sidekickId, comicAppearanceId) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(
        `${API_BASE}/${sidekickId}/${comicAppearanceId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete');
      fetchEntries();
      setNotification({ show: true, message: 'Entry deleted successfully!', variant: 'danger' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'danger' }), 3000);
    } catch (err) {
      setError('Error deleting entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Floating notification */}
          {notification.show && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1050,
                minWidth: 300,
                maxWidth: '80vw'
              }}
            >
              <Alert
                variant={notification.variant}
                onClose={() => setNotification({ show: false, message: '', variant: notification.variant })}
                dismissible
              >
                {notification.message}
              </Alert>
            </div>
          )}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">SideKick Comic Appearance</Card.Title>
              <Card.Text>
                Manage SideKick Comic Appearances below. You can create, edit, and delete entries.
              </Card.Text>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add Entry
              </Button>
            </Card.Body>
          </Card>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>SideKick</th>
                  <th>Comic Appearance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const sidekick = sidekicks.find(s => s.id === entry.sidekickId);
                  const comic = comicAppearances.find(c => c.id === entry.comicAppearanceId);
                  return (
                    <tr key={entry.sidekickId + '-' + entry.comicAppearanceId}>
                      <td>{sidekick ? sidekick.name : entry.sidekickId}</td>
                      <td>
                        {comic
                          ? `${comic.comicTitle} #${comic.issueNumber} (${comic.releaseDate?.replace('T', ' ').slice(0, 16)})`
                          : entry.comicAppearanceId}
                      </td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => openModal('edit', entry)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(entry.sidekickId, entry.comicAppearanceId)}
                          disabled={submitting}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'create' ? 'Add Entry' : 'Edit Entry'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>SideKick</Form.Label>
              {sidekicksLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select
                  name="sidekickId"
                  value={form.sidekickId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a SideKick</option>
                  {sidekicks.map(sk => (
                    <option key={sk.id} value={sk.id}>
                      {sk.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comic Appearance</Form.Label>
              {comicsLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select
                  name="comicAppearanceId"
                  value={form.comicAppearanceId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Comic Appearance</option>
                  {comicAppearances.map(ca => (
                    <option key={ca.id} value={ca.id}>
                      {ca.comicTitle} #{ca.issueNumber} ({ca.releaseDate?.replace('T', ' ').slice(0, 16)})
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            {error && <div className="alert alert-danger">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}