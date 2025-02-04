import { useState } from 'react'
import { BrowserRouter as Router,  Routes, Route , useNavigate} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './components/Home'
import About from './components/About'
import Dashboard from './pages/admin/Dashboard'
import CreateTrip from './pages/admin/CreateTrips'

function App() {

  return(
    <Router>
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-trip" element={<CreateTrip />} />
    </Routes>
  </Router>
  );
 
}

export default App
