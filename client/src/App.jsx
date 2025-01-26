import { useState } from 'react'
import { BrowserRouter as Router,  Routes, Route , useNavigate} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './components/Home'
import About from './components/About'

function App() {

  return(
    <Router>
    <Routes>
      {/* Define your routes here */}
      <Route path="/home" element={<Home/>} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Router>
  );
 
}

export default App
