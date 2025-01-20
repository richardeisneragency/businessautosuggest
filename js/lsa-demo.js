class LSADemo {
    constructor(options = {}) {
        this.container = document.getElementById(options.containerId);
        this.searchInput = null;
        this.resultsContainer = null;
        this.isTyping = false;
        this.typingSpeed = 150;
        this.initializeDemo();
    }

    initializeDemo() {
        // Create Google-like interface
        this.container.innerHTML = `
            <div class="lsa-demo-wrapper">
                <div class="google-header">
                    <div class="google-logo">
                        <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
                    </div>
                    <div class="search-bar">
                        <input type="text" id="lsa-search-input" value="">
                        <div class="search-icons">
                            <span class="material-icons">search</span>
                        </div>
                    </div>
                </div>
                <div class="search-results">
                    <div class="results-stats">About 15 results (0.48 seconds)</div>
                    <div class="lsa-section">
                        <div class="lsa-header">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMWE3M2U4IiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=" alt="Google Guaranteed" class="google-guaranteed-icon">
                            <span>Google Guaranteed</span>
                        </div>
                        <div class="lsa-results"></div>
                    </div>
                    <div class="organic-results">
                        <div class="organic-result">
                            <div class="result-url">https://roofingcompany.com</div>
                            <h3>Professional Roofing Services in Tallahassee, FL</h3>
                            <p>Expert roofing contractors serving Tallahassee and surrounding areas. Free estimates, quality workmanship, and competitive pricing.</p>
                        </div>
                        <div class="organic-result">
                            <div class="result-url">https://tallahasseeroofing.net</div>
                            <h3>Top-Rated Roofing Company - Tallahassee Roofers</h3>
                            <p>Local roofing experts with over 20 years of experience. Licensed, insured, and BBB accredited. Emergency repairs available.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .lsa-demo-wrapper {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
            }

            .google-header {
                background: white;
                padding: 20px;
                border-bottom: 1px solid #dfe1e5;
            }

            .google-logo {
                font-size: 24px;
                margin-bottom: 20px;
            }

            .search-bar {
                position: relative;
                max-width: 600px;
                margin: 0 auto;
            }

            .search-bar input {
                width: 100%;
                padding: 12px 50px 12px 20px;
                font-size: 16px;
                border: 1px solid #dfe1e5;
                border-radius: 24px;
                outline: none;
            }

            .search-icons {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #4285f4;
            }

            .search-results {
                padding: 20px;
                background: white;
            }

            .results-stats {
                color: #70757a;
                font-size: 14px;
                margin-bottom: 20px;
            }

            .lsa-section {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 30px;
            }

            .lsa-header {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                color: #1a73e8;
                font-size: 14px;
            }

            .google-guaranteed-icon {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }

            .lsa-card {
                background: white;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }

            .lsa-card.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .business-info {
                display: flex;
                align-items: flex-start;
            }

            .business-details {
                flex: 1;
            }

            .business-name {
                font-size: 16px;
                font-weight: 500;
                color: #1a73e8;
                margin-bottom: 4px;
            }

            .business-rating {
                color: #fbbc05;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .business-meta {
                color: #70757a;
                font-size: 14px;
            }

            .organic-results {
                margin-top: 30px;
            }

            .organic-result {
                margin-bottom: 25px;
            }

            .result-url {
                color: #202124;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .organic-result h3 {
                color: #1a0dab;
                font-size: 20px;
                font-weight: normal;
                margin: 0 0 4px;
            }

            .organic-result p {
                color: #4d5156;
                font-size: 14px;
                line-height: 1.58;
                margin: 0;
            }
        `;
        document.head.appendChild(style);

        this.searchInput = document.getElementById('lsa-search-input');
        this.resultsContainer = this.container.querySelector('.lsa-results');

        // Start the demo
        this.startDemo();
    }

    async startDemo() {
        while (true) {
            // Clear previous state
            this.searchInput.value = '';
            this.resultsContainer.innerHTML = '';
            
            // Type the search query
            await this.typeText('Roofer Tallahassee');
            
            // Show LSA results
            await this.showResults();
            
            // Wait before restarting
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    async typeText(text) {
        for (let i = 0; i < text.length; i++) {
            this.searchInput.value = text.substring(0, i + 1);
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
    }

    async showResults() {
        const businesses = [
            {
                name: "Tallahassee Roofing Experts",
                rating: "4.9",
                reviews: "127",
                details: "Available 24/7 · 15+ years experience · Licensed & Insured",
                highlight: true,
                phone: "(850) 555-0123",
                address: "1234 Capital Circle, Tallahassee, FL"
            }
        ];

        // Clear existing results
        this.resultsContainer.innerHTML = '';

        // Add each business card with animation
        for (let i = 0; i < businesses.length; i++) {
            const business = businesses[i];
            const card = document.createElement('div');
            card.className = 'lsa-card';
            card.innerHTML = `
                <div class="business-info">
                    <div class="business-details">
                        <div class="business-name">${business.name}</div>
                        <div class="business-rating">★★★★★ ${business.rating} (${business.reviews} reviews)</div>
                        <div class="business-meta">${business.details}</div>
                        <div class="business-meta">${business.phone} · ${business.address}</div>
                    </div>
                </div>
            `;
            this.resultsContainer.appendChild(card);

            // Animate card entrance
            await new Promise(resolve => setTimeout(resolve, 300));
            card.classList.add('visible');
        }
    }
}
