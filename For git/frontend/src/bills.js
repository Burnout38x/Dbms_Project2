import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const clientId = localStorage.getItem('client_id');
  const userType = localStorage.getItem('user_type'); // 1 for Admin, 2 for Client
  const userName = localStorage.getItem('first_name');
  
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]); // State to hold bill data
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [billData, setBillData] = useState({
    order_id: '',
    amount: '',
    status: 'pending', // Default status
    note: '',
  });

  const navigate = useNavigate();
  
  // Fetch orders and bills data
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Fetch bills associated with orders
        const billsResponse = await axios.get('http://localhost:5050/bills', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            clientId: clientId,
            userType: userType,
          },
        });
        setBills(billsResponse.data.bills); // Set bills
      } catch (err) {
        setError('Failed to load orders or bills. Please try again.');
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
    setBillData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitBill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/bill', {
        ...billData,
      });
      alert('Bill generated successfully!');
      setShowForm(false);
    } catch (err) {
      alert('Failed to generate bill. Please try again.');
    }
  };

  const handleGenerateBill = (orderId) => {
    setBillData((prevData) => ({
      ...prevData,
      order_id: orderId,
    }));
    setShowForm(true); // Show the form to generate bill
  };

  const handleBillStatusChange = async (billId, status) => {
    try {
      // Send PUT request to the correct endpoint
      await axios.put(`http://localhost:5050/status/${billId}`, {
        status: status,  // Only send status since bill_id is part of the URL
      });
  
      // Update the local state to reflect the status change
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.bill_id === billId ? { ...bill, status } : bill
        )
      );
  
      alert('Bill status updated!');
    } catch (err) {
      alert('Failed to update bill status. Please try again.');
    }
  };
  

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="page-title">
        {userType === '1' ? `${userName}, Manage Bills` : `${userName}, View Your Orders`}
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
          <h3 className='mb-2'>Generate Bill</h3>
          <form onSubmit={handleSubmitBill}>
            <div>
              <label>Order ID: </label>
              <input
                type="text"
                name="order_id"
                value={billData.order_id}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Amount: </label>
              <input
                type="number"
                name="amount"
                value={billData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Status: </label>
              <select name="status" value={billData.status} onChange={handleChange} required>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Note: </label>
              <textarea
                name="note"
                value={billData.note}
                onChange={handleChange}
                placeholder="Enter a note (optional)"
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className='button-submit'>Generate Bill</button>
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
            <tr><th>Order ID</th><th>Status</th><th>Completed At</th>{userType === '1' && (<th>Action</th>)}</tr>
          </thead>
          <tbody>
            {orders.length ? orders.map(o => (
              <tr key={o.order_id}>
                <td>{o.order_id}</td><td>{o.status}</td><td>{o.completed_at ? new Date(o.completed_at).toLocaleString() : 'N/A'}</td>
                {userType === '1' && (<td><button onClick={() => handleGenerateBill(o.order_id)} className='button-quote'>Generate Bill</button><td><button onClick={() => handleGenerateBill(o.order_id)} className='button-quote'>Complete Order</button></td></td>)}
              </tr>
            )) : <tr><td colSpan="4" style={{ textAlign: 'center' }}>No orders available.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Bills Table */}
      <h3 className='mb-2'>Bills</h3>
      <div className="table-container">
        <table className='table'>
          <thead>
            <tr><th>Bill ID</th><th>Order ID</th><th>Amount</th><th>Status</th><th>Note</th>{userType === '1' && (<th>Actions</th>)}</tr>
          </thead>
          <tbody>
            {bills.length ? bills.map((bill) => (
              <tr key={bill.bill_id}>
                <td>{bill.bill_id}</td>
                <td>{bill.order_id}</td>
                <td>{bill.amount}</td>
                <td>{bill.status}</td>
                <td>{bill.note || 'N/A'}</td>
                {userType === '1' && (<td>
                  
                    <>
                      <button 
                        onClick={() => handleBillStatusChange(bill.bill_id, 'paid')} 
                        className='button-submit'
                      >
                        Mark as Paid
                      </button>
                      <button 
                        onClick={() => handleBillStatusChange(bill.bill_id, 'disputed')} 
                       className='ml-1 button-cancel'
                      >
                        Mark as Disputed
                      </button>
                    </>
                </td>
                  )}
              </tr>
            )) : <tr><td colSpan="6" style={{ textAlign: 'center' }}>No bills available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reusable style for navigation links and buttons
const menuLinkStyle = {
  textDecoration: 'none',
  fontSize: '1.2rem',
  color: '#007bff',
  padding: '10px 20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  display: 'inline-block',  // Make it an inline block for better alignment
  margin: '0 10px', // Adjust margin between links
};

const submitButtonStyle = {
  padding: '10px 20px',
  fontSize: '1rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  fontSize: '1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  marginLeft: '10px',
};

export default Orders;
