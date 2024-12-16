import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importing routing components from react-router-dom
import HomePage from './HomePage';  // Importing the HomePage component
import Login from './Login';  // Importing the Login component
import Register from './Register';  // Importing the Register component
import Dashboard from './Dashboard';  // Importing the Dashboard component
import Profile from './Profile';  // Importing the Profile component
import QuotesPage from './quotes';  // Importing the QuotesPage component
import NegotiationsPage from './negotiations';  // Importing the NegotiationsPage component
import OrdersPage from './orders';  // Importing the OrdersPage component
import BillsPage from './bills';  // Importing the BillsPage component
import ReportsPage from './reports';  // Importing the BillsPage component
import PrivateRoute from './PrivateRoute';  // Importing the PrivateRoute component for protected routes

function App() {
  return (
    <Router>  {/* BrowserRouter provides the routing context to the application */}
    <Routes>  {/* Defines the routing paths for the application */}
    
    {/* Public routes */}
    <Route path="/" element={<HomePage />} />  {/* Route for HomePage (accessible to everyone) */}
    <Route path="/login" element={<Login />} />  {/* Route for Login (accessible to everyone) */}
    <Route path="/register" element={<Register />} />  {/* Route for Register (accessible to everyone) */}
    
    {/* Private routes */}
    <Route
    path="/dashboard"
    element={
      <PrivateRoute>
      <Dashboard />  {/* Renders Dashboard if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    <Route
    path="/profile"
    element={
      <PrivateRoute>
      <Profile />  {/* Renders Profile if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    {/* Routes for Quotes, Orders, and Bills (these should be inside the dashboard for relevant users) */}
    <Route
    path="/quotes"
    element={
      <PrivateRoute>
      <QuotesPage />  {/* Renders QuotesPage if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    <Route
    path="/orders"
    element={
      <PrivateRoute>
      <OrdersPage />  {/* Renders OrdersPage if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    <Route
    path="/bills"
    element={
      <PrivateRoute>
      <BillsPage />  {/* Renders BillsPage if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    <Route
    path="/negotiations"
    element={
      <PrivateRoute>
      <NegotiationsPage />  {/* Renders BillsPage if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    <Route
    path="/reports"
    element={
      <PrivateRoute>
      <ReportsPage />  {/* Renders BillsPage if user is authenticated */}
      </PrivateRoute>
    }
    />
    
    </Routes>
    
    
    
    </Router>
  );
}

export default App;
