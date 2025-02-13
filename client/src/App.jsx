import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/auth/Login';
import Registration from './components/auth/Register';
import Dashboard from './pages/admin/Dashboard';
import EmailVerified from './components/auth/VerificationSuccess';
import CreateTrip from './pages/admin/CreateTrips';
import ForgotPassword from './components/auth/forgotPassword'
import ManageTrips from './pages/admin/ManageTrips';
import Requests from './pages/admin/TripRequest';
import ProtectedRoute from './components/ProtectedAdminRoute';
import UserDashboard
 from './pages/Users/userDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/verificationsuccess" element={<EmailVerified/>} />

        <Route path="/register" element={<Registration />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/manage-trips" element={<ManageTrips />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;