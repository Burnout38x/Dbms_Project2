// Required dependencies
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware to parse JSON data and handle CORS (Cross-Origin Resource Sharing)
app.use(bodyParser.json());
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',  // Database host, usually 'localhost' in local development
  user: 'root',       // Default username in XAMPP
  password: '',       // Leave blank if no password is set in XAMPP
  database: 'driveway',  // Database name
});

// Connect to the MySQL database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Start the server and listen on port 5050
app.listen(5050, () => {
  console.log('Server is running on port 5050');
});

// User registration route
app.post('/register', async (req, res) => {
  const { first_name, last_name, address, credit_card_info, phone_number, email, password } = req.body;
  
  // Check if the email already exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' }); // Check if the email is already registered
    }
    
    // Hash the password using bcrypt with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the 'users' table
    db.query(
      'INSERT INTO users (first_name, last_name, address, credit_card_info, phone_number, email, password, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, address, credit_card_info, phone_number, email, hashedPassword, 2], // 2 for user_type (assuming it means client)
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Client registration failed', error: err });
        }
        res.status(201).json({ message: 'Client registered successfully' });
      }
    );
  });
});



// User login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;  // Extract email and password from request body
  
  // Query the database for the user with the provided email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);  // Compare the provided password with the hashed password
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate a JWT token with the user ID and a secret key, valid for 3 hours
    const token = jwt.sign({ userId: user.client_id }, 'your_jwt_secret', { expiresIn: '3h' });
    
    // Send the JWT token and user data as the response
    res.json({
      token,
      user: {
        id: user.client_id ,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type: user.user_type
      }
    });
  });
});



// Middleware function to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];  // Get the token from the 'Authorization' header
  
  if (!token) return res.status(401).json({ message: 'Access denied' });  // If no token is provided, deny access
  
  // Verify the JWT token
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });  // If the token is invalid, send a 403 error
    req.user = user;  // Store the decoded user data in the request object
    next();  // Proceed to the next middleware/route handler
  });
};

// Protected route that requires JWT authentication
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the dashboard. You are authenticated!' });  // Send a success message if authentication is valid
});


app.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.userId;  // Extract userId from the decoded JWT token
  
  // Query the database to get the user data based on the userId
  db.query('SELECT username, email FROM users WHERE id = ?', [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'User not found' });  // Send error if user not found
    }
    
    // Send user profile data as response
    res.json({ username: result[0].username, email: result[0].email });
  });
});

// Route to get profile details from the Users table
app.get('/profileinfo', (req, res) => {
  const { clientId } = req.query; // Get clientId from query parameters
  
  // Query to fetch profile details from the 'Users' table
  const query = `
    SELECT client_id, first_name, last_name, address, credit_card_info, phone_number, email, user_type
    FROM Users
    WHERE client_id = ?;
  `;
  
  db.query(query, [clientId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch profile data', error: err });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json({ Profile: result[0] });
  });
});




// Insert a new request route
app.post('/requests', (req, res) => {
  const { client_id, property_address, square_feet, proposed_price, note, status } = req.body;
  
  // Insert the new request into the 'Requests' table without the 'pictures' field
  db.query(
    'INSERT INTO Requests (client_id, property_address, square_feet, proposed_price, note, status) VALUES (?, ?, ?, ?, ?, ?)',
    [client_id, property_address, square_feet, proposed_price, note, status],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to submit request', error: err });
      }
      res.status(200).json({ message: 'Request submitted successfully' });
    }
  );
});

// Backend for submitting a quote and updating the request status
app.post('/quote', (req, res) => {
  const { request_id, counter_price, work_time_start, work_time_end, note, status } = req.body;
  
  // Ensure that all required fields are provided
  if (!request_id || !counter_price || !work_time_start || !work_time_end || !status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
  // Start a transaction to ensure both operations are atomic
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to start transaction', error: err });
    }
    
    // Insert the quote into the 'Quotes' table
    db.query(
      'INSERT INTO Quotes (request_id, counter_price, work_time_start, work_time_end, note, status) VALUES (?, ?, ?, ?, ?, ?)',
      [request_id, counter_price, work_time_start, work_time_end, note, status],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: 'Failed to submit quote', error: err });
          });
        }
        
        // Update the status in the 'Requests' table
        db.query(
          'UPDATE Requests SET status = ? WHERE request_id = ?',
          [status, request_id],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Failed to update request status', error: err });
              });
            }
            
            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: 'Failed to commit transaction', error: err });
                });
              }
              
              res.status(200).json({ message: 'Quote submitted and request status updated successfully' });
            });
          }
        );
      }
    );
  });
});




