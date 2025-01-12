const fontUrl = 'https://auroratype.pages.dev/library/fonts.css';

function loadLibrary() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
}

function loadFont() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
}

function applyFont(fontName, elementSelector = 'body') {
    const element = document.querySelector(elementSelector);
    if (element) {
        element.style.fontFamily = fontName + ', sans-serif';
    } else {
        console.log(`Element ${elementSelector} not found.`);
    }
}

function quickFont(fontName, elementSelector = 'body') {
    loadFont();
    const element = document.querySelector(elementSelector);
    if (element) {
        element.style.fontFamily = fontName + ', sans-serif';
    } else {
        console.log(`Element ${elementSelector} not found.`);
    }
}

loadLibrary();

window.auroratype = {
    loadLibrary,
    loadFont,
    applyFont,
    quickFont
};