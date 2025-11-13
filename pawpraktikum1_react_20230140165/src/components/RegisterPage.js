import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('mahasiswa');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            // Mengirim data ke endpoint POST /api/auth/register
            await axios.post('http://localhost:5000/api/auth/register', {
                nama,
                email,
                password,
                role
            });

            setSuccess("Registrasi Berhasil! Mengarahkan ke halaman login...");
            // Arahkan ke halaman /login setelah sukses
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response ? err.response.data.message : 'Registrasi gagal');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center pt-16">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-600">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    Daftar Akun Baru
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input Nama */}
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama:</label>
                        <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                    </div>
                    {/* Input Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                    </div>
                    {/* Input Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                    </div>
                    {/* Input Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition">
                        Register
                    </button>
                </form>

                {error && (<p className="text-red-600 text-sm mt-4 text-center">{error}</p>)}
                {success && (<p className="text-green-600 text-sm mt-4 text-center">{success}</p>)}

                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;