// Combined requests and quotes route
app.get('/requests-and-quotes', (req, res) => {
  const { clientId, userType } = req.query;
  
  if (!userType) {
    return res.status(400).json({ message: 'userType is required' });
  }
  
  if (userType === '1') {
    // If David, fetch all requests and quotes
    const fetchAllRequests = 'SELECT * FROM requests';
    const fetchAllQuotes = 'SELECT * FROM Quotes';
    
    db.query(fetchAllRequests, (err, requestsResults) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch requests', error: err });
      }
      db.query(fetchAllQuotes, (err, quotesResults) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to fetch quotes', error: err });
        }
        res.status(200).json({ requests: requestsResults, quotes: quotesResults });
      });
    });
  } else if (userType === '2' && clientId) {
    // If Client, fetch their requests and related quotes
    const fetchClientRequests = 'SELECT * FROM requests WHERE client_id = ?';
    const fetchClientQuotes =
    'SELECT *, Q.status FROM Quotes Q JOIN Requests R ON R.request_id = Q.request_id WHERE R.client_id = ?';
    
    db.query(fetchClientRequests, [clientId], (err, requestsResults) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch requests', error: err });
      }
      db.query(fetchClientQuotes, [clientId], (err, quotesResults) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to fetch quotes', error: err });
        }
        res.status(200).json({ requests: requestsResults, quotes: quotesResults });
      });
    });
  } else {
    // If invalid userType or clientId is missing for clients
    res.status(400).json({ message: 'Invalid userType or missing clientId' });
  }
});




// Insert a new order route
app.post('/order', (req, res) => {
  const { client_id, quote_id, status } = req.body;
  
  // Ensure all required fields are provided
  if (!client_id || !quote_id || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Insert the new order into the 'Orders' table
  const query = `
    INSERT INTO Orders (quote_id, status)
    VALUES (?, ?)
  `;
  
  const values = [quote_id, status];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to submit order', error: err });
    }
    res.status(200).json({ message: 'Order submitted successfully', order_id: result.insertId });
  });
});


// Fetch orders route
app.get('/orders', (req, res) => {
  const { clientId, userType } = req.query;
  
  if (!userType) {
    return res.status(400).json({ message: 'userType is required' });
  }
  
  if (userType === '1') {
    // If Admin, fetch all orders
    const fetchAllOrders = 'SELECT * FROM Orders';
    
    db.query(fetchAllOrders, (err, ordersResults) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch orders', error: err });
      }
      res.status(200).json({ orders: ordersResults });
    });
  } else if (userType === '2' && clientId) {
    // If Client, fetch their orders
    const fetchClientOrders = 'SELECT *, O.status FROM Orders O JOIN Quotes Q ON Q.quote_id = O.quote_id JOIN Requests R ON R.request_id = Q.request_id WHERE R.client_id = ?';
    
    db.query(fetchClientOrders, [clientId], (err, ordersResults) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch orders', error: err });
      }
      res.status(200).json({ orders: ordersResults });
    });
  } else {
    // If invalid userType or missing clientId for clients
    res.status(400).json({ message: 'Invalid userType or missing clientId' });
  }
});


// Insert a new bill route
app.post('/bill', (req, res) => {
  const { order_id, amount, status, note } = req.body;
  
  // Ensure all required fields are provided
  if (!order_id || !amount || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Insert the new bill into the 'Bills' table
  const query = `
    INSERT INTO Bills (order_id, amount, status, note)
    VALUES (?, ?, ?, ?)
  `;
  
  const values = [order_id, amount, status, note || null];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to create bill', error: err });
    }
    res.status(200).json({ message: 'Bill created successfully', bill_id: result.insertId });
  });
});


// Fetch bills route
app.get('/bills', (req, res) => {
  const { clientId, userType } = req.query;
  
  if (!userType) {
    return res.status(400).json({ message: 'userType is required' });
  }
  
  if (userType === '1') {
    // If Admin, fetch all bills
    const fetchAllBills = 'SELECT * FROM Bills';
    
    db.query(fetchAllBills, (err, billsResults) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch bills', error: err });
      }
      res.status(200).json({ bills: billsResults });
    });
  } else if (userType === '2' && clientId) {
    // If Client, fetch their bills
    const fetchClientBills = `
      SELECT B.*, O.status as order_status
      FROM Bills B
      JOIN Orders O ON O.order_id = B.order_id
      JOIN Quotes Q ON Q.quote_id = O.quote_id
      JOIN Requests R ON R.request_id = Q.request_id
      WHERE R.client_id = ?
    `;
    
    db.query(fetchClientBills, [clientId], (err, billsResults) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch bills', error: err });
      }
      res.status(200).json({ bills: billsResults });
    });
  } else {
    // If invalid userType or missing clientId for clients
    res.status(400).json({ message: 'Invalid userType or missing clientId' });
  }
});


