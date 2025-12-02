import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    let user = null;
    let userName = 'Guest';
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            user = decoded;
            userName = decoded.nama || 'User';
            isAdmin = decoded.role === 'admin'; 
        } catch (error) {
            localStorage.removeItem('token');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login'); 
    };

    
    if (!token) {
        return (
            <nav className="p-4 bg-gray-800 text-white shadow-md flex justify-end">
                <Link to="/login" className="mr-4 hover:text-blue-400">Login</Link>
                <Link to="/register" className="hover:text-blue-400">Register</Link>
            </nav>
        );
    }

    return (
        <nav className="p-4 bg-indigo-700 text-white shadow-lg flex justify-between items-center">
            <div className="flex space-x-6 items-center">
                <Link to="/dashboard" className="text-lg font-bold hover:text-indigo-200">Dashboard</Link>
                <Link to="/presensi" className="hover:text-indigo-200">Presensi</Link>
                
            
                {isAdmin && (
                    <Link to="/reports" className="hover:text-red-300 font-semibold">Laporan Admin</Link> 
                )}
            </div>

            <div className="flex items-center space-x-4">
                <span className="text-indigo-200">Selamat datang, **{userName}** ({user.role})</span>
                <button
                    onClick={handleLogout}
                    className="py-1 px-4 bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;