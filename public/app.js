class PriceTracker {
    constructor() {
        this.cryptos = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedCryptos();
        this.startPriceUpdates();
    }

    bindEvents() {
        const addBtn = document.getElementById('add-btn');
        const cryptoInput = document.getElementById('crypto-input');

        addBtn.addEventListener('click', () => this.addCrypto());
        cryptoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCrypto();
            }
        });
    }

    addCrypto() {
        const input = document.getElementById('crypto-input');
        const alertInput = document.getElementById('alert-input');
        const symbol = input.value.trim().toUpperCase();
        const alertPrice = parseFloat(alertInput.value) || null;

        if (!symbol) return;

        if (this.cryptos.find(c => c.symbol === symbol)) {
            alert('This cryptocurrency is already being tracked');
            return;
        }

        const crypto = {
            symbol: symbol,
            price: 'Loading...',
            alertPrice: alertPrice,
            alertTriggered: false,
            lastUpdated: new Date()
        };

        this.cryptos.push(crypto);
        this.renderCryptos();
        this.saveCryptos();
        this.fetchPrice(symbol);
        input.value = '';
        alertInput.value = '';
    }

    renderCryptos() {
        const container = document.getElementById('crypto-container');

        if (this.cryptos.length === 0) {
            container.innerHTML = '<p class="empty-message">No cryptocurrencies added yet</p>';
            return;
        }

        container.innerHTML = this.cryptos.map(crypto => `
            <div class="crypto-card ${crypto.alertPrice && crypto.alertTriggered ? 'alert-active' : ''}">
                <div class="crypto-header">
                    <span class="crypto-symbol">
                        ${crypto.symbol}
                        ${crypto.alertPrice ? `<span class="alert-indicator">Alert: $${crypto.alertPrice}</span>` : ''}
                    </span>
                    <span class="crypto-price ${this.getPriceClass(crypto.price)}">${this.formatPrice(crypto.price)}</span>
                </div>
                <div class="crypto-meta">
                    Last updated: ${this.formatTime(crypto.lastUpdated)}
                </div>
                ${crypto.alertTriggered ? `<div class="price-alert">🚨 Price alert triggered!</div>` : ''}
                <button onclick="tracker.removeCrypto('${crypto.symbol}')" class="remove-btn">Remove</button>
            </div>
        `).join('');
    }

    removeCrypto(symbol) {
        this.cryptos = this.cryptos.filter(c => c.symbol !== symbol);
        this.renderCryptos();
        this.saveCryptos();
    }

    saveCryptos() {
        localStorage.setItem('trackedCryptos', JSON.stringify(this.cryptos));
    }

    loadSavedCryptos() {
        const saved = localStorage.getItem('trackedCryptos');
        if (saved) {
            this.cryptos = JSON.parse(saved);
            this.renderCryptos();
        }
    }

    async fetchPrice(symbol) {
        try {
            const response = await fetch(`/api/price/${symbol}`);
            const data = await response.json();

            if (response.ok) {
                const crypto = this.cryptos.find(c => c.symbol === symbol);
                if (crypto) {
                    const oldPrice = crypto.price;
                    crypto.price = data.price;
                    crypto.lastUpdated = new Date();

                    this.checkPriceAlert(crypto, oldPrice);
                    this.renderCryptos();
                    this.saveCryptos();
                }
            } else {
                const crypto = this.cryptos.find(c => c.symbol === symbol);
                if (crypto) {
                    crypto.price = 'Error';
                    this.renderCryptos();
                }
            }
        } catch (error) {
            console.error('Error fetching price:', error);
            const crypto = this.cryptos.find(c => c.symbol === symbol);
            if (crypto) {
                crypto.price = 'Error';
                this.renderCryptos();
            }
        }
    }

    async updateAllPrices() {
        if (this.cryptos.length === 0) return;

        for (const crypto of this.cryptos) {
            if (crypto.price === 'Loading...' || crypto.price === 'Error') continue;
            await this.fetchPrice(crypto.symbol);
        }
    }

    startPriceUpdates() {
        setInterval(() => {
            this.updateAllPrices();
        }, 30000);
    }

    formatPrice(price) {
        if (typeof price === 'number') {
            return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
        }
        return price;
    }

    getPriceClass(price) {
        if (price === 'Loading...') return 'loading';
        if (price === 'Error') return 'error';
        return '';
    }

    formatTime(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }

    checkPriceAlert(crypto, oldPrice) {
        if (!crypto.alertPrice || typeof crypto.price !== 'number') return;

        const wasBelow = typeof oldPrice === 'number' && oldPrice < crypto.alertPrice;
        const isNowAbove = crypto.price >= crypto.alertPrice;
        const wasAbove = typeof oldPrice === 'number' && oldPrice >= crypto.alertPrice;
        const isNowBelow = crypto.price < crypto.alertPrice;

        if ((wasBelow && isNowAbove) || (wasAbove && isNowBelow)) {
            crypto.alertTriggered = true;
            this.showNotification(`${crypto.symbol} price alert!`,
                `${crypto.symbol} is now $${crypto.price} (target: $${crypto.alertPrice})`);
        }
    }

    showNotification(title, message) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }

        alert(`${title}\n${message}`);
    }
}

const tracker = new PriceTracker();