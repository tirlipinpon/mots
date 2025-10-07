// Gestionnaire de statistiques avancées
class StatsManager {
    constructor() {
        this.sessionStartTime = Date.now();
        this.totalGameTime = 0;
        this.wordsByDifficulty = {
            easy: [],
            medium: [],
            hard: []
        };
        this.perfectGames = 0;
        this.letterErrors = {};
        this.gameHistory = [];
        this.currentUser = null; // Utilisateur actuel pour les stats
    }

    // Ajouter un mot trouvé avec ses statistiques
    addWordFound(word, difficulty, timeElapsed, attempts, isPerfect = false) {
        const wordStats = {
            word: word,
            difficulty: difficulty,
            time: timeElapsed,
            attempts: attempts,
            timestamp: Date.now(),
            isPerfect: isPerfect
        };

        this.wordsByDifficulty[difficulty].push(wordStats);
        this.gameHistory.push(wordStats);
        
        if (isPerfect) {
            this.perfectGames++;
        }

        this.saveStats();
    }

    // Enregistrer une erreur de lettre
    addLetterError(letter, word, difficulty) {
        const key = `${letter}_${difficulty}`;
        this.letterErrors[key] = (this.letterErrors[key] || 0) + 1;
    }

    // Calculer le temps total de jeu de la session
    getSessionTime() {
        return Math.floor((Date.now() - this.sessionStartTime) / 1000);
    }

    // Calculer le temps total de jeu (toutes sessions)
    getTotalGameTime() {
        return this.totalGameTime + this.getSessionTime();
    }

    // Obtenir les mots trouvés par difficulté
    getWordsByDifficulty() {
        return {
            easy: this.wordsByDifficulty.easy.length,
            medium: this.wordsByDifficulty.medium.length,
            hard: this.wordsByDifficulty.hard.length
        };
    }

    // Calculer la progression dans le temps (amélioration)
    getProgressionTrend() {
        if (this.gameHistory.length < 3) return 'insuffisant';

        const recent = this.gameHistory.slice(-5);
        const older = this.gameHistory.slice(-10, -5);
        
        if (older.length === 0) return 'insuffisant';

        const recentAvg = recent.reduce((sum, w) => sum + w.time, 0) / recent.length;
        const olderAvg = older.reduce((sum, w) => sum + w.time, 0) / older.length;
        
        const improvement = ((olderAvg - recentAvg) / olderAvg) * 100;
        
        if (improvement > 10) return 'excellente';
        if (improvement > 5) return 'bonne';
        if (improvement > -5) return 'stable';
        return 'dégradée';
    }

    // Obtenir les lettres les plus difficiles
    getMostDifficultLetters() {
        const sorted = Object.entries(this.letterErrors)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        return sorted.map(([letter, count]) => ({
            letter: letter.split('_')[0],
            difficulty: letter.split('_')[1],
            errors: count
        }));
    }

    // Obtenir les statistiques complètes
    getAllStats() {
        const wordsByDiff = this.getWordsByDifficulty();
        const totalWords = Object.values(wordsByDiff).reduce((sum, count) => sum + count, 0);
        
        return {
            // Mots par difficulté
            wordsByDifficulty: wordsByDiff,
            
            // Temps de jeu
            sessionTime: this.getSessionTime(),
            totalGameTime: this.getTotalGameTime(),
            
            // Perfect games
            perfectGames: this.perfectGames,
            perfectRate: totalWords > 0 ? Math.round((this.perfectGames / totalWords) * 100) : 0,
            
            // Progression
            progressionTrend: this.getProgressionTrend(),
            
            // Lettres difficiles
            difficultLetters: this.getMostDifficultLetters(),
            
            // Statistiques générales
            totalWords: totalWords,
            averageTime: this.calculateAverageTime(),
            bestTime: this.calculateBestTime()
        };
    }

    // Calculer le temps moyen
    calculateAverageTime() {
        if (this.gameHistory.length === 0) return 0;
        const totalTime = this.gameHistory.reduce((sum, w) => sum + w.time, 0);
        return Math.round(totalTime / this.gameHistory.length);
    }

    // Calculer le meilleur temps
    calculateBestTime() {
        if (this.gameHistory.length === 0) return null;
        return Math.min(...this.gameHistory.map(w => w.time));
    }

    // Définir l'utilisateur actuel
    setUser(username) {
        this.currentUser = username;
        if (username) {
            this.loadStats();
        } else {
            this.resetStats();
        }
    }

    // Sauvegarder les statistiques (par utilisateur)
    saveStats() {
        if (!this.currentUser) return;
        
        const stats = {
            totalGameTime: this.totalGameTime + this.getSessionTime(),
            wordsByDifficulty: this.wordsByDifficulty,
            perfectGames: this.perfectGames,
            letterErrors: this.letterErrors,
            gameHistory: this.gameHistory.slice(-100) // Garder seulement les 100 derniers
        };
        
        localStorage.setItem(`mots_game_advancedStats_${this.currentUser}`, JSON.stringify(stats));
    }

    // Charger les statistiques (par utilisateur)
    loadStats() {
        if (!this.currentUser) return;
        
        const saved = localStorage.getItem(`mots_game_advancedStats_${this.currentUser}`);
        if (saved) {
            const stats = JSON.parse(saved);
            this.totalGameTime = stats.totalGameTime || 0;
            this.wordsByDifficulty = stats.wordsByDifficulty || { easy: [], medium: [], hard: [] };
            this.perfectGames = stats.perfectGames || 0;
            this.letterErrors = stats.letterErrors || {};
            this.gameHistory = stats.gameHistory || [];
        } else {
            // Réinitialiser si aucune stat trouvée
            this.totalGameTime = 0;
            this.wordsByDifficulty = { easy: [], medium: [], hard: [] };
            this.perfectGames = 0;
            this.letterErrors = {};
            this.gameHistory = [];
        }
    }

    // Formater le temps en format lisible
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    // Réinitialiser les statistiques
    resetStats() {
        this.totalGameTime = 0;
        this.wordsByDifficulty = { easy: [], medium: [], hard: [] };
        this.perfectGames = 0;
        this.letterErrors = {};
        this.gameHistory = [];
        this.sessionStartTime = Date.now();
        if (this.currentUser) {
            localStorage.removeItem(`mots_game_advancedStats_${this.currentUser}`);
        }
    }
}
