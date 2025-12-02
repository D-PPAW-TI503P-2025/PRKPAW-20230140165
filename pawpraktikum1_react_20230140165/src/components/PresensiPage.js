import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// [MODUL 9] Import komponen peta Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; 

const API_URL = "http://localhost:5000/api/presensi"; 
// Ganti toLocaleTimeString menjadi toLocaleString untuk menampilkan tanggal
const TIMEZONE_OPTIONS_FULL = { 
    timeZone: 'Asia/Jakarta', 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
};

function AttendancePage() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [checkInTime, setCheckInTime] = useState(null); 
    const [checkOutTime, setCheckOutTime] = useState(null); 
    
    const [coords, setCoords] = useState(null); 
    const [locationError, setLocationError] = useState(null); 
    
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("token");

    const createConfig = () => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return null;
        }
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const getLocation = () => {
        setLocationError(null);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({ 
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    setLocationError("Gagal mendapatkan lokasi: " + err.message);
                }
            );
        } else {
            setLocationError("Geolocation tidak didukung oleh browser ini.");
        }
    };
    
    useEffect(() => { 
        getLocation();
    }, []); 

    const handleCheckIn = async () => {
        if (!coords) {
            setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi."); 
            return;
        }

        const config = createConfig();
        if (!config) return;

        setError('');
        setMessage('');
        setCheckOutTime(null);
        setCheckInTime(null); 

        try {
            const response = await axios.post(
                `${API_URL}/check-in`, 
                { 
                    // [FIX KRITIS FINAL] Konversi ke String untuk stabilitas DECIMAL MySQL
                    latitude: String(coords.lat),  
                    longitude: String(coords.lng) 
                }, 
                config
            );
            
            const data = response.data.data;
            setMessage(response.data.message);
            
            if (data && data.checkIn) {
                setCheckInTime(new Date(data.checkIn));
            }

        } catch (err) {
            setError(err.response ? err.response.data.message : "Check-in gagal");
        }
    };

    const handleCheckOut = async () => {
        const config = createConfig();
        if (!config) return;

        setError("");
        setMessage("");
        setCheckInTime(null);
        setCheckOutTime(null); 

        try {
            const response = await axios.post(`${API_URL}/check-out`, {}, config);
            const data = response.data.data;

            setMessage(response.data.message);

            if (data && data.checkOut) {
                setCheckOutTime(new Date(data.checkOut));
            }

        } catch (err) {
            setError(err.response ? err.response.data.message : "Check-out gagal");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8">

            {locationError && ( /* Tampilkan error lokasi */
                <p className="text-red-600 mb-4 px-8 text-center">{locationError}</p>
            )}

            {/* [MODUL 9] Visualisasi Peta OSM */}
            {coords ? ( 
                <div className="my-4 border rounded-lg overflow-hidden w-full max-w-xl shadow-lg">
                    <MapContainer 
                        center={[coords.lat, coords.lng]} 
                        zoom={15} 
                        style={{ height: '300px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[coords.lat, coords.lng]}>
                            <Popup>Lokasi Presensi Anda</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            ) : (
                <div className="text-center p-4">
                    <p className="text-gray-600">Memuat lokasi atau menunggu izin...</p>
                </div>
            )}
            
            {/* Card Check-in/Check-out */}
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center my-4">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Lakukan Presensi</h2>

                {/* Tampilkan Waktu Check-In */}
                {checkInTime && (
                    <p className="text-blue-600 font-semibold mb-2">
                        Waktu Check-In Anda: {checkInTime.toLocaleString('id-ID', TIMEZONE_OPTIONS_FULL)}
                    </p>
                )}

                {/* TAMPILAN WAKTU CHECK-OUT */}
                {checkOutTime && (
                    <p className="text-red-600 font-semibold mb-4">
                        Waktu Check-Out Anda: {checkOutTime.toLocaleString('id-ID', TIMEZONE_OPTIONS_FULL)}
                    </p>
                )}
                
                {message && <p className="text-green-600 mb-4">{message}</p>}
                {error && <p className="text-red-600 mb-4">{error}</p>}
                

                <div className="flex space-x-4">
                    <button
                        onClick={handleCheckIn}
                        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
                    >
                        Check-In
                    </button>

                    <button
                        onClick={handleCheckOut}
                        className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
                    >
                        Check-Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;