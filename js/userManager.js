// Gestionnaire d'utilisateurs et de sauvegarde
class UserManager {
    constructor() {
        this.currentUser = null;
        this.wordsFound = [];
        this.wordsFoundByDifficulty = {
            easy: [],
            medium: [],
            hard: []
        };
        this.userStats = {
            totalWordsFound: 0,
            wordTimes: [],
            bestTime: null,
            currentStreak: 0,
            bestStreak: 0,
            totalAttempts: 0,
            correctAttempts: 0,
            stars: 0,
            currentLevel: 1
        };
    }

    // Connexion d'un utilisateur
    login(username) {
        if (!username || username.trim() === '') {
            return false;
        }

        this.currentUser = username.trim();
        this.loadUserData();
        return true;
    }

    // Déconnexion
    logout() {
        this.currentUser = null;
        this.wordsFound = [];
        this.resetStats();
    }

    // Charger les données utilisateur depuis les cookies
    loadUserData() {
        if (!this.currentUser) return;

        // Charger les mots trouvés
        const wordsFoundCookie = this.getCookie(`words_${this.currentUser}`);
        if (wordsFoundCookie) {
            this.wordsFound = JSON.parse(wordsFoundCookie);
        }

        // Charger les mots trouvés par difficulté
        const wordsByDifficultyCookie = this.getCookie(`wordsByDifficulty_${this.currentUser}`);
        if (wordsByDifficultyCookie) {
            this.wordsFoundByDifficulty = { ...this.wordsFoundByDifficulty, ...JSON.parse(wordsByDifficultyCookie) };
        }

        // Charger les statistiques
        const statsCookie = this.getCookie(`stats_${this.currentUser}`);
        if (statsCookie) {
            this.userStats = { ...this.userStats, ...JSON.parse(statsCookie) };
        }
    }

    // Sauvegarder les données utilisateur
    saveUserData() {
        if (!this.currentUser) return;

        // Sauvegarder les mots trouvés
        this.setCookie(`words_${this.currentUser}`, JSON.stringify(this.wordsFound), 365);

        // Sauvegarder les mots trouvés par difficulté
        this.setCookie(`wordsByDifficulty_${this.currentUser}`, JSON.stringify(this.wordsFoundByDifficulty), 365);

        // Sauvegarder les statistiques
        this.setCookie(`stats_${this.currentUser}`, JSON.stringify(this.userStats), 365);
    }

    // Ajouter un mot trouvé
    addWordFound(word, difficulty = null) {
        if (!this.currentUser) return;
        
        if (!this.wordsFound.includes(word)) {
            this.wordsFound.push(word);
        }
        
        if (difficulty && !this.wordsFoundByDifficulty[difficulty].includes(word)) {
            this.wordsFoundByDifficulty[difficulty].push(word);
        }
        
        this.saveUserData();
    }

    // Obtenir les mots trouvés par difficulté
    getWordsFoundByDifficulty(difficulty) {
        return this.wordsFoundByDifficulty[difficulty] || [];
    }

    // Mettre à jour les statistiques
    updateStats(stats) {
        if (!this.currentUser) return;
        
        this.userStats = { ...this.userStats, ...stats };
        this.saveUserData();
    }

    // Obtenir les mots disponibles (excluant ceux déjà trouvés)
    getAvailableWords(allWords) {
        // Toujours filtrer les mots déjà trouvés, même sans connexion
        return allWords.filter(word => !this.wordsFound.includes(word));
    }

    // Vérifier si un utilisateur existe
    userExists(username) {
        const wordsCookie = this.getCookie(`words_${username}`);
        const statsCookie = this.getCookie(`stats_${username}`);
        return wordsCookie !== null || statsCookie !== null;
    }

    // Obtenir les statistiques de l'utilisateur
    getUserStats() {
        return this.userStats;
    }

    // Obtenir les mots trouvés
    getWordsFound() {
        return this.wordsFound;
    }

    // Réinitialiser les statistiques
    resetStats() {
        this.userStats = {
            totalWordsFound: 0,
            wordTimes: [],
            bestTime: null,
            currentStreak: 0,
            bestStreak: 0,
            totalAttempts: 0,
            correctAttempts: 0,
            stars: 0,
            currentLevel: 1
        };
    }

    // Vérifier si un utilisateur est connecté
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Obtenir le nom de l'utilisateur connecté
    getCurrentUser() {
        return this.currentUser;
    }

    // Gestion des cookies
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Supprimer un cookie
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Sauvegarder les préférences utilisateur
    saveUserPreferences(preferences) {
        this.setCookie('userPreferences', JSON.stringify(preferences), 365);
    }

    // Charger les préférences utilisateur
    getUserPreferences() {
        const prefsCookie = this.getCookie('userPreferences');
        if (prefsCookie) {
            return JSON.parse(prefsCookie);
        }
        return {
            toggledSections: {
                login: false,
                score: false,
                difficulty: false
            },
            selectedDifficulty: 'easy'
        };
    }
}
