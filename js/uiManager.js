// Gestionnaire de l'interface utilisateur
class UIManager {
    constructor() {
        this.domElements = {};
        this.cacheDOMElements();
        
        // Constantes
        this.DIFFICULTY_NAMES = {
            'easy': '🟢 Facile',
            'medium': '🟠 Moyen', 
            'hard': '🔴 Difficile'
        };
    }
    
    // Mettre en cache les éléments DOM
    cacheDOMElements() {
        this.domElements = {
            wordDisplay: document.getElementById('wordDisplay'),
            feedback: document.getElementById('feedback'),
            timer: document.getElementById('timer'),
            starsDisplay: document.getElementById('starsDisplay'),
            scoreSection: document.getElementById('scoreSection'),
            difficultySection: document.querySelector('.difficulty-section'),
            levelStatus: document.getElementById('levelStatus'),
            usernameInput: document.getElementById('usernameInput'),
            loginBtn: document.getElementById('loginBtn'),
            logoutBtn: document.getElementById('logoutBtn'),
            userInfo: document.getElementById('userInfo'),
            currentUser: document.getElementById('currentUser'),
            scoreToggle: document.getElementById('scoreToggle'),
            scoreContent: document.getElementById('scoreContent'),
            // Boutons de difficulté
            easyBtn: document.getElementById('easyBtn'),
            mediumBtn: document.getElementById('mediumBtn'),
            hardBtn: document.getElementById('hardBtn'),
            // Compteurs de difficulté
            easyCount: document.getElementById('easyCount'),
            mediumCount: document.getElementById('mediumCount'),
            hardCount: document.getElementById('hardCount'),
            // Stats
            stars: document.getElementById('stars'),
            level: document.getElementById('level'),
            wordsFound: document.getElementById('wordsFound'),
            totalWords: document.getElementById('totalWords'),
            avgTime: document.getElementById('avgTime'),
            bestTime: document.getElementById('bestTime'),
            currentStreak: document.getElementById('currentStreak'),
            bestStreak: document.getElementById('bestStreak'),
            accuracy: document.getElementById('accuracy'),
            wordsEasy: document.getElementById('wordsEasy'),
            wordsMedium: document.getElementById('wordsMedium'),
            wordsHard: document.getElementById('wordsHard'),
            sessionTime: document.getElementById('sessionTime'),
            totalGameTime: document.getElementById('totalGameTime'),
            perfectGames: document.getElementById('perfectGames'),
            progressionTrend: document.getElementById('progressionTrend'),
            difficultLetters: document.getElementById('difficultLetters')
        };
    }
    
    // Créer l'affichage des boîtes de lettres
    createLetterBoxes(wordLength) {
        this.domElements.wordDisplay.innerHTML = '';
        
        for (let i = 0; i < wordLength; i++) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            letterBox.textContent = '?';
            this.domElements.wordDisplay.appendChild(letterBox);
        }
        
