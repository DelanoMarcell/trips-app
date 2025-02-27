import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/auth/Login';
import Registration from './components/auth/Register';
import Dashboard from './pages/admin/Dashboard';

import CreateTrip from './pages/admin/CreateTrips';
import ForgotPassword from './components/auth/forgotPassword'
import ManageTrips from './pages/admin/ManageTrips';
import Requests from './pages/admin/TripRequest';
import ProtectedRoute from './components/ProtectedAdminRoute';
import TripRequest from './pages/admin/TripRequest';
import RequestedTrips from './pages/Users/RequestedTripsPage';
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
       



        <Route path="/register" element={<Registration />} />


        <Route element={<ProtectedRoute requiredRole="User" />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/requestedtrips" element={<RequestedTrips/>} />

        </Route>


        <Route path="/trip-request" element={<TripRequest />} />
        <Route element={<ProtectedRoute requiredRole="Admin" />}>
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