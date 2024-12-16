import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const clientId = localStorage.getItem('client_id');
  const userType = localStorage.getItem('user_type'); // 1 for Admin, 2 for Client
  const userName = localStorage.getItem('first_name');
  
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client_id: clientId,
    quote_id: '', // This will be set when the user selects a quote
    status: 'in_progress', // Default status
  });
  const [selectedRequest, setSelectedRequest] = useState(null); // To store the selected request details for the order form
  
  const navigate = useNavigate();
  
  // Fetch orders, quotes, and requests data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5050/requests-and-quotes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            clientId: clientId,
            userType: userType,
          },
        });
        
        // Extracting quotes from the response
        setQuotes(response.data.quotes);
        setRequests(response.data.requests); // Set requests
        
        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:5050/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            clientId: clientId,
            userType: userType,
          },
        });
        
        setOrders(ordersResponse.data.orders);
      } catch (err) {
        setError('Failed to load orders, quotes, or requests. Please try again.');
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/order', {
        clientId,
        ...formData,
      });
      alert('Order submitted successfully!');
      setShowForm(false);
    } catch (err) {
      alert('Failed to submit order. Please try again.');
    }
  };
  
  // Handle selecting a request to start the order form
  const handleOrderForm = (request) => {
    setSelectedRequest(request);
    
    // Automatically set the quote_id and status
    const defaultQuote = quotes.find((quote) => quote.request_id === request.request_id);
    
    if (defaultQuote) {
      setFormData({
        client_id: clientId,
        quote_id: defaultQuote.quote_id,  // Set the default quote_id
        status: 'in_progress',            // Default status
      });
    }
    
    setShowForm(true); // Show order form
  };
  
  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2 className="page-title">
    {userType === '1' ? `${userName}, Manage Orders` : `${userName}, View Your Orders`}
    </h2>
    
    <nav className="navigation">
    <ul className="nav-list">
    <li><Link to="/dashboard" className="menu-link">Dashboard</Link></li>
    <li><button onClick={handleLogout} className="menu-link-logout logout-btn">Logout</button></li>
    </ul>
    </nav>
    
    {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    
    {showForm && userType === '1' && (
      <div className="form-container">
      <h3 className='mb-2'>New Order</h3>
      <form onSubmit={handleSubmit}>
      <div><label>Quote ID:</label>
      <select name="quote_id" value={formData.quote_id} onChange={handleChange} required disabled>
      <option value="">Select a Quote</option>
      {quotes.map((quote) => (
        <option key={quote.quote_id} value={quote.quote_id}>
        {quote.quote_id}
        </option>
      ))}
      </select>
      </div>
      <div><label>Status:</label>
      <select name="status" value={formData.status} onChange={handleChange} required disabled>
      <option value="in_progress">In Progress</option>
      <option value="completed">Completed</option>
      </select>
      </div>
      <div style={{ marginTop: '10px' }}>
      <button type="submit" style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Submit Order</button>
      <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '10px' }}>Cancel</button>
      </div>
      </form>
      </div>
    )}
    
    {/* Requests Table */}
    <h3 className=''>Requests</h3>
    <div className='table-container'>
    <table className='table' >
    <thead>
    <tr><th>Request ID</th><th>Client ID</th><th>Status</th>
    {userType === '1' && (<th>Action</th>)}
    </tr>
    </thead>
    <tbody>
    {requests.length ? requests.map((request) => (
      <tr key={request.request_id}>
      <td>{request.request_id}</td>
      <td>{request.client_id}</td>
      <td>{request.status}</td>
      {userType === '1' && (<td>
      <button 
      onClick={() => handleOrderForm(request)} 
      style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
      Create Order
      </button>
      </td>)}
      </tr>
    )) : <tr><td colSpan="4" style={{ textAlign: 'center' }}>No requests available.</td></tr>}
    </tbody>
    </table>
    </div>
    
    {/* Orders Table */}
    <h3>Orders</h3>
    <div className="table-container"> 
    <table className="table">
    <thead>
    <tr><th>Order ID</th><th>Quote ID</th><th>Status</th><th>Completed At</th></tr>
    </thead>
    <tbody>
    {orders.length ? orders.map(o => (
      <tr key={o.order_id}>
      <td>{o.order_id}</td><td>{o.quote_id}</td><td>{o.status}</td><td>{o.completed_at ? new Date(o.completed_at).toLocaleString() : 'N/A'}</td>
      </tr>
    )) : <tr><td colSpan="4" style={{ textAlign: 'center' }}>No orders available.</td></tr>}
    </tbody>
    </table>
    </div>
    </div>
  );
};

// Reusable style for navigation links and buttons


export default Orders;