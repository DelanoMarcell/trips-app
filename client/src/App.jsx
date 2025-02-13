import { Fragment, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './components/Home'
import About from './components/About'
import Login from './components/auth/Login'
import Registration from './components/auth/Register'
import Dashboard from './pages/admin/Dashboard'
import CreateTrip from './pages/admin/CreateTrips'
import ForgotPassword from './components/auth/forgotPassword'
import ManageTrips from './pages/admin/ManageTrips'
import TripsManagement from './pages/admin/ManageTrips'
import Requests from './pages/admin/TripRequest'
import ProtectedRoute from './components/ProtectedAdminRoute'
function App() {

  return (
    <Router>

        <Routes>
          {/* Define your routes here */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/register" element={<Registration />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/manage-trips" element={<TripsManagement />} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>

    </Router>
  );

}

export default App
