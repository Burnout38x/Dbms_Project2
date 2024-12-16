import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Negotiations = () => {
  const clientId = localStorage.getItem('client_id');
  const userType = localStorage.getItem('user_type'); // 1 for Admin, 2 for Client
  const userName = localStorage.getItem('first_name');

  const [orders, setOrders] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [negotiationData, setNegotiationData] = useState({
    type: 'quote', // Default type (could be 'quote' or 'bill')
    parent_id: '',
    client_id: clientId,
    note: '',
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  // Fetch orders and negotiations data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOrders = await axios.get('http://localhost:5050/orderNegotiation', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            clientId: clientId,
            userType: userType,
          },
        });
        setOrders(responseOrders.data.orders);

        const responseNegotiations = await axios.get('http://localhost:5050/negotiations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            clientId: clientId,
            userType: userType,
          },
        });
        setNegotiations(responseNegotiations.data.negotiations);

      } catch (err) {
        setError('Failed to load orders or negotiations. Please try again.');
      }
    };

    if (clientId) {
      fetchData();
    } else {
      setError('Client not found. Please log in again.');
    }
  }, [clientId, userType]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('client_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('first_name');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNegotiationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitNegotiation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/negotiation', negotiationData);
      alert('Negotiation created successfully!');
      setShowForm(false);
    } catch (err) {
      alert('Failed to create negotiation. Please try again.');
    }
  };

  const handleGenerateNegotiation = (orderId) => {
    setNegotiationData((prevData) => ({
      ...prevData,
      parent_id: orderId, // Link the negotiation to the order
    }));
    setShowForm(true); // Show the form to create a new negotiation
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="page-title">
        {userType === '1' ? `${userName}, Manage Negotiations` : `${userName}, View Your Negotiations`}
      </h2>

      <nav className="navigation">
        <ul className="nav-list">
          <li><Link to="/dashboard"className="menu-link">Dashboard</Link></li>
          <li><button onClick={handleLogout} className="menu-link-logout logout-btn">Logout</button></li>
        </ul>
      </nav>

      {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {showForm &&  (
        <div className="form-container">
          <h3 className='mb-2'>Create Negotiation</h3>
          <form onSubmit={handleSubmitNegotiation}>
            <div>
              <label>Order ID: </label>
              <input
                type="text"
                name="parent_id"
                value={negotiationData.parent_id}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Type: </label>
              <select name="type" value={negotiationData.type} onChange={handleChange} required>
                <option value="quote">Quote</option>
                <option value="bill">Bill</option>
              </select>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Note: </label>
              <textarea
                name="note"
                value={negotiationData.note}
                onChange={handleChange}
                placeholder="Enter a note (optional)"
              />
            </div>
            <div style={{ marginTop: '20px' }}> 
              <button type="submit" className='button-submit'>Create Negotiation</button>
              <button type="button" onClick={() => setShowForm(false)} className="button-cancel mr-1">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Orders Table */}
      <h3 className='mb-2'>Orders</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr><th>Order ID</th><th>Client Name</th><th>Order Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.length ? orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.client_name}</td>
                <td>{order.status}</td>
                <td>
                  <button 
                    onClick={() => handleGenerateNegotiation(order.order_id)} 
                    className='button-quote'
                  >
                    Negotiate
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="4" style={{ textAlign: 'center' }}>No orders available.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Negotiations Table */}
      <h3 className='mb-2'>Negotiations</h3>
<div className='table-container'>
  <table className='table'>
    <thead>
      <tr>
        <th>Negotiation ID</th>
        <th>Name</th>
        <th>Type</th>
        <th>Order ID</th>
        <th>Note</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {negotiations.length ? negotiations.map((group) => (
        <React.Fragment key={group.parent_id}>
          {/* Group Title for Parent ID */}
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Parent Order ID: {group.parent_id}
            </td>
          </tr>
          
          {/* Display each negotiation in this group */}
          {group.negotiations.map((negotiation) => (
            <tr key={negotiation.negotiation_id}>
              <td>{negotiation.negotiation_id}</td>
              <td>{negotiation.client_name}</td>
              <td>{negotiation.type}</td>
              <td>{negotiation.parent_id}</td>
              <td>{negotiation.note || 'N/A'}</td>
              <td>{new Date(negotiation.created_at).toLocaleString() || 'N/A'}</td>
            </tr>
          ))}
        </React.Fragment>
      )) : 
        <tr><td colSpan="5" style={{ textAlign: 'center' }}>No negotiations available.</td></tr>
      }
    </tbody>
  </table>
</div>

    </div>
  );
};


export default Negotiations;
