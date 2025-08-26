import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function CreditCardForm({
  cardNumber, setCardNumber,
  cardName, setCardName,
  expiry, setExpiry,
  cvv, setCvv,
  payLoading,
  onSubmit,
  disabled
}) {
  return (
    <Form className="mt-4" onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Card Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
          maxLength={19}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name on Card</Form.Label>
        <Form.Control
          type="text"
          placeholder="Cardholder Name"
          value={cardName}
          onChange={e => setCardName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3 d-flex gap-3">
        <div style={{ flex: 1 }}>
          <Form.Label>Expiry</Form.Label>
          <Form.Control
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            maxLength={5}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="password"
            placeholder="CVV"
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            maxLength={4}
          />
        </div>
      </Form.Group>
      <div className="mt-4 text-end">
        <Button
          variant="primary"
          type="submit"
          disabled={payLoading || disabled}
        >
          {payLoading ? 'Processing...' : 'Pay'}
        </Button>
      </div>
    </Form>
  );
}