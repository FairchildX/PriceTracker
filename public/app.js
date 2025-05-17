class PriceTracker {
    constructor() {
        this.cryptos = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedCryptos();
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
                    <span class="crypto-price loading">${crypto.price}</span>
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
}

const tracker = new PriceTracker();