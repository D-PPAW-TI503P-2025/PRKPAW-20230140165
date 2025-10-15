import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. Definisikan state untuk menyimpan nama pengguna.
  //    useState('') akan membuat variabel 'nama' dengan nilai awal kosong.
  const [nama, setNama] = useState('');

  // 2. Fungsi ini akan dipanggil setiap kali ada perubahan pada input.
  //    event.target.value mengambil nilai dari input teks.
  const handleInputChange = (event) => {
    setNama(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplikasi Sederhana React</h1>
        
        {/* 3. Buat input teks */}
        <input 
          type="text"
          placeholder="Masukkan nama Anda"
          value={nama} // Nilai input terikat ke state 'nama'
          onChange={handleInputChange} // Panggil fungsi saat ada perubahan
        />

        {/* 4. Tampilkan pesan 'Hello, [nama]!' */}
        <h2>Hello, {nama}!</h2>
      </header>
    </div>
  );
}

export default App;