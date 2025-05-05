const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const nftRoutes = require('./routes/nft');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    })
);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('connected successfully'))
    .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nft', nftRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('NFT Minting API is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
