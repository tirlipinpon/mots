// Jeu principal - Orchestrateur
// Version: 1.6.5
const GAME_VERSION = '1.6.5';

class WordGuessingGame {
    constructor() {
        // Afficher la version
        console.log(`%c🎮 Jeu de Devinette de Mots - Version ${GAME_VERSION}`, 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log(`%c📅 ${new Date().toLocaleString('fr-FR')}`, 'color: #10b981; font-size: 12px;');
        console.log('');
        
        // Initialiser les gestionnaires
        this.ui = new UIManager();
        this.soundManager = new SoundManager();
        this.hintManager = new HintManager();
        this.wordManager = new WordManager(GAME_DATA);
        this.timer = new TimerManager(this.ui.domElements.timer);
        this.userManager = new UserManager();
        this.statsManager = new StatsManager();
        
        // Nouveaux gestionnaires
        this.inputHandler = new InputHandler(this);
        this.levelProgressionManager = new LevelProgressionManager(this);
        
        // État du jeu
        this.currentWord = '';
        this.currentLevel = 1;
        this.stars = 0;
        this.currentDifficulty = 'easy';
        this.currentCategory = 'toutes';
        this.attempts = 0;
        this.isCurrentWordCorrect = false;
        this.helpUsed = false;
        
        // Statistiques
        this.totalWordsFound = 0;
        this.wordTimes = [];
        this.bestTime = null;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        
        // Afficher la version dans l'UI
        this.ui.displayVersion(GAME_VERSION);
        
        // Initialiser le jeu
        this.initializeGame();
        this.setupEventListeners();
        this.levelProgressionManager.updateDifficultyCounts();
        this.updateLevelStatus();
        this.loadUserPreferences();
        this.statsManager.loadStats();
        this.updateVisibility();
        this.updateCategorySelect();
    }

    initializeGame() {
        // Ne lancer un mot que si l'utilisateur n'est pas connecté
        // Si connecté, switchToAvailableLevel() dans loadUserData() gérera le démarrage
        if (!this.userManager.isLoggedIn()) {
            this.selectRandomWord();
            this.ui.createLetterBoxes(this.currentWord.length);
            this.timer.start();
            this.hintManager.resetHelp();
            this.inputHandler.reset();
        }
    }

    selectRandomWord() {
        const result = this.wordManager.selectRandomWord(this.currentDifficulty, this.userManager, this.currentCategory);
        
        // Si tous les mots sont complétés
        if (result.allWordsCompleted) {
            console.log(`🎉 Niveau ${this.currentDifficulty} complété !`);
            this.levelProgressionManager.handleLevelCompleted(this.currentDifficulty);
            return;
        }
        
        // Si la catégorie est complétée (mais pas le niveau entier)
        if (result.categoryCompleted) {
            console.log(`🎉 Catégorie ${this.currentCategory} complétée pour le niveau ${this.currentDifficulty} !`);
            const categoryName = getCategoryName(this.currentCategory);
            this.ui.showFeedback(`🎉 Tous les mots ${categoryName} trouvés dans ce niveau !`, 'success');
            this.soundManager.play('wordFound');
            
            // Retour automatique à "Toutes"
            setTimeout(() => {
                this.currentCategory = 'toutes';
                this.updateCategorySelect();
                this.selectRandomWord();
                this.ui.createLetterBoxes(this.currentWord.length);
                this.timer.start();
                this.hintManager.resetHelp();
                this.inputHandler.reset();
            }, 2000);
            return;
        }
        
        this.currentWord = result.word;
        this.attempts = 0;
        
        console.log(`%c🎯 MOT ACTUEL: "${this.currentWord.toUpperCase()}"`, 'color: #f59e0b; font-size: 14px; font-weight: bold; background: #fef3c7; padding: 4px 8px; border-radius: 4px;');
        console.log(`📏 Longueur: ${this.currentWord.length} lettres | 🎚️ Niveau: ${this.currentDifficulty} | 🗂️ Catégorie: ${this.currentCategory}`);
        console.log('');
        
        const hint = this.wordManager.getHint(this.currentWord, this.currentDifficulty);
        this.hintManager.showHint(hint);
    }

    setupEventListeners() {
        // Connexion/Déconnexion
        this.ui.domElements.loginBtn.addEventListener('click', () => this.handleLogin());
        this.ui.domElements.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.ui.domElements.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        // Boutons de difficulté
        this.ui.domElements.easyBtn.addEventListener('click', () => this.levelProgressionManager.setDifficulty('easy'));
        this.ui.domElements.mediumBtn.addEventListener('click', () => this.levelProgressionManager.setDifficulty('medium'));
        this.ui.domElements.hardBtn.addEventListener('click', () => this.levelProgressionManager.setDifficulty('hard'));
        
        // Toggle score
        this.ui.domElements.scoreToggle.addEventListener('click', () => this.toggleSection('score'));
        
        // Bouton d'aide
        this.hintManager.domElements.helpBtn.addEventListener('click', () => this.handleHelp());
        
        // Bouton son
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => this.toggleSound());
            this.updateSoundButton();
        }
        
