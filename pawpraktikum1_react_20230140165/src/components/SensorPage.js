import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/iot/latest', {
        params: { limit: 20 }
      });
      
      console.log('Response dari server:', response.data);
      
      const dataSensor = Array.isArray(response.data) ? response.data : response.data.data;
      
      if (!dataSensor || dataSensor.length === 0) {
        console.log('Tidak ada data sensor');
        setLoading(false);
        return;
      }

      const reversedData = [...dataSensor].reverse();

      const labels = reversedData.map(item => 
        new Date(item.createdAt).toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })
      );
      
      const dataSuhu = reversedData.map(item => item.suhu);
      const dataLembab = reversedData.map(item => item.kelembaban);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: dataSuhu,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Kelembaban (%)',
            data: dataLembab,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.2,
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data sensor:", err);
      console.error("Error detail:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  // Panggil data pertama kali & set Auto Refresh tiap 10 detik
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Auto refresh setiap 10 detik

    return () => clearInterval(interval);
  }, []);

  // Opsi tampilan grafik
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monitoring Suhu & Kelembaban Real-time' },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard IoT</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : chartData.labels.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data sensor. Kirim data dari IoT device terlebih dahulu.</p>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>

      {/* Info Auto Refresh */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>⏱️ Auto refresh setiap 10 detik</p>
        <button 
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          🔄 Refresh Manual
        </button>
      </div>
    </div>
  );
}

export default SensorPage;