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
        const symbol = input.value.trim().toUpperCase();

        if (!symbol) return;

        if (this.cryptos.find(c => c.symbol === symbol)) {
            alert('This cryptocurrency is already being tracked');
            return;
        }

        const crypto = {
            symbol: symbol,
            price: 'Loading...',
            lastUpdated: new Date()
        };

        this.cryptos.push(crypto);
        this.renderCryptos();
        this.saveCryptos();
        this.fetchPrice(symbol);
        input.value = '';
    }

    renderCryptos() {
        const container = document.getElementById('crypto-container');

        if (this.cryptos.length === 0) {
            container.innerHTML = '<p class="empty-message">No cryptocurrencies added yet</p>';
            return;
        }

        container.innerHTML = this.cryptos.map(crypto => `
            <div class="crypto-card">
                <div class="crypto-header">
                    <span class="crypto-symbol">${crypto.symbol}</span>
                    <span class="crypto-price ${crypto.price === 'Loading...' || crypto.price === 'Error' ? 'loading' : ''}">${this.formatPrice(crypto.price)}</span>
                </div>
                <button onclick="tracker.removeCrypto('${crypto.symbol}')" style="background: #e53e3e; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Remove</button>
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
                    crypto.price = data.price;
                    crypto.lastUpdated = new Date();
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
}

const tracker = new PriceTracker();