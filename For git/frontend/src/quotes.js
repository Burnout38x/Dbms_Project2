import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css'; // Importing the external CSS

const Quotes = () => {
  const clientId = localStorage.getItem('client_id');
  const userType = localStorage.getItem('user_type'); // 1 for David, 2 for Clients
  const userName = localStorage.getItem('first_name');
  
  const [quotes, setQuotes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [formData, setFormData] = useState({
    client_id: clientId,
    property_address: '',
    square_feet: '',
    proposed_price: '',
    note: '',
    status: 'pending', // Default status
  });
  const [formData2, setFormData2] = useState({
    request_id: '',
    counter_price: '', // Proposed counter price
    work_time_start: '', // Work start time
    work_time_end: '', // Work end time
    note: '', // Additional remarks
    status: 'accepted', // Default status
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRequestsAndQuotes = async () => {
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
        
        // Update state with fetched data
        setRequests(response.data.requests);
        setQuotes(response.data.quotes);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      }
    };
    
    if (clientId) {
      fetchRequestsAndQuotes();
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
  
  const handleChangeQuote = (e) => {
    const { name, value } = e.target;
    setFormData2((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/requests', {
        clientId,
        ...formData,
      });
      alert('Request submitted successfully!');
      setShowForm(false);
    } catch (err) {
      alert('Failed to submit request. Please try again.');
    }
  };
  
  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/quote', {
        clientId,
        ...formData2,
      });
      alert('Quote submitted successfully!');
      setShowForm2(false);
    } catch (err) {
      alert('Failed to submit quote. Please try again.');
    }
  };
  
  return (
    <div className="container">
      <h2 className="page-title">
        {userType === '1' ? 'David, Manage Requests and Quotes' : `${userName}, View Your Requests and Quotes`}
      </h2>
      
      <nav className="navigation">
        <ul className="nav-list">
          <li><Link to="/dashboard" className="menu-link">Dashboard</Link></li>
          <li><button onClick={handleLogout} className="menu-link-logout logout-btn">Logout</button></li>
        </ul>
      </nav>
      
      {error && <p className="error-message">{error}</p>}
      
      {userType === '2' && (
        <div className="request-button-container">
          <button onClick={() => setShowForm(true)} className="button-primary">
            Submit a Request for Quote
          </button>
        </div>
      )}
      
      {showForm && userType === '2' && (
        <div className="form-container">
          <h3 className="form-header">Request for Quote</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Property Address:</label>
              <input type="text" name="property_address" value={formData.property_address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Square Feet:</label>
              <input type="number" name="square_feet" value={formData.square_feet} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Proposed Price:</label>
              <input type="number" step="0.01" name="proposed_price" value={formData.proposed_price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Note (Optional):</label>
              <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" value={formData.status} onChange={handleChange} required disabled>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="button-submit">Submit Request</button>
              <button type="button" onClick={() => setShowForm(false)} className="button-cancel">Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {showForm2 && (
        <div className="form-container">
          <h3 className="form-header">Submit a Quote</h3>
          <form onSubmit={handleSubmitQuote} className="form">
            <div className="form-group">
              <label>Request ID:</label>
              <input type="number" name="request_id" value={formData2.request_id} onChange={handleChangeQuote} required readOnly />
            </div>
            <div className="form-group">
              <label>Counter Price:</label>
              <input type="number" name="counter_price" value={formData2.counter_price} onChange={handleChangeQuote} required />
            </div>
            <div className="form-group">
              <label>Work Time Start:</label>
              <input type="datetime-local" name="work_time_start" value={formData2.work_time_start} onChange={handleChangeQuote} required />
            </div>
            <div className="form-group">
              <label>Work Time End:</label>
              <input type="datetime-local" name="work_time_end" value={formData2.work_time_end} onChange={handleChangeQuote} required />
            </div>
            <div className="form-group">
              <label>Note (Optional):</label>
              <textarea name="note" value={formData2.note} onChange={handleChangeQuote}></textarea>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" value={formData2.status} onChange={handleChangeQuote} required disabled>
                <option value="accepted">Accepted</option>
                <option value="resubmitted">Resubmitted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="button-submit">Submit Quote</button>
              <button type="button" onClick={() => setShowForm2(false)} className="button-cancel">Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="data-tables">
        <h3>Requests</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Property Address</th>
                <th>Square Feet</th>
                <th>Proposed Price</th>
                <th>Status</th>
                <th>Note</th>
                <th>Created At</th>
                {userType === '1' && <th className=""></th>}
              </tr>
            </thead>
            <tbody>
              {requests.length ? requests.map(r => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.property_address}</td>
                  <td>{r.square_feet}</td>
                  <td>${r.proposed_price}</td>
                  <td>{r.status}</td>
                  <td>{r.note}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  {userType === '1' && (
                    <td>
                      <button onClick={() => { setFormData2({ ...formData2, request_id: r.request_id }); setShowForm2(true); }} className="button-quote">
                        Quote
                      </button>
                    </td>
                  )}
                </tr>
              )) : <tr><td colSpan="7" className="no-data">No requests available.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <h3><strong>Quotes</strong></h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Quote ID</th>
                <th>Request ID</th>
                <th>Counter Price</th>
                <th>Work Time Start</th>
                <th>Work Time End</th>
                <th>Status</th>
                <th>Note</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length ? quotes.map(q => (
                <tr key={q.quote_id}>
                  <td>{q.quote_id}</td>
                  <td>{q.request_id}</td>
                  <td>${q.counter_price}</td>
                  <td>{new Date(q.work_time_start).toLocaleString()}</td>
                  <td>{new Date(q.work_time_end).toLocaleString()}</td>
                  <td>{q.status}</td>
                  <td>{q.note}</td>
                  <td>{new Date(q.created_at).toLocaleString()}</td>
                </tr>
              )) : <tr><td colSpan="8" className="no-data">No quotes available.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
