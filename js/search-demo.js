class TopSearchDemo {
    constructor(options) {
        this.inputElement = document.getElementById(options.inputId);
        this.suggestionsElement = document.getElementById(options.suggestionsId);
        this.continuous = options.continuous || false;
        this.highlightLoop = options.highlightLoop || false;
        this.demos = [];
        this.currentDemoIndex = 0;
        this.isTyping = false;
        this.typingSpeed = 150;
        this.highlightTimeout = null;
    }

    addDemo(keyword, target) {
        this.demos.push({ keyword, target });
    }

    async start() {
        do {
            for (let i = 0; i < this.demos.length; i++) {
                this.currentDemoIndex = i;
                await this.runCurrentDemo();
                await new Promise(resolve => setTimeout(resolve, 3000)); // Increased pause
            }
        } while (this.continuous);
    }

    async runCurrentDemo() {
        const demo = this.demos[this.currentDemoIndex];
        await this.typeText(demo.keyword);
        await this.showSuggestions(demo.keyword, demo.target);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.clearDemo();
    }

    async typeText(text) {
        this.isTyping = true;
        for (let i = 0; i < text.length; i++) {
            if (!this.isTyping) break;
            this.inputElement.value = text.substring(0, i + 1);
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
        this.isTyping = false;
    }

    async showSuggestions(keyword, target) {
        // Generate suggestions around the target
        const suggestions = this.generateSuggestions(keyword, target);

        // Clear existing suggestions
        this.suggestionsElement.innerHTML = '';

        // Add each suggestion with animation
        for (let i = 0; i < suggestions.length; i++) {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            // Bold the matching part of the suggestion
            const suggestion = suggestions[i];
            const index = suggestion.toLowerCase().indexOf(keyword.toLowerCase());
            if (index !== -1) {
                const before = suggestion.substring(0, index);
                const match = suggestion.substring(index, index + keyword.length);
                const after = suggestion.substring(index + keyword.length);
                div.innerHTML = before + '<b>' + match + '</b>' + after;
            } else {
                div.textContent = suggestion;
            }
            
            // Add highlight class for target
            if (suggestion === target) {
                div.classList.add('highlight');
            }
            
            this.suggestionsElement.appendChild(div);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Clear any existing highlight timeout
        if (this.highlightTimeout) {
            clearTimeout(this.highlightTimeout);
        }

        // Start highlight animation after a short delay
        this.highlightTimeout = setTimeout(() => {
            if (this.highlightLoop) {
                this.startHighlightLoop();
            }
        }, 500);
    }

    generateSuggestions(keyword, target) {
        // Always put target in the middle
        const baseSuggestions = [
            keyword + " near me",
            keyword + " reviews",
            target, // Target in the middle
            keyword + " cost",
            keyword + " services"
        ];

        return baseSuggestions;
    }

    startHighlightLoop() {
        const highlights = this.suggestionsElement.querySelectorAll('.highlight');
        highlights.forEach(el => {
            // Remove any existing animation
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null; // Remove the none
            el.classList.remove('highlight');
            void el.offsetWidth; // Trigger reflow
            el.classList.add('highlight');
        });
    }

    async clearDemo() {
        // Clear any existing highlight timeout
        if (this.highlightTimeout) {
            clearTimeout(this.highlightTimeout);
        }
        this.inputElement.value = '';
        this.suggestionsElement.innerHTML = '';
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    stop() {
        this.isTyping = false;
        this.continuous = false;
        if (this.highlightTimeout) {
            clearTimeout(this.highlightTimeout);
        }
    }
}
