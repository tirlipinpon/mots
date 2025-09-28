class WordGuessingGame {
    constructor() {
        // Utiliser les données externes
        this.hints = GAME_DATA;
        
        // Initialiser le gestionnaire d'utilisateurs
        this.userManager = new UserManager();
        
        this.currentWord = '';
        this.currentLevel = 1;
        this.stars = 0;
        this.currentDifficulty = 'easy'; // Difficulté actuelle
        this.startTime = 0;
        this.timerInterval = null;
        this.attempts = 0;
        
        // Statistiques
        this.totalWordsFound = 0;
        this.wordTimes = [];
        this.bestTime = null;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        
        // État du mot actuel
        this.isCurrentWordCorrect = false;
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateDifficultyCounts();
    }

    // Fonction pour normaliser les accents
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
            .trim();
    }

    initializeGame() {
        this.selectRandomWord();
        this.updateDisplay();
        this.startTimer();
        
        // Désactiver le bouton "Nouveau Mot" au démarrage
        this.disableNextWordButton();
        
        // Focus automatique au démarrage
        setTimeout(() => {
            const wordInput = document.getElementById('wordInput');
            wordInput.focus();
        }, 100);
    }

    selectRandomWord() {
        // Obtenir les mots de la difficulté sélectionnée
        let allWords = Object.keys(this.hints[this.currentDifficulty]);
        let availableWords = this.userManager.getAvailableWords(allWords);
        
        // Si l'utilisateur a trouvé tous les mots de cette difficulté, réinitialiser
        if (availableWords.length === 0) {
            this.userManager.wordsFound = [];
            availableWords = allWords;
            this.showFeedback(`🎉 Félicitations ! Tu as trouvé tous les mots du niveau ${this.currentDifficulty} ! Recommençons ! 🎉`, 'success');
        }
        
        this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        this.attempts = 0;
        
        // Afficher l'indice correspondant
        this.updateHint();
        
        // Debug : afficher le mot dans la console
        console.log(`🎮 MOT À DEVINER: "${this.currentWord.toUpperCase()}" (Difficulté: ${this.currentDifficulty})`);
    }

    updateHint() {
        const hintText = document.getElementById('hintText');
        if (this.hints[this.currentDifficulty][this.currentWord]) {
            hintText.textContent = this.hints[this.currentDifficulty][this.currentWord];
        } else {
            hintText.textContent = 'Devine le mot !';
        }
    }

    updateDisplay() {
        const wordDisplay = document.getElementById('wordDisplay');
        const wordInput = document.getElementById('wordInput');
        wordDisplay.innerHTML = '';
        
        // Mettre à jour la longueur maximale de l'input
        wordInput.maxLength = this.currentWord.length;
        
        for (let i = 0; i < this.currentWord.length; i++) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            letterBox.textContent = '?';
            wordDisplay.appendChild(letterBox);
        }
    }

    updateDisplayInRealTime(inputValue) {
        const wordDisplay = document.getElementById('wordDisplay');
        const letterBoxes = wordDisplay.children;
        const wordInput = document.getElementById('wordInput');
        
        // Limiter la longueur de l'input à la longueur du mot
        let input = inputValue;
        if (input.length > this.currentWord.length) {
            input = input.substring(0, this.currentWord.length);
            wordInput.value = input; // Mettre à jour la valeur de l'input
        }
        
        // Ajouter une classe visuelle pendant la frappe
        if (input.length > 0) {
            wordInput.classList.add('typing');
        } else {
            wordInput.classList.remove('typing');
        }
        
        // Analyser les lettres en temps réel si on a du texte
        let result = null;
        if (input.length > 0) {
            result = this.analyzeGuess(input);
        }
        
        // Mettre à jour toutes les boîtes
        for (let i = 0; i < letterBoxes.length; i++) {
            const letterBox = letterBoxes[i];
            
            if (i < input.length) {
                // Vérifier si la lettre était déjà correcte (verte)
                const wasCorrect = letterBox.classList.contains('letter-correct');
                
                // Si la lettre change, toujours réinitialiser et mettre à jour
                if (letterBox.textContent !== input[i].toUpperCase()) {
                    letterBox.textContent = input[i].toUpperCase();
                    letterBox.className = 'letter-box';
                }
                
                // Appliquer les couleurs en temps réel
                if (result && result.letterStates[i]) {
                    letterBox.classList.add(`letter-${result.letterStates[i]}`);
                }
                
                // Ajouter un effet de "pulse" pour les lettres en cours de frappe
                if (i === input.length - 1) {
                    letterBox.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        letterBox.style.animation = '';
                    }, 500);
                }
            } else {
                // Réinitialiser seulement si ce n'était pas une lettre correcte fixée
                if (!letterBox.classList.contains('letter-correct')) {
                    letterBox.textContent = '?';
                    letterBox.className = 'letter-box';
                }
            }
        }
        
        // Feedback en temps réel avec analyse
        if (input.length === 0) {
            this.showFeedback(`Devine le mot de ${this.currentWord.length} lettres ! 💭`, 'info');
        } else if (input.length < this.currentWord.length) {
            if (result) {
                const correctCount = result.correctPositions;
                const wrongPlaceCount = result.wrongPositions;
                this.showFeedback(`Continue ! ${correctCount} bonne(s) place(s), ${wrongPlaceCount} mauvaise(s) place(s) ✨`, 'info');
            } else {
                this.showFeedback(`Continue ! Tu as ${input.length}/${this.currentWord.length} lettres ✨`, 'info');
            }
        } else if (input.length === this.currentWord.length) {
            if (result && result.correct) {
                this.showFeedback(`🎉 BRAVO ! Tu as trouvé le mot ! 🎉`, 'success');
            } else if (result) {
                const correctCount = result.correctPositions;
                const wrongPlaceCount = result.wrongPositions;
                this.showFeedback(`Presque ! ${correctCount} bonne(s) place(s), ${wrongPlaceCount} mauvaise(s) place(s). Appuie sur Entrée ! 🎯`, 'warning');
            } else {
                this.showFeedback(`Parfait ! Tu as ${this.currentWord.length} lettres. Appuie sur Entrée ou clique sur "Deviner !" 🎯`, 'success');
            }
        } else {
            this.showFeedback(`Trop de lettres ! Le mot fait ${this.currentWord.length} lettres 📏`, 'warning');
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('timer').textContent = elapsed + 's';
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    setupEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => {
            if (this.isCurrentWordCorrect) {
                this.newGame();
            }
        });
        document.getElementById('statsToggleBtn').addEventListener('click', () => this.toggleStats());
        
        // Event listeners pour la connexion
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        document.getElementById('usernameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });
        
        // Event listeners pour la difficulté
        document.getElementById('easyBtn').addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('mediumBtn').addEventListener('click', () => this.setDifficulty('medium'));
        document.getElementById('hardBtn').addEventListener('click', () => this.setDifficulty('hard'));
        
        const wordInput = document.getElementById('wordInput');
        
        // Détection en temps réel de la frappe
        wordInput.addEventListener('input', (e) => {
            this.updateDisplayInRealTime(e.target.value);
        });
        
        // Détection quand le mot est complet et correct (sans passage automatique)
        wordInput.addEventListener('input', (e) => {
            const input = e.target.value;
            const normalizedInput = this.normalizeText(input);
            const normalizedWord = this.normalizeText(this.currentWord);
            
            if (input.length === this.currentWord.length && normalizedInput === normalizedWord) {
                // Mot correct détecté - afficher la victoire mais ne pas passer automatiquement
                this.showCorrectWord();
            }
        });

        // Détection de la touche Entrée pour nouveau mot (seulement si correct)
        wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.isCurrentWordCorrect) {
                    this.newGame();
                } else {
                    // Si le mot n'est pas correct, afficher un message d'encouragement
                    this.showFeedback('Continue ! Tu n\'as pas encore trouvé le bon mot ! 💪', 'warning');
                }
            }
        });
    }

    analyzeGuess(guess) {
        const normalizedGuess = this.normalizeText(guess);
        const normalizedWord = this.normalizeText(this.currentWord);
        
        const result = {
            correct: normalizedGuess === normalizedWord,
            correctLetters: 0,
            correctPositions: 0,
            wrongPositions: 0,
            letterStates: []
        };

        const wordLetters = normalizedWord.split('');
        const guessLetters = normalizedGuess.split('');
        const usedPositions = new Set();

        // Vérifier les lettres à la bonne place
        for (let i = 0; i < guessLetters.length; i++) {
            if (guessLetters[i] === wordLetters[i]) {
                result.correctPositions++;
                result.letterStates[i] = 'correct';
                usedPositions.add(i);
            }
        }

        // Vérifier les lettres à la mauvaise place
        for (let i = 0; i < guessLetters.length; i++) {
            if (result.letterStates[i] !== 'correct') {
                for (let j = 0; j < wordLetters.length; j++) {
                    if (!usedPositions.has(j) && guessLetters[i] === wordLetters[j]) {
                        result.wrongPositions++;
                        result.letterStates[i] = 'wrong-place';
                        usedPositions.add(j);
                        break;
                    }
                }
                if (result.letterStates[i] === undefined) {
                    result.letterStates[i] = 'wrong';
                }
            }
        }

        result.correctLetters = result.correctPositions + result.wrongPositions;
        return result;
    }

    displayResult(result, guess) {
        const wordDisplay = document.getElementById('wordDisplay');
        const letterBoxes = wordDisplay.children;
        
        for (let i = 0; i < guess.length; i++) {
            const letterBox = letterBoxes[i];
            letterBox.textContent = guess[i].toUpperCase();
            letterBox.className = 'letter-box';
            
            setTimeout(() => {
                letterBox.classList.add(`letter-${result.letterStates[i]}`);
            }, i * 100);
        }
    }

    generateFeedback(result, guess) {
        if (result.correctPositions === this.currentWord.length) {
            return 'Bravo ! Tu as trouvé le mot ! 🎉';
        }
        
        let feedback = `Lettres correctes : ${result.correctLetters}/${this.currentWord.length} `;
        
        if (result.correctPositions > 0) {
            feedback += `(${result.correctPositions} à la bonne place) `;
        }
        
        if (result.wrongPositions > 0) {
            feedback += `(${result.wrongPositions} à la mauvaise place) `;
        }
        
        if (result.correctLetters === 0) {
            feedback += 'Aucune lettre correcte. Essaie encore ! 💪';
        } else if (result.correctPositions === this.currentWord.length - 1) {
            feedback += 'Presque ! Tu y es presque ! 🔥';
        } else {
            feedback += 'Continue ! Tu progresses ! ⭐';
        }
        
        return feedback;
    }

    showCorrectWord() {
        this.stopTimer();
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Marquer le mot comme correct
        this.isCurrentWordCorrect = true;
        
        this.showFeedback(`🎉 BRAVO ! Tu as trouvé "${this.currentWord.toUpperCase()}" en ${timeElapsed}s ! Appuie sur Entrée ou clique sur "Nouveau Mot" ! 🎉`, 'success');
        this.createCelebration();
        
        // Vider le champ de saisie
        const input = document.getElementById('wordInput');
        input.value = '';
        input.classList.remove('typing');
        
        // Activer le bouton "Nouveau Mot"
        this.enableNextWordButton();
    }

    handleWin() {
        this.stopTimer();
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Mettre à jour les statistiques
        this.totalWordsFound++;
        this.wordTimes.push(timeElapsed);
        this.currentStreak++;
        this.correctAttempts++;
        this.totalAttempts++;
        
        // Meilleur temps
        if (this.bestTime === null || timeElapsed < this.bestTime) {
            this.bestTime = timeElapsed;
        }
        
        // Meilleure série
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        // Calculer les étoiles selon le temps et les tentatives
        let starsEarned = 3;
        if (this.attempts > 3) starsEarned = 2;
        if (this.attempts > 5) starsEarned = 1;
        if (timeElapsed > 60) starsEarned = Math.max(1, starsEarned - 1);
        
        this.stars += starsEarned;
        this.currentLevel++;
        
        // Sauvegarder le mot trouvé et les statistiques
        this.userManager.addWordFound(this.currentWord);
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
        
        this.showFeedback(`🎉 BRAVO ! Tu as trouvé "${this.currentWord.toUpperCase()}" en ${timeElapsed}s ! Appuie sur Entrée ou clique sur "Nouveau Mot" ! 🎉`, 'success');
        this.showStars(starsEarned);
        this.updateScore();
        this.updateStats();
        this.updateDifficultyCounts(); // Mettre à jour les compteurs de difficulté
        this.createCelebration();
        
        // Vider le champ de saisie
        const input = document.getElementById('wordInput');
        input.value = '';
        input.classList.remove('typing');
    }

    showStars(count) {
        const starsDisplay = document.getElementById('starsDisplay');
        starsDisplay.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '⭐';
            star.style.animationDelay = `${i * 0.2}s`;
            starsDisplay.appendChild(star);
        }
        
        setTimeout(() => {
            starsDisplay.innerHTML = '';
        }, 3000);
    }

    updateScore() {
        document.getElementById('stars').textContent = this.stars;
        document.getElementById('level').textContent = this.currentLevel;
        document.getElementById('levelIndicator').textContent = `Niveau ${this.currentLevel}`;
        document.getElementById('wordsFound').textContent = this.totalWordsFound;
    }

    updateStats() {
        // Mots trouvés
        document.getElementById('totalWords').textContent = this.totalWordsFound;
        
        // Temps moyen
        if (this.wordTimes.length > 0) {
            const avgTime = Math.round(this.wordTimes.reduce((a, b) => a + b, 0) / this.wordTimes.length);
            document.getElementById('avgTime').textContent = avgTime + 's';
        }
        
        // Meilleur temps
        if (this.bestTime !== null) {
            document.getElementById('bestTime').textContent = this.bestTime + 's';
        }
        
        // Série actuelle
        document.getElementById('currentStreak').textContent = this.currentStreak;
        
        // Meilleure série
        document.getElementById('bestStreak').textContent = this.bestStreak;
        
        // Précision
        if (this.totalAttempts > 0) {
            const accuracy = Math.round((this.correctAttempts / this.totalAttempts) * 100);
            document.getElementById('accuracy').textContent = accuracy + '%';
        }
    }

    toggleStats() {
        const statsSection = document.getElementById('statsSection');
        const toggleBtn = document.getElementById('statsToggleBtn');
        
        if (statsSection.classList.contains('hidden')) {
            // Afficher les statistiques
            statsSection.classList.remove('hidden');
            toggleBtn.textContent = '📊 Masquer les Statistiques';
            toggleBtn.classList.add('active');
        } else {
            // Masquer les statistiques
            statsSection.classList.add('hidden');
            toggleBtn.textContent = '📈 Voir les Statistiques';
            toggleBtn.classList.remove('active');
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
    }

    createCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)];
            celebration.appendChild(confetti);
        }
        
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 3000);
    }

    newGame() {
        // Mettre à jour les statistiques du mot précédent si il était correct
        if (this.isCurrentWordCorrect) {
            this.handleWin();
        }
        
        // Réinitialiser l'état
        this.isCurrentWordCorrect = false;
        
        this.stopTimer();
        this.selectRandomWord();
        this.updateDisplay();
        this.showFeedback(`Nouveau mot de ${this.currentWord.length} lettres ! Devine-le ! 💭`, 'info');
        this.startTimer();
        this.updateStats();
        
        // Réinitialiser complètement l'affichage des lettres
        const wordDisplay = document.getElementById('wordDisplay');
        const letterBoxes = wordDisplay.children;
        for (let i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].textContent = '?';
            letterBoxes[i].className = 'letter-box';
        }
        
        // Désactiver le bouton "Nouveau Mot"
        this.disableNextWordButton();
        
        // Focus automatique sur le champ de saisie
        const wordInput = document.getElementById('wordInput');
        wordInput.focus();
    }

    enableNextWordButton() {
        const newGameBtn = document.getElementById('newGameBtn');
        newGameBtn.disabled = false;
        newGameBtn.style.opacity = '1';
        newGameBtn.style.cursor = 'pointer';
        newGameBtn.textContent = 'Nouveau Mot';
    }

    disableNextWordButton() {
        const newGameBtn = document.getElementById('newGameBtn');
        newGameBtn.disabled = true;
        newGameBtn.style.opacity = '0.5';
        newGameBtn.style.cursor = 'not-allowed';
        newGameBtn.textContent = 'Trouve le mot d\'abord !';
    }

    // Gestion de la connexion
    handleLogin() {
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();
        
        if (!username) {
            this.showFeedback('Veuillez entrer un nom !', 'error');
            return;
        }
        
        if (this.userManager.login(username)) {
            this.showLoginSuccess();
            this.loadUserData();
            this.showFeedback(`Bienvenue ${username} ! Tes données ont été chargées.`, 'success');
        } else {
            this.showFeedback('Erreur lors de la connexion.', 'error');
        }
    }

    // Gestion de la déconnexion
    handleLogout() {
        this.userManager.logout();
        this.showLoginForm();
        this.resetGameStats();
        this.showFeedback('Déconnexion réussie. Tes données sont sauvegardées.', 'info');
    }

    // Afficher le formulaire de connexion
    showLoginForm() {
        document.getElementById('usernameInput').style.display = 'inline-block';
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('userInfo').classList.add('hidden');
    }

    // Afficher les informations utilisateur
    showLoginSuccess() {
        document.getElementById('usernameInput').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('currentUser').textContent = this.userManager.getCurrentUser();
    }

    // Charger les données utilisateur
    loadUserData() {
        if (this.userManager.isLoggedIn()) {
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
            
            this.updateScore();
            this.updateStats();
            this.updateDifficultyCounts(); // Mettre à jour les compteurs de difficulté
        }
    }

    // Réinitialiser les statistiques du jeu
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
        
        this.updateScore();
        this.updateStats();
    }

    // Changer la difficulté
    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        
        // Mettre à jour l'interface des boutons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${difficulty}Btn`).classList.add('active');
        
        // Afficher un message de confirmation
        const difficultyNames = {
            'easy': '🟢 Facile',
            'medium': '🟠 Moyen', 
            'hard': '🔴 Difficile'
        };
        this.showFeedback(`Niveau changé : ${difficultyNames[difficulty]}`, 'info');
        
        // Redémarrer le jeu avec la nouvelle difficulté
        this.newGame();
    }

    // Mettre à jour les compteurs de mots par difficulté
    updateDifficultyCounts() {
        const difficulties = ['easy', 'medium', 'hard'];
        
        difficulties.forEach(difficulty => {
            const allWords = Object.keys(this.hints[difficulty]);
            const foundWords = this.userManager.getWordsFound();
            const availableWords = allWords.filter(word => !foundWords.includes(word));
            const foundCount = allWords.filter(word => foundWords.includes(word)).length;
            
            const countElement = document.getElementById(`${difficulty}Count`);
            countElement.textContent = `(${foundCount}/${allWords.length})`;
        });
    }
}

// Démarrer le jeu
document.addEventListener('DOMContentLoaded', () => {
    new WordGuessingGame();
});
