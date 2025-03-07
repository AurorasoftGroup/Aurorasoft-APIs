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
        // Style container
        this.container.style.fontFamily = "'eurosquare', sans-serif";
        this.container.style.width = `${this.options.width}px`;  // Ensure container width matches the color spectrum
        this.container.style.padding = "10px";
        this.container.style.border = "1px solid #ddd";
        this.container.style.borderRadius = "8px";
        this.container.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        this.container.style.backgroundColor = "#f9f9f9";

        // Create canvas for color spectrum
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.style.border = "1px solid #ccc";
        this.canvas.style.cursor = "crosshair";
        this.canvas.style.borderRadius = "4px";
        this.canvas.style.width = "100%";  // Make canvas width consistent with container width

        this.container.appendChild(this.canvas);

        // Create preview box
        this.previewBox = document.createElement("div");
        this.previewBox.style.width = "100%";  // Match the width of the container
        this.previewBox.style.height = "50px";
        this.previewBox.style.marginTop = "10px";
        this.previewBox.style.border = "1px solid #000";
        this.previewBox.style.borderRadius = "4px";
        this.previewBox.style.backgroundColor = this.color;

        this.container.appendChild(this.previewBox);

        // Create input fields container
        this.inputContainer = document.createElement("div");
        this.inputContainer.style.marginTop = "10px";
        this.inputContainer.style.display = "flex";
        this.inputContainer.style.flexDirection = "column";
        this.inputContainer.style.gap = "10px";

        // Create input for HEX
        this.hexInput = this.createStyledInput("HEX", this.color);
        this.inputContainer.appendChild(this.hexInput);

        // Create input for RGB
        this.rgbInput = this.createStyledInput("RGB (e.g., 255, 0, 0)", "");
        this.inputContainer.appendChild(this.rgbInput);

        // Create input for HSL
        this.hslInput = this.createStyledInput("HSL (e.g., 0, 100%, 50%)", "");
        this.inputContainer.appendChild(this.hslInput);

        this.container.appendChild(this.inputContainer);

        this.context = this.canvas.getContext("2d");
        this.drawColorSpectrum();
    }

    createStyledInput(placeholder, value) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = placeholder;
        input.value = value;
        input.style.width = "100%";  // Ensure input width matches container
        input.style.padding = "10px";
        input.style.border = "1px solid #ddd";
        input.style.borderRadius = "4px";
        input.style.fontSize = "14px";
        input.style.boxSizing = "border-box";
        input.style.outline = "none";
        input.style.backgroundColor = "#fff";
        input.style.transition = "border-color 0.3s";
        input.style.fontFamily = "'eurosquare', sans-serif";

        input.addEventListener("focus", () => {
            input.style.borderColor = "#007BFF";
        });

        input.addEventListener("blur", () => {
            input.style.borderColor = "#ddd";
        });

        return input;
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
        this.hexInput.addEventListener("input", (e) => this.updateFromHex(e));
        this.rgbInput.addEventListener("input", (e) => this.updateFromRgb(e));
        this.hslInput.addEventListener("input", (e) => this.updateFromHsl(e));
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

    updateFromHex(event) {
        const hex = event.target.value;
        const rgb = this.hexToRgb(hex);
        if (rgb) {
            this.updateUI(rgb.r, rgb.g, rgb.b);
            this.color = hex;
        }
    }

    updateFromRgb(event) {
        const rgb = event.target.value.match(/\d+/g);
        if (rgb && rgb.length === 3) {
            const [r, g, b] = rgb.map(Number);
            this.color = `rgb(${r}, ${g}, ${b})`;
            this.updateUI(r, g, b);
        }
    }

    updateFromHsl(event) {
        const hsl = event.target.value.match(/\d+/g);
        if (hsl && hsl.length === 3) {
            const [h, s, l] = hsl.map(Number);
            const { r, g, b } = this.hslToRgb(h, s, l);
            this.color = `rgb(${r}, ${g}, ${b})`;
            this.updateUI(r, g, b);
        }
    }

    updateUI(r, g, b) {
        this.previewBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        const hex = this.rgbToHex(r, g, b);
        const hsl = this.rgbToHsl(r, g, b);

        this.hexInput.value = hex;
        this.rgbInput.value = `${r}, ${g}, ${b}`;
        this.hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
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

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
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

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

export default ColorPicker;
