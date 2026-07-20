const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Chess.com API endpoint
const CHESS_COM_API = 'https://api.chess.com/pub/user';

// Route to fetch Chess.com user profile
app.get('/api/chess-profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username || username.trim() === '') {
            return res.status(400).json({ error: 'Username is required' });
        }

        const response = await fetch(`${CHESS_COM_API}/${username}`);
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: 'User not found. Check the username and try again.' 
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching Chess.com profile:', error);
        res.status(500).json({ error: 'Error loading profile. Please try again later.' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
