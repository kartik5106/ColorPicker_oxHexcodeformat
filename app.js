// Color Picker Application
class ColorPicker {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.setDefaultColor('#283d46');
    }

    initializeElements() {
        // Get all DOM elements
        this.colorPicker = document.getElementById('colorPicker');
        this.hexInput = document.getElementById('hexInput');
        this.redSlider = document.getElementById('redSlider');
        this.greenSlider = document.getElementById('greenSlider');
        this.blueSlider = document.getElementById('blueSlider');
        this.redValue = document.getElementById('redValue');
        this.greenValue = document.getElementById('greenValue');
        this.blueValue = document.getElementById('blueValue');
        this.colorPreview = document.getElementById('colorPreview');
        this.oxOutput = document.getElementById('oxOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.copyFeedback = document.getElementById('copyFeedback');
    }

    initializeEventListeners() {
        // Color picker input
        this.colorPicker.addEventListener('input', (e) => {
            this.updateFromColorPicker(e.target.value);
        });

        // Hex input
        this.hexInput.addEventListener('input', (e) => {
            this.updateFromHexInput(e.target.value);
        });

        // RGB sliders
        this.redSlider.addEventListener('input', (e) => {
            this.updateFromRgbSliders();
        });

        this.greenSlider.addEventListener('input', (e) => {
            this.updateFromRgbSliders();
        });

        this.blueSlider.addEventListener('input', (e) => {
            this.updateFromRgbSliders();
        });

        // Copy button
        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Keyboard support for copy
        this.copyBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.copyToClipboard();
            }
        });
    }

    setDefaultColor(hexColor) {
        this.updateFromColorPicker(hexColor);
    }

    // Color format conversion utilities
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Handle 3-digit hex codes
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        if (hex.length !== 6) {
            return null;
        }

        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        return { r, g, b };
    }

    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    hexToOx(hex) {
        // Remove # if present and convert to 0x format
        return '0x' + hex.replace('#', '');
    }

    isValidHex(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Check if it's a valid 3 or 6 digit hex code
        const validHexRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;
        return validHexRegex.test(hex);
    }

    // Update methods for different input sources
    updateFromColorPicker(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (!rgb) return;

        this.updateAllInputs(hexColor, rgb);
    }

    updateFromHexInput(hexInput) {
        let hex = hexInput.trim();
        
        // Add # if not present
        if (hex && !hex.startsWith('#')) {
            hex = '#' + hex;
        }

        if (this.isValidHex(hex)) {
            const rgb = this.hexToRgb(hex);
            if (rgb) {
                this.updateAllInputs(hex, rgb);
            }
        }
    }

    updateFromRgbSliders() {
        const r = parseInt(this.redSlider.value);
        const g = parseInt(this.greenSlider.value);
        const b = parseInt(this.blueSlider.value);

        const hex = this.rgbToHex(r, g, b);
        this.updateAllInputs(hex, { r, g, b });
    }

    // Master update method that synchronizes all inputs
    updateAllInputs(hexColor, rgb) {
        // Update color picker
        this.colorPicker.value = hexColor;

        // Update hex input
        this.hexInput.value = hexColor;

        // Update RGB sliders and values
        this.redSlider.value = rgb.r;
        this.greenSlider.value = rgb.g;
        this.blueSlider.value = rgb.b;

        this.redValue.textContent = rgb.r;
        this.greenValue.textContent = rgb.g;
        this.blueValue.textContent = rgb.b;

        // Update color preview
        this.updateColorPreview(hexColor);

        // Update 0x output
        this.updateOxOutput(hexColor);
    }

    updateColorPreview(hexColor) {
        this.colorPreview.style.backgroundColor = hexColor;
    }

    updateOxOutput(hexColor) {
        const oxColor = this.hexToOx(hexColor);
        this.oxOutput.value = oxColor;
    }

    // Clipboard functionality
    async copyToClipboard() {
        try {
            const textToCopy = this.oxOutput.value;
            
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern clipboard API
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(textToCopy);
            }
            
            this.showCopyFeedback();
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // Try fallback method
            this.fallbackCopyToClipboard(this.oxOutput.value);
            this.showCopyFeedback();
        }
    }

    fallbackCopyToClipboard(text) {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (error) {
            console.error('Fallback copy failed:', error);
        }
        
        document.body.removeChild(textArea);
    }

    showCopyFeedback() {
        this.copyFeedback.classList.add('show');
        
        // Hide feedback after 2 seconds
        setTimeout(() => {
            this.copyFeedback.classList.remove('show');
        }, 2000);
    }

    // Utility method to get current color in different formats
    getCurrentColor() {
        const hex = this.colorPicker.value;
        const rgb = this.hexToRgb(hex);
        const ox = this.hexToOx(hex);

        return {
            hex,
            rgb,
            ox
        };
    }
}

// Initialize the color picker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = new ColorPicker();
    
    // Make it globally accessible for debugging
    window.colorPicker = colorPicker;
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+C or Cmd+C to copy when focused on the app
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const activeElement = document.activeElement;
        
        // Only trigger if we're focused on the app elements (not text inputs)
        if (activeElement && (
            activeElement.classList.contains('color-input') ||
            activeElement.classList.contains('slider') ||
            activeElement === document.body
        )) {
            e.preventDefault();
            if (window.colorPicker) {
                window.colorPicker.copyToClipboard();
            }
        }
    }
});