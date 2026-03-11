const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
// Note: These route files need to be created
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Interior Design CRM API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
