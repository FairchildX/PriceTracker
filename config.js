module.exports = {
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    api: {
        coingecko: {
            baseUrl: process.env.COINGECKO_API_BASE || 'https://api.coingecko.com/api/v3'
        }
    },
    client: {
        updateInterval: parseInt(process.env.PRICE_UPDATE_INTERVAL) || 30000
    }
};