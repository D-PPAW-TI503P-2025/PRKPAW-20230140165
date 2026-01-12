const express = require("express"); 
const cors = require("cors");
const app = express(); 
const PORT = 5000;
const morgan = require("morgan");
const presensiRoutes = require("./routes/presensi");
const authRoutes = require('./routes/auth');
const path = require('path');
const iotRoutes = require("./routes/iot");

// ✅ MIDDLEWARE HARUS DI ATAS (sebelum routes)
app.use(cors());
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(morgan("dev"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ ROUTES DI BAWAH (setelah middleware)
app.use("/api/iot", iotRoutes);
app.use("/api/presensi", presensiRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});