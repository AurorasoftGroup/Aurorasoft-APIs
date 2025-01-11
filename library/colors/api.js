const auroracolor = (function () {
    const colorPalette = {
        red: "#bf3c2c",
        orange: "#f28500",
        yellow: "#ffc704",
        green: "#417440",
        blue: "#3366cc",
        purple: "#6a60b0",
        black: "#202122",
        white: "#ffffff",
        "light-gray": "#c8ccd1",
        "dark-gray": "a2a9b1",
    };
  
    let loadedColors = {};
  
    return {
        loadColors(...colorNames) {
            loadedColors = {};
            colorNames.forEach((name) => {
            if (colorPalette[name]) {
                loadedColors[name] = colorPalette[name];
            } else {
                console.warn(`Color "${name}" is not defined in the palette.`);
            }
            });
        },
        getColor(name) {
            return loadedColors[name] || null;
        },
        applyColorToElement(element, variableName, colorName) {
            const color = this.getColor(colorName);
            if (color) {
                element.style.setProperty(`--${variableName}`, color);
            } else {
                console.warn(`Color "${colorName}" is not loaded.`);
            }
        },
        getLoadedColors() {
            return loadedColors;
        },
    };
})();
