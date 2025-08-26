import React from 'react';
import { Card, Table } from 'react-bootstrap';

export default function PaymentDetails({ paymentResponse }) {
  if (!paymentResponse) return null;
  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title as="h5">Payment Details</Card.Title>
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
              <td>{paymentResponse.amount}</td>
            </tr>
            <tr>
              <th>Method</th>
              <td>{paymentResponse.method}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{paymentResponse.status}</td>
            </tr>
            <tr>
              <th>Transaction ID</th>
              <td>{paymentResponse.transactionId}</td>
            </tr>
            <tr>
              <th>Created Date</th>
              <td>{paymentResponse.createdDate?.replace('T', ' ').slice(0, 19)}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}