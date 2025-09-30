// Gestionnaire du timer
class TimerManager {
    constructor(timerElement) {
        this.timerElement = timerElement;
        this.startTime = 0;
        this.timerInterval = null;
    }
    
    // Démarrer le timer
    start() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = this.getElapsed();
            this.timerElement.textContent = elapsed + 's';
        }, 1000);
    }
    
    // Arrêter le timer
    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    // Obtenir le temps écoulé
    getElapsed() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
    
    // Formater le temps
    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
    }
}
