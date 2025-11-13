import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigasi (untuk kemudahan testing) */}
        <nav className="p-4 bg-gray-800 text-white shadow-md">
          <Link to="/login" className="mr-6 hover:text-blue-400 transition">Login</Link>
          <Link to="/register" className="hover:text-blue-400 transition">Register</Link>
        </nav>

        {/* Definisi Routes */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Default route akan mengarah ke Login */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;