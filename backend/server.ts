
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import resourceRoutes from './routes/resources';
import bookingRoutes from './routes/bookings';

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 5000; // Isay fix kar dein taake clash na ho

// Middleware
// app.use(cors({
//   origin: 'http://localhost:3001', 
//   credentials: true
// }));

app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[SERVER] ITU Resource Booking API running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
