const express = require("express"); 
const cors = require("cors");
const app = express(); 
const PORT = 5000 
const morgan = require("morgan");
const presensiRoutes = require("./routes/presensi");
const authRoutes = require('./routes/auth');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use("/api/presensi", presensiRoutes);
app.use(morgan("dev"));
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});