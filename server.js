require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/price/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${config.api.coingecko.baseUrl}/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);

        const symbolLower = symbol.toLowerCase();
        if (response.data[symbolLower]) {
            res.json({
                symbol: symbol.toUpperCase(),
                price: response.data[symbolLower].usd
            });
        } else {
            res.status(404).json({ error: 'Cryptocurrency not found' });
        }
    } catch (error) {
        console.error('Error fetching price:', error.message);
        res.status(500).json({ error: 'Failed to fetch price data' });
    }
});

app.get('/api/prices', async (req, res) => {
    try {
        const symbols = req.query.symbols ? req.query.symbols.split(',') : [];
        if (symbols.length === 0) {
            return res.json([]);
        }

        const symbolsQuery = symbols.map(s => s.toLowerCase()).join(',');
        const response = await axios.get(`${config.api.coingecko.baseUrl}/simple/price?ids=${symbolsQuery}&vs_currencies=usd`);

        const prices = symbols.map(symbol => {
            const symbolLower = symbol.toLowerCase();
            return {
                symbol: symbol.toUpperCase(),
                price: response.data[symbolLower] ? response.data[symbolLower].usd : null
            };
        });

        res.json(prices);
    } catch (error) {
        console.error('Error fetching prices:', error.message);
        res.status(500).json({ error: 'Failed to fetch price data' });
    }
});

app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
    console.log(`Environment: ${config.server.nodeEnv}`);
});