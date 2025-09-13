import React from 'react';
import { Table } from 'react-bootstrap';

export default function BasketTable({ baskets }) {
  if (!baskets || baskets.length === 0) return <div>No basket found.</div>;
  return (
    <>
      {baskets.map(basket => (
        <div key={basket.id} className="mb-4">
          {/* <h5>Basket ID: {basket.id}</h5> */}
          {/* <Table bordered size="sm">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Added Date</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {basket.items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.productId}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.addedDate?.replace('T', ' ').slice(0, 19)}</td>
                  <td>{(item.unitPrice || 0) * (item.quantity || 0)}</td>
                </tr>
              ))}
            </tbody>
          </Table> */}
        </div>
      ))}
    </>
  );
}