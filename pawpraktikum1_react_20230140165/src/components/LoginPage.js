import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // Mengirim data login ke backend
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: password
            });

            const token = response.data.token;
            localStorage.setItem('token', token); // Menyimpan token
            navigate('/dashboard'); // Mengarahkan ke Dashboard
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Login gagal');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center pt-16">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    Login Aplikasi
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition">
                        Login
                    </button>
                </form>
                {error && (<p className="text-red-600 text-sm mt-4 text-center">{error}</p>)}

                <p className="mt-4 text-center text-sm text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">Register di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;