// Jeu principal - Orchestrateur
// Version: 1.0.3
const GAME_VERSION = '1.0.3';

class WordGuessingGame {
    constructor() {
        // Afficher la version
        console.log(`%c🎮 Jeu de Devinette de Mots - Version ${GAME_VERSION}`, 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log(`%c📅 ${new Date().toLocaleString('fr-FR')}`, 'color: #10b981; font-size: 12px;');
        console.log('');
        
        // Initialiser les gestionnaires
        this.ui = new UIManager();
        this.hintManager = new HintManager();
        this.wordManager = new WordManager(GAME_DATA);
        this.timer = new TimerManager(this.ui.domElements.timer);
        this.userManager = new UserManager();
        this.statsManager = new StatsManager();
        
        // État du jeu
        this.currentWord = '';
        this.currentLevel = 1;
        this.stars = 0;
        this.currentDifficulty = 'easy';
        this.attempts = 0;
        this.isCurrentWordCorrect = false;
        this.previousInputValue = '';
        this.currentInput = '';
        this.helpUsed = false;
        
        // Statistiques
        this.totalWordsFound = 0;
        this.wordTimes = [];
        this.bestTime = null;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        
        // Initialiser le jeu
        this.initializeGame();
        this.setupEventListeners();
        this.updateDifficultyCounts();
        this.updateLevelStatus();
        this.loadUserPreferences();
        this.statsManager.loadStats();
        this.updateVisibility();
    }

    initializeGame() {
        this.selectRandomWord();
        this.ui.createLetterBoxes(this.currentWord.length);
        this.timer.start();
        this.hintManager.resetHelp();
        this.currentInput = '';
    }

    selectRandomWord() {
        const result = this.wordManager.selectRandomWord(this.currentDifficulty, this.userManager);
        
        // Si tous les mots sont complétés (pas de mot disponible)
        if (result.allWordsCompleted) {
            console.log(`🎉 Niveau ${this.currentDifficulty} complété !`);
            this.handleLevelCompleted(this.currentDifficulty);
            return; // Stopper ici, ne pas continuer
        }
        
        this.currentWord = result.word;
        this.attempts = 0;
        
        const hint = this.wordManager.getHint(this.currentWord, this.currentDifficulty);
        this.hintManager.showHint(hint);
    }
    
    // Gérer la complétion d'un niveau
    handleLevelCompleted(completedLevel) {
        console.log(`🏆 handleLevelCompleted appelé pour: ${completedLevel}`);
        
        // Bloquer le bouton du niveau complété
        this.ui.disableDifficultyButton(completedLevel);
        
        // Félicitations pour le niveau
        const levelNames = {
            easy: '🟢 Facile',
            medium: '🟠 Moyen',
            hard: '🔴 Difficile'
        };
        
        this.ui.showFeedback(`🎉 BRAVO ! Niveau ${levelNames[completedLevel]} complété ! 🎉`, 'success');
        this.ui.createCelebration();
        
        // Vérifier si tous les niveaux sont complétés
        const allLevelsCompleted = this.checkAllLevelsCompleted();
        
        if (allLevelsCompleted) {
            // Tous les niveaux sont terminés !
            setTimeout(() => {
                this.ui.showFeedback(`🏆 FÉLICITATIONS ! Tu as terminé TOUS les niveaux du jeu ! 🏆 Tu es un CHAMPION ! 👑`, 'success');
                this.ui.createCelebration();
            }, 2000);
        } else {
            // Passer au niveau suivant
            setTimeout(() => {
                const nextLevel = this.getNextAvailableLevel(completedLevel);
                if (nextLevel) {
                    this.setDifficulty(nextLevel);
                    this.ui.showFeedback(`⬆️ Passage au niveau ${levelNames[nextLevel]} ! 💪`, 'info');
                }
            }, 3000);
        }
    }
    
    // Vérifier si tous les niveaux sont complétés
    checkAllLevelsCompleted() {
        if (!this.userManager.isLoggedIn()) return false;
        
        const difficulties = ['easy', 'medium', 'hard'];
        
        for (const difficulty of difficulties) {
            const allWords = this.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length < allWords.length) {
                return false; // Il reste des mots dans ce niveau
            }
        }
        
        console.log('🏆 TOUS LES NIVEAUX COMPLÉTÉS !');
        return true;
    }
    