        // Mettre le curseur sur la première boîte
        this.updateCursor(0);
    }
    
    // Mettre à jour l'affichage des lettres
    updateLetterBoxes(input, letterStates) {
        const letterBoxes = this.domElements.wordDisplay.children;
        
        for (let i = 0; i < letterBoxes.length; i++) {
            const letterBox = letterBoxes[i];
            
            // Ne jamais modifier une lettre verte (correcte)
            if (letterBox.classList.contains('letter-correct')) {
                continue;
            }
            
            if (i < input.length) {
                if (letterBox.textContent !== input[i].toUpperCase()) {
                    letterBox.textContent = input[i].toUpperCase();
                    letterBox.className = 'letter-box';
                }
                
                if (letterStates && letterStates[i]) {
                    letterBox.classList.add(`letter-${letterStates[i]}`);
                }
                
                if (i === input.length - 1) {
                    letterBox.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        letterBox.style.animation = '';
                    }, 500);
                }
            } else {
                letterBox.textContent = '?';
                letterBox.className = 'letter-box';
            }
        }
        
        // Mettre à jour le curseur visuel (calculer la vraie position)
        this.updateCursorFromInput(input, letterBoxes);
    }
    
    // Mettre à jour le curseur visuel basé sur l'input
    updateCursorFromInput(input, letterBoxes) {
        console.log('🎯 Mise à jour curseur - input:', input);
        
        // Retirer le curseur de toutes les boîtes
        for (let i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].classList.remove('letter-cursor');
        }
        
        // Trouver la première boîte non-verte (rouge, orange, ou vide)
        // On parcourt de gauche à droite
        let targetPosition = -1;
        
        for (let i = 0; i < letterBoxes.length; i++) {
            const box = letterBoxes[i];
            const isGreen = box.classList.contains('letter-correct');
            const isEmpty = box.textContent === '?';
            const hasLetter = box.textContent !== '?';
            
            console.log(`Position ${i}: "${box.textContent}" - Verte:${isGreen}, Vide:${isEmpty}`);
            
            // On cherche la première boîte qui est :
            // - Soit vide (?)
            // - Soit avec une lettre incorrecte (rouge/orange)
            if (!isGreen) {
                targetPosition = i;
                console.log(`📍 Curseur trouvé sur position ${i} (première non-verte)`);
                break;
            }
        }
        
        // Si on a trouvé une position, ajouter le curseur
        if (targetPosition !== -1 && targetPosition < letterBoxes.length) {
            letterBoxes[targetPosition].classList.add('letter-cursor');
            console.log('✅ Curseur ajouté sur position:', targetPosition);
        } else {
            console.log('⚠️ Aucune position valide - pas de curseur (toutes vertes?)');
        }
        
        // Retourner la position pour l'utiliser dans game.js
        return targetPosition;
    }
    
    // Obtenir la position actuelle du curseur
    getCursorPosition() {
        const letterBoxes = this.domElements.wordDisplay.children;
        for (let i = 0; i < letterBoxes.length; i++) {
            if (letterBoxes[i].classList.contains('letter-cursor')) {
                return i;
            }
        }
        return -1;
    }
    
    // Mettre à jour le curseur visuel (version simple pour reset)
    updateCursor(currentPosition) {
        const letterBoxes = this.domElements.wordDisplay.children;
        
        // Retirer le curseur de toutes les boîtes
        for (let i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].classList.remove('letter-cursor');
        }
        
        // Trouver la prochaine position non-verte à partir de currentPosition
        let targetPosition = currentPosition;
        while (targetPosition < letterBoxes.length && 
               letterBoxes[targetPosition].classList.contains('letter-correct')) {
            targetPosition++;
        }
        
        // Ajouter le curseur sur la prochaine position disponible
        if (targetPosition < letterBoxes.length) {
            letterBoxes[targetPosition].classList.add('letter-cursor');
        }
    }
    
    // Afficher l'effet de victoire
    showVictoryEffect() {
        const letterBoxes = Array.from(this.domElements.wordDisplay.children);
        letterBoxes.forEach((letterBox, i) => {
            // Retirer le curseur
            letterBox.classList.remove('letter-cursor');
            setTimeout(() => {
                if (letterBox && letterBox.classList) {
                    letterBox.classList.add('letter-victory');
                }
            }, i * 100);
        });
    }
    
    // Afficher les étoiles
    showStars(count) {
        this.domElements.starsDisplay.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '⭐';
            star.style.animationDelay = `${i * 0.2}s`;
            this.domElements.starsDisplay.appendChild(star);
        }
        
        setTimeout(() => {
            this.domElements.starsDisplay.innerHTML = '';
        }, 3000);
    }
    
    // Afficher un message de feedback
    showFeedback(message, type) {
        this.domElements.feedback.textContent = message;
        this.domElements.feedback.className = `feedback ${type}`;
    }
    
    // Créer l'animation de célébration
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
    
    // Méthode dépréciée - conservée pour compatibilité
    clearInput() {
        // Plus d'input à vider - géré par la variable interne dans game.js
    }
    
    // Méthode dépréciée - conservée pour compatibilité
    focusInput() {
        // Plus d'input sur lequel mettre le focus
    }
    
    // Réinitialiser l'affichage des lettres
    resetLetterBoxes() {
        const letterBoxes = this.domElements.wordDisplay.children;
        for (let i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].textContent = '?';
            letterBoxes[i].className = 'letter-box';
            letterBoxes[i].classList.remove('letter-victory');
        }
        
        // Remettre le curseur sur la première position
        this.updateCursor(0);
    }
    
    // Afficher/masquer les sections selon l'état de connexion
    updateVisibilityForLogin(isLoggedIn) {
        this.domElements.scoreSection.style.display = isLoggedIn ? 'block' : 'none';
        this.domElements.difficultySection.style.display = isLoggedIn ? 'block' : 'none';
        
        if (isLoggedIn) {
            this.domElements.usernameInput.style.display = 'none';
            this.domElements.loginBtn.style.display = 'none';
            this.domElements.userInfo.classList.remove('hidden');
        } else {
            this.domElements.usernameInput.style.display = 'inline-block';
            this.domElements.loginBtn.style.display = 'inline-block';
            this.domElements.userInfo.classList.add('hidden');
        }
    }
    
    // Mettre à jour le niveau
    updateLevelDisplay(level, isLoggedIn) {
        if (isLoggedIn) {
            this.domElements.levelStatus.textContent = `Niveau ${level}`;
            this.domElements.levelStatus.style.display = 'block';
        } else {
            this.domElements.levelStatus.style.display = 'none';
        }
    }
    
    // Mettre à jour les boutons de difficulté
    updateDifficultyButtons(currentDifficulty) {
        const difficulties = ['easy', 'medium', 'hard'];
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.domElements[`${currentDifficulty}Btn`].classList.add('active');
    }
    
    // Mettre à jour les compteurs de difficulté
    updateDifficultyCounts(difficultyCounts, isLoggedIn) {
        Object.entries(difficultyCounts).forEach(([difficulty, data]) => {
            const countElement = this.domElements[`${difficulty}Count`];
            if (isLoggedIn) {
                countElement.textContent = `(${data.found}/${data.total})`;
            } else {
                countElement.textContent = `(${data.total})`;
            }
        });
    }
    
    // Mettre à jour les scores
    updateScore(stars, level, wordsFound) {
        this.domElements.stars.textContent = stars;
        this.domElements.level.textContent = level;
        this.domElements.wordsFound.textContent = wordsFound;
    }
    
    // Mettre à jour les statistiques
    updateStats(stats, formatTimeFn) {
        this.domElements.totalWords.textContent = stats.totalWordsFound;
        
        if (stats.avgTime) {
            this.domElements.avgTime.textContent = formatTimeFn(stats.avgTime);
        }
        
        if (stats.bestTime !== null) {
            this.domElements.bestTime.textContent = formatTimeFn(stats.bestTime);
        }
        
        this.domElements.currentStreak.textContent = stats.currentStreak;
        this.domElements.bestStreak.textContent = stats.bestStreak;
        
        if (stats.accuracy) {
            this.domElements.accuracy.textContent = stats.accuracy + '%';
        }
        
        // Statistiques avancées
        if (stats.advanced) {
            this.domElements.wordsEasy.textContent = stats.advanced.wordsByDifficulty.easy;
            this.domElements.wordsMedium.textContent = stats.advanced.wordsByDifficulty.medium;
            this.domElements.wordsHard.textContent = stats.advanced.wordsByDifficulty.hard;
            this.domElements.sessionTime.textContent = formatTimeFn(stats.advanced.sessionTime);
            this.domElements.totalGameTime.textContent = formatTimeFn(stats.advanced.totalGameTime);
            this.domElements.perfectGames.textContent = stats.advanced.perfectGames;
            this.domElements.progressionTrend.textContent = stats.advanced.progressionTrend;
            
            const difficultLetters = stats.advanced.difficultLetters;
            if (difficultLetters.length > 0) {
                const topLetter = difficultLetters[0];
                this.domElements.difficultLetters.textContent = `${topLetter.letter} (${topLetter.errors})`;
            } else {
                this.domElements.difficultLetters.textContent = '-';
            }
        }
    }
    
    // Mettre à jour le nom d'utilisateur
    setCurrentUser(username) {
        this.domElements.currentUser.textContent = username;
    }
}
