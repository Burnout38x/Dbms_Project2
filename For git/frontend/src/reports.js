import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Reports = () => {
  const clientId = localStorage.getItem('client_id');
  const userType = localStorage.getItem('user_type'); // 1 for Admin, 2 for Client
  const userName = localStorage.getItem('first_name');

  const [reports, setReports] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5050/reports', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            reportType: 'bigClients',
            clientId: clientId,
            userType: userType,
          },
        });
        setReports(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reports. Please try again.');
        setLoading(false);
      }
    };

    if (clientId) {
      fetchReports();
    } else {
      setError('Client not found. Please log in again.');
      setLoading(false);
    }
  }, [clientId, userType]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('client_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('first_name');
    navigate('/login');
  };

  const renderTable = (reportData, columns) => (
    <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'center' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {reportData?.length ? reportData.map((report, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>{report[col]}</td>
            ))}
            
          </tr>
        )) : 
          <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>No data found.</td></tr>
        }
      </tbody>
    </table>
  );

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="page-title">
        {userType === '1' ? `${userName}, Manage Reports` : `${userName}, View Your Reports`}
      </h2>

      <nav className="navigation">
        <ul className="nav-list">
          <li><Link to="/dashboard" className="menu-link">Dashboard</Link></li>
          <li><button onClick={handleLogout} className="menu-link-logout logout-btn">Logout</button></li>
        </ul>
      </nav>

      {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading reports...</p>
      ) : (
        <div>
          <h3 style={{ textAlign: 'center' }}>Reports</h3>
          
          {/* Render Big Clients */}
          <section className="table-container">
  <h4>Big Clients</h4>
  <div className="table">
    {renderTable(reports.bigClients, ['client_id', 'client_name', 'order_count'])}
  </div>
</section>

          {/* Render Difficult Clients */}
<section className="table-container">
  <h4>Difficult Clients</h4>
  <div className="table">
    {renderTable(reports.difficultClients, ['client_id', 'client_name', 'request_count'])}
  </div>  
</section>

          {/* Render This Month's Quotes */}
<section className="table-container">
  <h4>This Month's Quotes (AGREED)</h4>
  <div className="table">
    {renderTable(reports.thisMonthQuotes, ['quote_id', 'client_id', 'created_at', 'status'])}
  </div>
</section>

          {/* Render Prospective Clients */}
          <section className="table-container">
            <h4>Prospective Clients</h4>
            <div className='table'></div>
            {renderTable(reports.prospectiveClients, ['client_id', 'client_name'])}
          </section>

          {/* Render Largest Driveways */}
          <section className="table-container">
            <h4>Largest Driveways</h4>
            <div className='table'>
            {renderTable(reports.largestDriveway, ['property_address', 'largest_square_feet'])}
            </div>  
          </section>

          {/* Render Overdue Bills */}
          <section className="table-container">
            <h4>Overdue Bills</h4>
            <div className='table'>
            {renderTable(reports.overdueBills, ['bill_id', 'client_id', 'amount', 'due_date', 'status'])}
            </div>
          </section>
          {/* Render Bad Clients */}
<section className="table-container">
  <h4>Bad Clients</h4>
  <div className="table">
    {renderTable(reports.badClients, ['client_id', 'client_name'])}
  </div>
</section>

          {/* Render Good Clients */}
          <section className="table-container">
            <h4>Good Clients</h4>
            <div className='table'>
            {renderTable(reports.goodClients, ['client_id', 'client_name', 'amount_paid'])}
            </div>   
          </section>

          {/* Render Active orders*/}
          <section className="table-container">
            <h4>Active Orders</h4>
            <div className='table'>
            {renderTable(reports.activeOrders, ['order_id', 'status', 'work_time_start','work_time_end','property_address'])}
            </div>   
          </section>
          {/* Render Pending Quote Requests */}
<section className="table-container">
  <h4>Pending Quote Requests</h4>
  <div className="table">
    {renderTable(reports.pendingQuoteRequests, [
      "request_id",
      "client_id",
      "property_address",
      "square_feet",
      "proposed_price",
      "created_at",])}
  </div>
</section>
<section className="table-container">
  <h4>Pending Bills</h4>
  <div className="table">
    {renderTable(reports.pendingBills, [
      "bill_id",
      "amount",
      "status",
      "created_at",
    ])}
  </div>
</section>
<section className="table-container">
  <h4>All Bills</h4>
  <div className='table'></div>
  {renderTable(reports.allBills, ['bill_id', 'order_id', 'amount', 'status', 'created_at', 'updated_at'])}
</section>
<section className="table-container">
  <h4>Revenue Report</h4>
  <div className='table'></div>
  {renderTable(reports.revenueReport, ['total_revenue', 'total_bills'])}
</section>
        </div>
      )}
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
  display: 'inline-block',
  margin: '0 10px',
};


export default Reports;