        // Sélecteur de catégorie
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => this.setCategory(e.target.value));
        }
    }
    
    // Changer la catégorie
    setCategory(category) {
        this.currentCategory = category;
        console.log(`🗂️ Catégorie changée: ${category}`);
        
        const categoryName = getCategoryName(category);
        this.ui.showFeedback(`Catégorie: ${categoryName}`, 'info');
        
        this.newGame();
    }
    
    // Mettre à jour la liste déroulante des catégories
    updateCategorySelect() {
        const select = document.getElementById('categorySelect');
        if (!select || typeof getAvailableCategoriesForLevel !== 'function') return;
        
        // Obtenir les catégories disponibles (avec mots restants seulement)
        const availableCategories = getAvailableCategoriesForLevel(
            this.currentDifficulty, 
            GAME_DATA, 
            this.userManager
        );
        
        // Si la catégorie actuelle n'est plus disponible, revenir à "toutes"
        if (!availableCategories.includes(this.currentCategory)) {
            this.currentCategory = 'toutes';
        }
        
        // Vider et repeupler
        select.innerHTML = '';
        
        availableCategories.forEach(categoryKey => {
            const option = document.createElement('option');
            option.value = categoryKey;
            
            // Compter les mots RESTANTS dans cette catégorie
            const wordCount = getWordCountInCategory(
                categoryKey, 
                this.currentDifficulty, 
                GAME_DATA, 
                this.userManager
            );
            
            // Afficher nom + nombre de mots restants
            option.textContent = `${getCategoryName(categoryKey)} (${wordCount})`;
            
            if (categoryKey === this.currentCategory) {
                option.selected = true;
            }
            
            select.appendChild(option);
        });
        
        console.log(`🗂️ Catégories disponibles: ${availableCategories.length} (mots restants affichés)`);
    }
    
    // Activer/Désactiver les sons
    toggleSound() {
        const isMuted = this.soundManager.toggleMute();
        this.updateSoundButton();
        this.soundManager.play('click');
    }
    
    // Mettre à jour l'apparence du bouton son
    updateSoundButton() {
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            if (this.soundManager.isMuted) {
                soundBtn.textContent = '🔇';
                soundBtn.classList.add('muted');
                soundBtn.title = 'Activer les sons';
            } else {
                soundBtn.textContent = '🔊';
                soundBtn.classList.remove('muted');
                soundBtn.title = 'Désactiver les sons';
            }
        }
    }

    showCorrectWord() {
        this.timer.stop();
        const timeElapsed = this.timer.getElapsed();
        
        this.isCurrentWordCorrect = true;
        this.soundManager.play('wordFound');
        this.ui.showVictoryEffect();
        this.ui.showFeedback(`🎉 BRAVO ! Tu as trouvé "${this.currentWord.toUpperCase()}" en ${timeElapsed}s !`, 'success');
        this.ui.createCelebration();
        this.inputHandler.reset();
        
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
        
        this.ui.showFeedback(`🎉 BRAVO ! Tu as trouvé "${this.currentWord.toUpperCase()}" en ${timeElapsed}s !`, 'success');
        this.ui.createCelebration();
        this.inputHandler.reset();
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
        this.levelProgressionManager.updateDifficultyCounts();
        this.updateCategorySelect(); // Mettre à jour la liste des catégories
        this.updateLevelStatus();
        this.levelProgressionManager.updateDifficultyButtonsState();
    }

    newGame() {
        if (this.isCurrentWordCorrect) {
            this.handleWin();
        }
        
        this.isCurrentWordCorrect = false;
        this.helpUsed = false;
        
        this.timer.stop();
        this.selectRandomWord();
        this.ui.createLetterBoxes(this.currentWord.length);
        this.ui.showFeedback(`Nouveau mot de ${this.currentWord.length} lettres ! Devine-le ! 💭`, 'info');
        this.timer.start();
        this.updateStats();
        this.ui.resetLetterBoxes();
        this.hintManager.resetHelp();
        this.inputHandler.reset();
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
            this.soundManager.play('hint');
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
            this.loadUserData(); // Charge les données (appelle déjà updateCategorySelect())
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
        this.levelProgressionManager.updateDifficultyCounts();
        this.updateCategorySelect(); // Réinitialiser la liste avec tous les mots (mode déconnecté)
        
        // Débloquer tous les boutons de difficulté
        ['easy', 'medium', 'hard'].forEach(difficulty => {
            this.ui.enableDifficultyButton(difficulty);
        });
        
        this.ui.showFeedback('Déconnexion réussie. Tes données sont sauvegardées.', 'info');
    }

    loadUserData() {
        if (this.userManager.isLoggedIn()) {
            // Nettoyer les mots trouvés en excès
            this.levelProgressionManager.cleanupFoundWords();
            
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
            this.levelProgressionManager.updateDifficultyCounts();
            this.updateCategorySelect(); // Mettre à jour la liste des catégories avec les mots restants
            this.updateLevelStatus();
            this.levelProgressionManager.updateDifficultyButtonsState();
            
            // Vérifier si le niveau actuel est complété et passer au suivant si nécessaire
            this.levelProgressionManager.switchToAvailableLevel();
        }
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
            
            const toggleHeader = document.getElementById(`${sectionName}Toggle`);
            const toggleContent = document.getElementById(`${sectionName}Content`);
            
            if (!toggleHeader || !toggleContent) return;
            
            const toggleIcon = toggleHeader.querySelector('.toggle-icon');
            const isOpen = preferences.toggledSections[sectionName];
            
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
    
    // Méthode déléguée pour compatibilité
    setDifficulty(difficulty) {
        this.levelProgressionManager.setDifficulty(difficulty);
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