    // Obtenir le prochain niveau disponible
    getNextAvailableLevel(currentLevel) {
        if (!this.userManager.isLoggedIn()) return null;
        
        const levelOrder = ['easy', 'medium', 'hard'];
        const currentIndex = levelOrder.indexOf(currentLevel);
        
        // Chercher le prochain niveau non complété
        for (let i = currentIndex + 1; i < levelOrder.length; i++) {
            const difficulty = levelOrder[i];
            const allWords = this.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length < allWords.length) {
                console.log(`➡️ Prochain niveau disponible: ${difficulty}`);
                return difficulty;
            }
        }
        
        // Si on est au dernier niveau ou tous complétés, retourner null
        return null;
    }

    setupEventListeners() {
        // Connexion/Déconnexion
        this.ui.domElements.loginBtn.addEventListener('click', () => this.handleLogin());
        this.ui.domElements.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.ui.domElements.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        // Boutons de difficulté
        this.ui.domElements.easyBtn.addEventListener('click', () => this.setDifficulty('easy'));
        this.ui.domElements.mediumBtn.addEventListener('click', () => this.setDifficulty('medium'));
        this.ui.domElements.hardBtn.addEventListener('click', () => this.setDifficulty('hard'));
        
        // Toggle score
        this.ui.domElements.scoreToggle.addEventListener('click', () => this.toggleSection('score'));
        
        // Bouton d'aide
        this.hintManager.domElements.helpBtn.addEventListener('click', () => this.handleHelp());
        
        // Capturer les événements clavier sur le document
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        // Ignorer les touches si un input est focus (login, etc.)
        if (document.activeElement.tagName === 'INPUT') {
            return;
        }
        
        // Touche Entrée - désactivée car passage automatique au mot suivant
        if (e.key === 'Enter') {
            e.preventDefault();
            return;
        }
        
        // Touche Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            
            if (this.currentInput.length > 0) {
                this.currentInput = this.currentInput.slice(0, -1);
                this.handleInput(this.currentInput);
            }
            return;
        }
        
        // Lettres (a-z, A-Z)
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            e.preventDefault();
            
            const letterBoxes = this.ui.domElements.wordDisplay.children;
            const cursorPosition = this.ui.getCursorPosition();
            
            // Vérifier si on a une position valide
            if (cursorPosition === -1 || cursorPosition >= this.currentWord.length) {
                this.ui.showFeedback('⚠️ Mot complet ! Utilise Backspace pour corriger ⬅️', 'warning');
                return;
            }
            
            const currentBox = letterBoxes[cursorPosition];
            
            // Si la boîte contient déjà une lettre non-verte, la remplacer
            if (currentBox.textContent !== '?' && !currentBox.classList.contains('letter-correct')) {
                // Supprimer d'abord le dernier caractère (la lettre actuelle)
                if (this.currentInput.length > 0) {
                    this.currentInput = this.currentInput.slice(0, -1);
                }
            }
            
            this.currentInput += e.key;
            this.handleInput(this.currentInput);
        }
    }

    handleInput(inputValue) {
        const letterBoxes = this.ui.domElements.wordDisplay.children;
        
        // Compter les lettres vertes consécutives
        const consecutiveGreenCount = this.wordManager.countConsecutiveGreenLetters(letterBoxes);
        
        // Limiter la longueur
        let input = inputValue;
        if (input.length > this.currentWord.length) {
            input = input.substring(0, this.currentWord.length);
            this.currentInput = input;
        }
        
        // S'assurer que l'input contient toujours les lettres vertes au début
        if (consecutiveGreenCount > 0) {
            let greenLetters = '';
            for (let i = 0; i < consecutiveGreenCount; i++) {
                greenLetters += letterBoxes[i].textContent;
            }
            
            // Si l'input ne commence pas par les lettres vertes, le corriger
            if (!input.toUpperCase().startsWith(greenLetters)) {
                input = greenLetters + input.substring(consecutiveGreenCount);
                this.currentInput = input;
            }
            
            // Empêcher de supprimer les lettres vertes
            if (input.length < consecutiveGreenCount) {
                this.currentInput = this.previousInputValue || greenLetters;
                this.ui.showFeedback('Tu ne peux pas supprimer les lettres vertes ! 🚫', 'warning');
                return;
            }
        }
        
        // Analyser la tentative
        let result = null;
        if (input.length > 0) {
            result = this.wordManager.analyzeGuess(input, this.currentWord);
        }
        
        // Mettre à jour l'affichage
        this.ui.updateLetterBoxes(input, result ? result.letterStates : null);
        
        // Vérifier si la lettre révélée par le hint a été trouvée
        if (result && result.letterStates) {
            for (let i = 0; i < result.letterStates.length; i++) {
                if (result.letterStates[i] === 'correct') {
                    // Une lettre est devenue verte, masquer le hint révélé
                    this.hintManager.hideRevealedLetter();
                    break;
                }
            }
        }
        
        // Vérifier si le mot est trouvé
        if (input.length > 0 && this.wordManager.areAllLettersCorrect(letterBoxes)) {
            if (!this.isCurrentWordCorrect) {
                this.showCorrectWord();
            }
        }
        
        // Feedback
        this.provideFeedback(input, result);
        
        this.previousInputValue = input;
    }

    provideFeedback(input, result) {
        if (input.length === 0) {
            this.ui.showFeedback(`Devine le mot de ${this.currentWord.length} lettres ! 💭`, 'info');
        } else if (input.length < this.currentWord.length) {
            if (result) {
                this.ui.showFeedback(`Continue ! ${result.correctPositions} bonne(s) place(s), ${result.wrongPositions} mauvaise(s) place(s) ✨`, 'info');
            } else {
                this.ui.showFeedback(`Continue ! Tu as ${input.length}/${this.currentWord.length} lettres ✨`, 'info');
            }
        } else if (input.length === this.currentWord.length) {
            if (result && result.correct) {
                this.ui.showFeedback(`🎉 BRAVO ! Tu as trouvé le mot ! 🎉`, 'success');
            } else if (result) {
                this.ui.showFeedback(`Presque ! ${result.correctPositions} bonne(s) place(s), ${result.wrongPositions} mauvaise(s) place(s). Appuie sur Entrée ! 🎯`, 'warning');
            }
        }
    }

    showCorrectWord() {
        this.timer.stop();
        const timeElapsed = this.timer.getElapsed();
        
        this.isCurrentWordCorrect = true;
        this.ui.showVictoryEffect();
        this.ui.showFeedback(`🎉 BRAVO ! Tu as trouvé "${this.currentWord.toUpperCase()}" en ${timeElapsed}s !`, 'success');
        this.ui.createCelebration();
        this.currentInput = '';
        
        // Passer automatiquement au mot suivant après 2.5 secondes
        setTimeout(() => {
            this.newGame();
        }, 2500);
    }

    handleWin() {
        this.timer.stop();
        const timeElapsed = this.timer.getElapsed();
        
        if (this.userManager.isLoggedIn()) {
            this.updateGameStats(timeElapsed);
            this.saveProgress();
            this.updateUI();
        }
        
        this.ui.showFeedback(`🎉 BRAVO ! Tu as trouvé "${this.currentWord.toUpperCase()}" en ${timeElapsed}s ! Appuie sur Entrée ou clique sur "Nouveau Mot" ! 🎉`, 'success');
        this.ui.createCelebration();
        this.currentInput = '';
    }

    updateGameStats(timeElapsed) {
        this.totalWordsFound++;
        this.wordTimes.push(timeElapsed);
        this.currentStreak++;
        this.correctAttempts++;
        this.totalAttempts++;
        
        if (this.bestTime === null || timeElapsed < this.bestTime) {
            this.bestTime = timeElapsed;
        }
        
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        // Calculer les étoiles
        let starsEarned = 3;
        if (this.attempts > 3) starsEarned = 2;
        if (this.attempts > 5) starsEarned = 1;
        if (timeElapsed > 60) starsEarned = Math.max(1, starsEarned - 1);
        
        this.stars += starsEarned;
        this.currentLevel++;
        
        this.ui.showStars(starsEarned);
    }

    saveProgress() {
        console.log(`💾 Sauvegarde du mot "${this.currentWord}" (${this.currentDifficulty})`);
        
        this.userManager.addWordFound(this.currentWord, this.currentDifficulty);
        this.userManager.updateStats({
            totalWordsFound: this.totalWordsFound,
            wordTimes: this.wordTimes,
            bestTime: this.bestTime,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            totalAttempts: this.totalAttempts,
            correctAttempts: this.correctAttempts,
            stars: this.stars,
            currentLevel: this.currentLevel
        });
        
        const isPerfect = this.attempts === 1;
        const timeElapsed = this.timer.getElapsed();
        this.statsManager.addWordFound(this.currentWord, this.currentDifficulty, timeElapsed, this.attempts, isPerfect);
        
        console.log(`✅ Sauvegarde du mot terminée`);
    }

    updateUI() {
        this.ui.updateScore(this.stars, this.currentLevel, this.totalWordsFound);
        this.updateStats();
        this.updateDifficultyCounts();
        this.updateLevelStatus();
        this.updateDifficultyButtonsState();
    }

    newGame() {
        if (this.isCurrentWordCorrect) {
            this.handleWin();
        }
        
        this.isCurrentWordCorrect = false;
        this.previousInputValue = '';
        this.currentInput = '';
        this.helpUsed = false;
        
        this.timer.stop();
        this.selectRandomWord();
        this.ui.createLetterBoxes(this.currentWord.length);
        this.ui.showFeedback(`Nouveau mot de ${this.currentWord.length} lettres ! Devine-le ! 💭`, 'info');
        this.timer.start();
        this.updateStats();
        this.ui.resetLetterBoxes();
        this.hintManager.resetHelp();
    }
    
    // Gérer l'aide - révéler la prochaine lettre manquante
    handleHelp() {
        if (this.helpUsed || this.isCurrentWordCorrect) {
            return;
        }
        
        const letterBoxes = this.ui.domElements.wordDisplay.children;
        
        const result = this.hintManager.revealNextLetter(this.currentWord, letterBoxes);
        
        if (result) {
            this.helpUsed = true;
            this.ui.showFeedback(`💡 Indice révélé ! Continue ! 💪`, 'info');
        }
    }

    // Gestion de la connexion
    handleLogin() {
        const username = this.ui.domElements.usernameInput.value.trim();
        
        if (!username) {
            this.ui.showFeedback('Veuillez entrer un nom !', 'error');
            return;
        }
        
        if (this.userManager.login(username)) {
            this.loadUserData();
            this.ui.showFeedback(`Bienvenue ${username} ! Tes données ont été chargées.`, 'success');
            this.ui.setCurrentUser(username);
            this.updateVisibility();
            this.updateLevelStatus();
        } else {
            this.ui.showFeedback('Erreur lors de la connexion.', 'error');
        }
    }

    handleLogout() {
        this.userManager.logout();
        this.resetGameStats();
        this.updateVisibility();
        this.updateLevelStatus();
        this.updateDifficultyCounts();
        
        // Débloquer tous les boutons de difficulté
        ['easy', 'medium', 'hard'].forEach(difficulty => {
            this.ui.enableDifficultyButton(difficulty);
        });
        
        this.ui.showFeedback('Déconnexion réussie. Tes données sont sauvegardées.', 'info');
    }

    loadUserData() {
        if (this.userManager.isLoggedIn()) {
            // Nettoyer les mots trouvés en excès
            this.cleanupFoundWords();
            
            const userStats = this.userManager.getUserStats();
            this.totalWordsFound = userStats.totalWordsFound;
            this.wordTimes = userStats.wordTimes;
            this.bestTime = userStats.bestTime;
            this.currentStreak = userStats.currentStreak;
            this.bestStreak = userStats.bestStreak;
            this.totalAttempts = userStats.totalAttempts;
            this.correctAttempts = userStats.correctAttempts;
            this.stars = userStats.stars;
            this.currentLevel = userStats.currentLevel;
            
            this.ui.updateScore(this.stars, this.currentLevel, this.totalWordsFound);
            this.updateStats();
            this.updateDifficultyCounts();
            this.updateLevelStatus();
            this.updateDifficultyButtonsState();
            
            // Vérifier si le niveau actuel est complété et passer au suivant si nécessaire
            this.switchToAvailableLevel();
        }
    }
    
    // Passer automatiquement à un niveau disponible
    switchToAvailableLevel() {
        if (!this.userManager.isLoggedIn()) return;
        
        const allWords = this.wordManager.getWordsByDifficulty(this.currentDifficulty);
        const foundWords = this.userManager.getWordsFoundByDifficulty(this.currentDifficulty);
        
        console.log(`🔍 Vérification niveau actuel: ${this.currentDifficulty} (${foundWords.length}/${allWords.length})`);
        
        // Si le niveau actuel est complété
        if (foundWords.length >= allWords.length) {
            console.log(`✅ Niveau ${this.currentDifficulty} déjà complété`);
            
            // Chercher le prochain niveau disponible
            const nextLevel = this.getNextAvailableLevel(this.currentDifficulty);
            
            if (nextLevel) {
                console.log(`➡️ Passage automatique au niveau ${nextLevel}`);
                this.currentDifficulty = nextLevel;
                this.ui.updateDifficultyButtons(nextLevel);
                this.saveUserPreferences();
                
                // Redémarrer le jeu avec le nouveau niveau
                this.newGame();
            } else {
                console.log(`🏆 Tous les niveaux sont complétés !`);
                this.ui.showFeedback(`🏆 FÉLICITATIONS ! Tu as terminé TOUS les niveaux ! 👑`, 'success');
            }
        }
    }
    
    // Nettoyer les mots trouvés invalides (doublons et mots en excès)
    cleanupFoundWords() {
        const difficulties = ['easy', 'medium', 'hard'];
        
        console.log('🧹 Nettoyage des mots trouvés...');
        
        difficulties.forEach(difficulty => {
            const allWords = this.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.userManager.getWordsFoundByDifficulty(difficulty);
            
            console.log(`  ${difficulty}: ${foundWords.length} trouvés / ${allWords.length} disponibles`);
            
            // Filtrer pour garder seulement les mots valides
            const validWords = foundWords.filter(word => allWords.includes(word));
            
            if (validWords.length !== foundWords.length) {
                console.log(`  ⚠️ ${foundWords.length - validWords.length} mot(s) invalide(s) supprimé(s)`);
                this.userManager.wordsFoundByDifficulty[difficulty] = validWords;
                this.userManager.saveUserData();
            }
        });
        
        console.log('✅ Nettoyage terminé');
    }
    
    // Mettre à jour l'état des boutons de difficulté (bloquer ceux qui sont complétés)
    updateDifficultyButtonsState() {
        if (!this.userManager.isLoggedIn()) return;
        
        const difficulties = ['easy', 'medium', 'hard'];
        
        difficulties.forEach(difficulty => {
            const allWords = this.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length >= allWords.length) {
                // Ce niveau est complété, bloquer le bouton
                this.ui.disableDifficultyButton(difficulty);
            } else {
                // Ce niveau n'est pas complété, débloquer le bouton
                this.ui.enableDifficultyButton(difficulty);
            }
        });
    }

    resetGameStats() {
        this.totalWordsFound = 0;
        this.wordTimes = [];
        this.bestTime = null;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        this.stars = 0;
        this.currentLevel = 1;
        
        this.ui.updateScore(this.stars, this.currentLevel, this.totalWordsFound);
        this.updateStats();
    }

    // Changer la difficulté
    setDifficulty(difficulty) {
        // Vérifier si le niveau est complété (ne pas permettre de le re-sélectionner)
        if (this.userManager.isLoggedIn()) {
            const allWords = this.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length >= allWords.length) {
                this.ui.showFeedback(`✅ Niveau ${this.ui.DIFFICULTY_NAMES[difficulty]} déjà complété !`, 'warning');
                return;
            }
        }
        
        this.currentDifficulty = difficulty;
        this.ui.updateDifficultyButtons(difficulty);
        this.ui.showFeedback(`Niveau changé : ${this.ui.DIFFICULTY_NAMES[difficulty]}`, 'info');
        this.newGame();
        this.saveUserPreferences();
    }

    updateDifficultyCounts() {
        const difficulties = ['easy', 'medium', 'hard'];
        const counts = {};
        
        console.log('📊 Mise à jour des compteurs de difficulté');
        
        difficulties.forEach(difficulty => {
            const allWords = this.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.userManager.isLoggedIn() 
                ? this.userManager.getWordsFoundByDifficulty(difficulty) 
                : [];
            
            console.log(`  ${difficulty}: ${foundWords.length}/${allWords.length} mots trouvés`);
            
            counts[difficulty] = {
                found: foundWords.length,
                total: allWords.length
            };
        });
        
        this.ui.updateDifficultyCounts(counts, this.userManager.isLoggedIn());
    }

    toggleSection(sectionName) {
        const toggleHeader = document.getElementById(`${sectionName}Toggle`);
        const toggleContent = document.getElementById(`${sectionName}Content`);
        const toggleIcon = toggleHeader.querySelector('.toggle-icon');
        
        if (toggleContent.classList.contains('hidden')) {
            toggleContent.classList.remove('hidden');
            toggleHeader.classList.add('active');
            toggleIcon.textContent = '−';
        } else {
            toggleContent.classList.add('hidden');
            toggleHeader.classList.remove('active');
            toggleIcon.textContent = '+';
        }
        
        this.saveUserPreferences();
    }

    updateLevelStatus() {
        this.ui.updateLevelDisplay(this.currentLevel, this.userManager.isLoggedIn());
    }

    updateVisibility() {
        this.ui.updateVisibilityForLogin(this.userManager.isLoggedIn());
    }

    updateStats() {
        const avgTime = this.wordTimes.length > 0 
            ? Math.round(this.wordTimes.reduce((a, b) => a + b, 0) / this.wordTimes.length)
            : 0;
        
        const accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctAttempts / this.totalAttempts) * 100)
            : 0;
        
        const advancedStats = this.statsManager.getAllStats();
        
        this.ui.updateStats({
            totalWordsFound: this.totalWordsFound,
            avgTime: avgTime,
            bestTime: this.bestTime,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            accuracy: accuracy,
            advanced: advancedStats
        }, (seconds) => this.timer.formatTime(seconds));
    }

    loadUserPreferences() {
        const preferences = this.userManager.getUserPreferences();
        
        Object.keys(preferences.toggledSections).forEach(sectionName => {
            if (sectionName === 'score' && !this.userManager.isLoggedIn()) {
                return;
            }
            
            const isOpen = preferences.toggledSections[sectionName];
            const toggleHeader = document.getElementById(`${sectionName}Toggle`);
            const toggleContent = document.getElementById(`${sectionName}Content`);
            
            if (!toggleHeader || !toggleContent) return;
            
            const toggleIcon = toggleHeader.querySelector('.toggle-icon');
            
            if (isOpen) {
                toggleContent.classList.remove('hidden');
                toggleHeader.classList.add('active');
                toggleIcon.textContent = '−';
            } else {
                toggleContent.classList.add('hidden');
                toggleHeader.classList.remove('active');
                toggleIcon.textContent = '+';
            }
        });
        
        this.currentDifficulty = preferences.selectedDifficulty;
        this.ui.updateDifficultyButtons(this.currentDifficulty);
    }

    saveUserPreferences() {
        const preferences = {
            toggledSections: {
                score: !this.ui.domElements.scoreContent.classList.contains('hidden')
            },
            selectedDifficulty: this.currentDifficulty
        };
        
        this.userManager.saveUserPreferences(preferences);
    }
}

// Démarrer le jeu
let gameInstance;
document.addEventListener('DOMContentLoaded', () => {
    gameInstance = new WordGuessingGame();
    
    // Fonction globale pour réinitialiser les données (accessible dans la console)
    window.resetUserData = () => {
        if (gameInstance && gameInstance.userManager && gameInstance.userManager.isLoggedIn()) {
            const username = gameInstance.userManager.getCurrentUser();
            if (confirm(`⚠️ Êtes-vous sûr de vouloir réinitialiser TOUTES les données de ${username} ?`)) {
                gameInstance.userManager.resetAllUserData();
                location.reload();
            }
        } else {
            console.log('⚠️ Aucun utilisateur connecté');
        }
    };
    
    console.log('💡 Astuce: Tape resetUserData() dans la console pour réinitialiser tes données');
});