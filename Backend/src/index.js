require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const itemsRoutes = require('./routes/items');
const { closeDB } = require('./config/db');
const smokeTest = require('./utils/smokeTest');
const { errorHandler, notFound } = require('./middleware/error');

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/items', itemsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// convenience endpoint to run smoke test from server process
app.post('/run-smoke', async (req, res) => {
  const ok = await smokeTest(`http://localhost:${PORT}`);
  res.json({ ok });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try { await closeDB(); } catch (e) { /* ignore */ }
  process.exit(0);
});
