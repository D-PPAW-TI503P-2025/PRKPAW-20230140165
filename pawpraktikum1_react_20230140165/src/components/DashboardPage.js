import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
    const navigate = useNavigate();

    // Tugas 3: Implementasi Fungsi Logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Menghapus token dari localStorage
        navigate('/login'); // Mengarahkan kembali ke halaman /login
    };

    // Opsional: Cek status login
    if (!localStorage.getItem('token')) {
        navigate('/login');
        return <p className="text-center mt-20">Mengalihkan ke halaman Login...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-12 rounded-xl shadow-2xl text-center border-t-8 border-indigo-500">
                <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
                    Selamat Datang!
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                    Anda berhasil masuk ke Dashboard.
                </p>
                <p className="text-md text-gray-500 mb-8">
                    Ini membuktikan JWT Anda valid dan tersimpan.
                </p>

                {/* Tugas 2: Tombol Logout */}
                <button
                    onClick={handleLogout}
                    className="py-3 px-8 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 uppercase tracking-wider"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DashboardPage;