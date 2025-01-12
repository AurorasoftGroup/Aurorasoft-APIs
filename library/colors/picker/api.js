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

        this.context = this.canvas.getContext("2d");
        this.drawColorSpectrum();
    }

    drawColorSpectrum() {
        const gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.17, "orange");
        gradient.addColorStop(0.34, "yellow");
        gradient.addColorStop(0.5, "green");
        gradient.addColorStop(0.67, "blue");
        gradient.addColorStop(0.84, "indigo");
        gradient.addColorStop(1, "violet");

        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const blackGradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
        blackGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        blackGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

        this.context.fillStyle = blackGradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

        this.updateUI();
        this.container.dispatchEvent(new CustomEvent("colorChange", { detail: this.color }));
    }

    updateColor(event) {
        this.color = event.target.value;
        this.updateUI();
        this.container.dispatchEvent(new CustomEvent("colorChange", { detail: this.color }));
    }

    updateUI() {
        this.colorInput.value = this.color;
        this.previewBox.style.backgroundColor = this.color;
    }
}

export default ColorPicker;