// Update bill status route
app.put('/status/:bill_id', (req, res) => {
  const { bill_id } = req.params;
  const { status } = req.body;
  
  // Validate status
  if (!status || !['pending', 'paid', 'disputed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Valid statuses are "pending", "paid", or "disputed".' });
  }
  
  // Update the bill status in the 'Bills' table
  const query = `
    UPDATE Bills
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE bill_id = ?
  `;
  
  const values = [status, bill_id];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update bill status', error: err });
    }
    
    // If no rows were affected, return a 404 (bill not found)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    res.status(200).json({ message: 'Bill status updated successfully', bill_id: bill_id });
  });
});

// Get all orders (assuming you want to fetch orders specific to the client)
app.get('/orderNegotiation', (req, res) => {
  const { clientId, userType } = req.query;
  
  let fetchOrdersQuery = 'SELECT *, CONCAT(U.first_name, " ", U.last_name) as client_name FROM Orders O JOIN quotes Q ON Q.quote_id = O.quote_id JOIN Requests R ON R.request_id = Q.request_id JOIN users U ON U.client_id = R.client_id';
  if (userType === '2') { // Client-specific query
    fetchOrdersQuery += ` WHERE R.client_id = ?`;
  }
  
  db.query(fetchOrdersQuery, [clientId], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch orders', error: err });
    }
    res.status(200).json({ orders });
  });
});

app.get('/negotiations', (req, res) => {
  const fetchNegotiations = `
    SELECT 
    CONCAT(U.first_name, " ", U.last_name) as client_name,
      N.negotiation_id,
      N.type,
      N.parent_id,
      IFNULL(N.note, 'N/A') AS note,
      DATE_FORMAT(N.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
    FROM Negotiations N
    JOIN users U ON U.client_id = N.client_id
    ORDER BY N.parent_id, N.created_at DESC
  `;
  
  db.query(fetchNegotiations, (err, negotiations) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch negotiations', error: err });
    }
    
    // Group negotiations by parent_id
    const groupedNegotiations = negotiations.reduce((acc, negotiation) => {
      const { parent_id } = negotiation;
      if (!acc[parent_id]) {
        acc[parent_id] = [];
      }
      acc[parent_id].push(negotiation);
      return acc;
    }, {});
    
    // Convert the grouped object into an array for easy iteration in frontend
    const groupedNegotiationsArray = Object.keys(groupedNegotiations).map(parent_id => ({
      parent_id,
      negotiations: groupedNegotiations[parent_id]
    }));
    
    res.status(200).json({ negotiations: groupedNegotiationsArray });
  });
});



// Create a new negotiation
app.post('/negotiation', (req, res) => {
  const { type, parent_id, client_id, note } = req.body;
  
  if (!type || !parent_id || !note) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const query = `
    INSERT INTO Negotiations (type, parent_id, client_id, note)
    VALUES (?, ?, ?, ?)
  `;
  const values = [type, parent_id, client_id, note];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to create negotiation', error: err });
    }
    res.status(201).json({ message: 'Negotiation created successfully', negotiation_id: result.insertId });
  });
});

