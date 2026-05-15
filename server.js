require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

// Middlewares
const loggerMiddleware = require('./middlewares/logger.middleware');
const globalErrorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/notFound.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const incidentRoutes = require('./routes/incident.routes');


const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// ─── Security Middlewares ────────────────────────────────────────
// helmet: Sets various HTTP headers to secure the app (XSS protection, content-type sniffing, etc.)
app.use(helmet());

// cors: Allows cross-origin requests from the frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// rate limiting: Prevents brute-force attacks and DDoS by limiting requests per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
app.use('/api', limiter);

// ─── Body Parsing & Performance ──────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// compression: Compresses response bodies to improve transfer speed
app.use(compression());

// Custom logger
app.use(loggerMiddleware);

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback for proxy stripping /api
app.use('/api/incidents', incidentRoutes);

// Base route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Real-Time Incident Reporting System API'
    });
});

// Handle undefined routes (404)
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Start Server after connecting to DB
const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

