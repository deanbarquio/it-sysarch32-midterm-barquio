import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; 
import Dashboard from './Dashboard';

const ViewOrders = ({ onBackToDashboard }) => {
  const [orders, setOrders] = useState([]);
  const [goToLogin, setGoToLogin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders(token);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:3000/orders', config);
      setOrders(response.data.orders.map(order => ({
        id: order._id,
        productName: order.product ? order.product.name : 'No product name',
        price: order.product ? order.product.price : 0
      })));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const handleGoToDashboard = () => {
    setGoToLogin(true);
  };

  if (goToLogin) {
    return <Dashboard />;
  }
  return (
    <div className="orders-container">
      <button className="back-button" onClick={handleGoToDashboard}>Back to Dashboard</button>
      <h2 className="titleOrder">Order List</h2>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.productName || 'N/A'}</td>
                <td>${order.price ? order.price.toFixed(2) : 'N/A'}</td>
                <td>
                  <button className="delete-button" onClick={() => deleteOrder(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders to display</p>
      )}
    </div>
  );
};

export default ViewOrders;
