import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    
    // API_URL dan BASE_URL untuk mengakses foto statis
    const API_URL = "http://localhost:5000/api/presensi/reports/daily"; 
    const BASE_URL = "http://localhost:5000/"; // <-- URL dasar untuk folder uploads/
    const TIMEZONE = "Asia/Jakarta";

    // Opsi waktu lengkap untuk format WIB yang konsisten
    const TIMEZONE_OPTIONS_FULL = { 
        timeZone: TIMEZONE, 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };


    const fetchReports = async (query = "") => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            
            // Buat URL dengan query parameter nama
            const url = `${API_URL}?nama=${query}`; 

            const response = await axios.get(url, config); 
            
            setReports(response.data); 
            setError(null); 

            console.log("Data Laporan Diterima:", response.data); 

        } catch (err) {
            const msg = err.response ? err.response.data.message : "Gagal memuat laporan.";
            setError(msg);
        }
    };

    useEffect(() => {
        fetchReports("");
    }, []); 
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReports(searchTerm);
    };
    
    // Helper untuk memformat waktu (dengan tanggal lengkap WIB)
    const formatTime = (time) => {
        if (!time) return "Belum Check-Out";
        try {
            return new Date(time).toLocaleString("id-ID", TIMEZONE_OPTIONS_FULL); 
        } catch (e) {
            return "Waktu Invalid";
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Laporan Presensi Harian
            </h1>

            <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
                >
                    Cari
                </button>
            </form>

            {error && (
                <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
            )}

            {!error && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti Foto</th> 
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reports.length > 0 ? (
                                reports.map((presensi) => (
                                    <tr key={presensi.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {presensi.User ? presensi.User.nama : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatTime(presensi.checkIn)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatTime(presensi.checkOut)}
                                        </td>
                                        
                                        {/* Tampilkan Latitude */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {presensi.latitude || 'N/A'}
                                        </td>
                                        {/* Tampilkan Longitude */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {presensi.longitude || 'N/A'}
                                        </td>

                                        {/* Kolom Bukti Foto (Thumbnail) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {presensi.buktiFoto && (
                                                <a href={`${BASE_URL}${presensi.buktiFoto}`} target="_blank" rel="noopener noreferrer">
                                                    <img 
                                                        src={`${BASE_URL}${presensi.buktiFoto}`} 
                                                        alt="Bukti Selfie" 
                                                        style={{ width: '50px', height: 'auto', cursor: 'pointer' }} 
                                                    />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ReportPage;