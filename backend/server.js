require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== ROUTES ====================
app.use('/api', require('./routes/api'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wedding Invitation API is running 💍',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'Ukuran file terlalu besar.' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ==================== START ====================
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server berjalan di port ${PORT}`);
    console.log(`💍 Wedding Invitation API siap\n`);
  });
}

startServer();
