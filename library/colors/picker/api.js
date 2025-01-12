class ColorPicker {
    constructor(container, options = {}) {
        this.container = document.querySelector(container);
        this.options = {
            width: options.width || 200,
            height: options.height || 200,
            defaultColor: options.defaultColor || "#000000"
        };
        this.color = this.options.defaultColor;
        this.init();
    }

    init() {
        this.createColorPickerUI();
        this.addEventListeners();
    }

    createColorPickerUI() {
        // Create canvas for color spectrum
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.style.border = "1px solid #ccc";
        this.canvas.style.cursor = "crosshair"; // Set cursor to crosshair
    
        this.container.appendChild(this.canvas);
    
        // Create preview box to show selected color
        this.previewBox = document.createElement("div");
        this.previewBox.style.width = "50px";
        this.previewBox.style.height = "50px";
        this.previewBox.style.marginTop = "10px";
        this.previewBox.style.border = "1px solid #000";
        this.previewBox.style.backgroundColor = this.color;
    
        this.container.appendChild(this.previewBox);
    
        // Create input to show selected color
        this.colorInput = document.createElement("input");
        this.colorInput.type = "text";
        this.colorInput.value = this.color;
        this.colorInput.style.marginTop = "10px";
    
        this.container.appendChild(this.colorInput);
    
        // Create additional info display (HEX, CMYK, HSL)
        this.infoBox = document.createElement("div");
        this.infoBox.style.marginTop = "10px";
    
        this.hexDisplay = document.createElement("p");
        this.hexDisplay.textContent = `HEX: ${this.color}`;
        this.infoBox.appendChild(this.hexDisplay);
    
        this.cmykDisplay = document.createElement("p");
        this.cmykDisplay.textContent = `CMYK: -`;
        this.infoBox.appendChild(this.cmykDisplay);
    
        this.hslDisplay = document.createElement("p");
        this.hslDisplay.textContent = `HSL: -`;
        this.infoBox.appendChild(this.hslDisplay);
    
        this.container.appendChild(this.infoBox);
    
        this.context = this.canvas.getContext("2d");
        this.drawColorSpectrum();
    }    

    drawColorSpectrum() {
        const ctx = this.context;
    
        // Step 1: Draw horizontal gradient for pure colors
        const colorGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        colorGradient.addColorStop(0, "red");
        colorGradient.addColorStop(0.17, "orange");
        colorGradient.addColorStop(0.34, "yellow");
        colorGradient.addColorStop(0.5, "green");
        colorGradient.addColorStop(0.67, "blue");
        colorGradient.addColorStop(0.84, "indigo");
        colorGradient.addColorStop(1, "violet");
    
        ctx.fillStyle = colorGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Step 2: Draw vertical gradient for white (top half)
        const whiteGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height / 2);
        whiteGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        whiteGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
        ctx.fillStyle = whiteGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height / 2);
    
        // Step 3: Draw vertical gradient for black (bottom half)
        const blackGradient = ctx.createLinearGradient(0, this.canvas.height / 2, 0, this.canvas.height);
        blackGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        blackGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    
        ctx.fillStyle = blackGradient;
        ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);
    }    

    addEventListeners() {
        this.canvas.addEventListener("click", (e) => this.pickColor(e));
        this.colorInput.addEventListener("input", (e) => this.updateColor(e));
    }

    pickColor(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const imageData = this.context.getImageData(x, y, 1, 1).data;
        this.color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

        this.updateUI(imageData[0], imageData[1], imageData[2]);
        this.container.dispatchEvent(new CustomEvent("colorChange", { detail: this.color }));
    }

    updateColor(event) {
        this.color = event.target.value;
        const rgb = this.hexToRgb(this.color);
        if (rgb) {
            this.updateUI(rgb.r, rgb.g, rgb.b);
            this.container.dispatchEvent(new CustomEvent("colorChange", { detail: this.color }));
        }
    }

    updateUI(r, g, b) {
        this.colorInput.value = this.color;
        this.previewBox.style.backgroundColor = this.color;

        const hex = this.rgbToHex(r, g, b);
        const cmyk = this.rgbToCmyk(r, g, b);
        const hsl = this.rgbToHsl(r, g, b);

        this.hexDisplay.textContent = `HEX: ${hex}`;
        this.cmykDisplay.textContent = `CMYK: ${cmyk}`;
        this.hslDisplay.textContent = `HSL: ${hsl}`;
    }

    rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    hexToRgb(hex) {
        const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (match) {
            return {
                r: parseInt(match[1], 16),
                g: parseInt(match[2], 16),
                b: parseInt(match[3], 16)
            };
        }
        return null;
    }

    rgbToCmyk(r, g, b) {
        const c = 1 - (r / 255);
        const m = 1 - (g / 255);
        const y = 1 - (b / 255);
        const k = Math.min(c, m, y);
        if (k === 1) return `0%, 0%, 0%, 100%`;
        return `${((c - k) / (1 - k) * 100).toFixed(1)}%, ${(m - k) / (1 - k) * 100}%, ${(y - k) / (1 - k) * 100}%, ${(k * 100).toFixed(1)}%`;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return `${(h * 360).toFixed(1)}°, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%`;
    }
}

export default ColorPicker;