app.get('/reports', (req, res) => {
  const { clientId, userType, startDate } = req.query;
  
  // Define all queries
  const queries = {
    bigClients: `
      SELECT R.client_id, CONCAT(U.first_name, " ", U.last_name) as client_name, COUNT(*) as order_count
      FROM orders O
      JOIN quotes Q ON Q.quote_id = O.quote_id
      JOIN requests R ON R.request_id = Q.request_id
      JOIN users U ON U.client_id = R.client_id
      WHERE O.status = 'completed'
      GROUP BY R.client_id
      ORDER BY order_count DESC
    `,
    difficultClients: `
      SELECT 
  R.client_id, 
  CONCAT(U.first_name, " ", U.last_name) as client_name, 
  COUNT(R.request_id) as request_count
FROM requests R
JOIN users U ON U.client_id = R.client_id
WHERE R.client_id IN (
  SELECT client_id
  FROM requests
  GROUP BY client_id
  HAVING COUNT(*) = 3
)
AND R.client_id NOT IN (
  SELECT DISTINCT R.client_id
  FROM requests R
  JOIN quotes Q ON Q.request_id = R.request_id
)
GROUP BY R.client_id
    `,
    thisMonthQuotes: `
     SELECT Q.quote_id, R.client_id, Q.created_at, Q.status
  FROM quotes Q
  JOIN requests R ON Q.request_id = R.request_id
  WHERE Q.status = 'accepted'
  AND Q.created_at >= '2024-12-01' AND Q.created_at <= '2024-12-31'
    `,
    prospectiveClients: `
      SELECT U.client_id, CONCAT(U.first_name, ' ', U.last_name) AS client_name
    FROM users U
    WHERE U.client_id NOT IN (
      SELECT DISTINCT R.client_id
      FROM requests R
      JOIN quotes Q ON Q.request_id = R.request_id
    )
    `,
    largestDriveway: `
      SELECT R.property_address, MAX(R.square_feet) AS largest_square_feet
      FROM requests R
      JOIN quotes Q ON Q.request_id = R.request_id
      JOIN orders O ON O.quote_id = Q.quote_id
      WHERE O.status = 'completed'
      GROUP BY R.property_address
      HAVING MAX(R.square_feet) = (
        SELECT MAX(R.square_feet)
        FROM requests R
          JOIN quotes Q ON Q.request_id = R.request_id
      JOIN orders O ON O.quote_id = Q.quote_id
        WHERE O.status = 'completed'
      )
    `,
    overdueBills: `
      SELECT B.bill_id, R.client_id, B.amount, Q.work_time_end AS due_date, B.status
FROM bills B
JOIN orders O ON O.order_id = B.order_id
JOIN quotes Q ON Q.quote_id = O.quote_id
JOIN requests R ON R.request_id = Q.request_id
WHERE B.created_at <= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
AND B.status != 'paid';

    `,
    badClients: `
    SELECT DISTINCT R.client_id, CONCAT(U.first_name, " ", U.last_name) as client_name
FROM bills B
JOIN orders O ON O.order_id = B.order_id
JOIN quotes Q ON Q.quote_id = O.quote_id
JOIN requests R ON R.request_id = Q.request_id
JOIN users U ON U.client_id = R.client_id
WHERE B.status != 'paid' 
  AND B.created_at <= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
  AND R.client_id NOT IN (
    SELECT R.client_id
    FROM bills B
    JOIN orders O ON O.order_id = B.order_id
    JOIN quotes Q ON Q.quote_id = O.quote_id
    JOIN requests R ON R.request_id = Q.request_id
    WHERE B.status = 'paid'
  )
  `,
  goodClients: `
  SELECT DISTINCT R.client_id, CONCAT(U.first_name, " ", U.last_name) as client_name, 
         SUM(B.amount) as amount_paid
  FROM bills B
  JOIN orders O ON O.order_id = B.order_id
  JOIN quotes Q ON Q.quote_id = O.quote_id
  JOIN requests R ON R.request_id = Q.request_id
  JOIN users U ON U.client_id = R.client_id
  WHERE B.status = 'paid' AND TIMESTAMPDIFF(HOUR, B.created_at, B.updated_at) <= 24
  GROUP BY R.client_id, U.first_name, U.last_name
`,
activeOrders: `
SELECT 
  O.order_id, 
  O.status, 
  Q.work_time_start, 
  Q.work_time_end, 
  R.property_address 
FROM orders O
JOIN quotes Q ON O.quote_id = Q.quote_id
JOIN requests R ON Q.request_id = R.request_id
WHERE O.status IN ('scheduled', 'in_progress')
`,
pendingQuoteRequests: `
      SELECT 
        R.request_id, 
        R.client_id, 
        R.property_address, 
        R.square_feet, 
        R.proposed_price, 
        R.created_at 
      FROM requests R
      LEFT JOIN quotes Q ON R.request_id = Q.request_id
      WHERE Q.quote_id IS NULL
    `,
    pendingBills: `
      SELECT 
        B.bill_id, 
        B.amount, 
        B.status, 
        B.created_at 
      FROM bills B
      WHERE B.status = 'pending'
    `,
    revenueReport: `
    SELECT 
  SUM(B.amount) AS total_revenue, 
  COUNT(B.bill_id) AS total_bills 
FROM bills B
WHERE B.status = 'paid' 
  `,
  allBills: `
  SELECT * 
FROM bills; 
`,
    
  };
  
  // Store results for all queries
  const results = {};
  
  // Function to run each query
  const runQuery = (queryKey) => {
    return new Promise((resolve, reject) => {
      db.query(queries[queryKey], (err, queryResults) => {
        if (err) {
          return reject({ message: `Failed to fetch report: ${queryKey}`, error: err });
        }
        results[queryKey] = queryResults;
        resolve();
      });
    });
  };
  
  // Execute all queries concurrently
  const queryPromises = Object.keys(queries).map(runQuery);
  
  Promise.all(queryPromises)
  .then(() => {
    // Once all queries are done, send all the results
    res.status(200).json({ results });
  })
  .catch((err) => {
    // If any query fails, return an error
    res.status(500).json({ message: err.message, error: err.error });
  });
});

