class WebAlerts {
    static showAlert(message) {
        alert(message);
    }
    static showPrompt(message, defaultValue = "") {
        return prompt(message, defaultValue);
    }
    static showConfirm(message) {
        return confirm(message);
    }
    static log(message) {
        console.log(message);
    }
    static warn(message) {
        console.warn(message);
    }
    static error(message) {
        console.error(message);
    }
    static info(message) {
        console.info(message);
    }
    static styledLog(message, style) {
        console.log(`%c${message}`, style);
    }
}