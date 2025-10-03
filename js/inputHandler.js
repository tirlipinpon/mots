// Gestionnaire des entrées clavier
class InputHandler {
    constructor(game) {
        this.game = game;
        this.currentInput = '';
        this.previousInputValue = '';
        
        this.setupKeyboardListeners();
    }
    
    // Configurer les événements clavier
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.setupMobileInput();
    }
    
    // Configuration spécifique pour mobile
    setupMobileInput() {
        const mobileInput = document.getElementById('mobileInput');
        if (!mobileInput) return;
        
        // Auto-focus sur mobile au clic sur les letter boxes OU l'indice
        const wordDisplay = document.getElementById('wordDisplay');
        const hintSection = document.getElementById('hintSection');
        
        const focusMobile = () => {
            if (this.isMobileDevice()) {
                mobileInput.focus();
            }
        };
        
        if (wordDisplay) {
            wordDisplay.addEventListener('click', focusMobile);
        }
        
        if (hintSection) {
            hintSection.addEventListener('click', focusMobile);
        }
        
        // Focus aussi au clic sur la zone de feedback
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.addEventListener('click', focusMobile);
        }
        
        // Capturer l'input mobile
        mobileInput.addEventListener('input', (e) => {
            const value = e.target.value.toUpperCase();
            
            if (value.length > this.previousInputValue.length) {
                // Nouvelle lettre ajoutée
                const newLetter = value[value.length - 1];
                if (/[A-Z-]/.test(newLetter)) {
                    this.simulateKeyPress(newLetter);
                }
            } else if (value.length < this.previousInputValue.length) {
                // Backspace
                this.simulateBackspace();
            }
            
            this.previousInputValue = value;
            
            // Réinitialiser l'input pour permettre de continuer la saisie
            setTimeout(() => {
                e.target.value = '';
                this.previousInputValue = '';
            }, 10);
        });
        
        // Garder le focus sur mobile SEULEMENT si pas sur input/select
        mobileInput.addEventListener('blur', () => {
            const activeElement = document.activeElement;
            const isLoginInput = activeElement && activeElement.id === 'usernameInput';
            const isCategorySelect = activeElement && activeElement.id === 'categorySelect';
            const isAnySelect = activeElement && activeElement.tagName === 'SELECT';
            
            if (this.isMobileDevice() && !this.game.isCurrentWordCorrect && !isLoginInput && !isCategorySelect && !isAnySelect) {
                setTimeout(() => {
                    // Vérifier à nouveau si on n'est pas sur un select ou input
                    const nowActive = document.activeElement;
                    const isStillLoginInput = nowActive && nowActive.id === 'usernameInput';
                    const isStillSelect = nowActive && (nowActive.tagName === 'SELECT' || nowActive.id === 'categorySelect');
                    
                    if (!isStillLoginInput && !isStillSelect) {
                        mobileInput.focus();
                    }
                }, 100);
            }
        });
        
        // NE PAS auto-focus au démarrage - attendre que l'utilisateur clique
        // Cela permet de ne pas bloquer l'input de connexion
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    }
    
    simulateKeyPress(letter) {
        const e = { key: letter, preventDefault: () => {} };
        this.handleKeyPress(e);
    }
    
    simulateBackspace() {
        const e = { key: 'Backspace', preventDefault: () => {} };
        this.handleKeyPress(e);
    }
    
    // Gérer les touches du clavier
    handleKeyPress(e) {
        // Ignorer les touches si un input est focus (login, etc.) SAUF mobileInput
        if (document.activeElement.tagName === 'INPUT' && document.activeElement.id !== 'mobileInput') {
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
        
        // Lettres (a-z, A-Z) et trait d'union
        if (e.key.length === 1 && /[a-zA-Z-]/.test(e.key)) {
            e.preventDefault();
            
            const letterBoxes = this.game.ui.domElements.wordDisplay.children;
            const cursorPosition = this.game.ui.getCursorPosition();
            
            // Vérifier si on a une position valide
            if (cursorPosition === -1 || cursorPosition >= this.game.currentWord.length) {
                this.game.ui.showFeedback('⚠️ Mot complet ! Utilise Backspace pour corriger ⬅️', 'warning');
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
    
    // Traiter l'input de l'utilisateur
    handleInput(inputValue) {
        const letterBoxes = this.game.ui.domElements.wordDisplay.children;
        
        // Compter les lettres vertes consécutives
        const consecutiveGreenCount = this.game.wordManager.countConsecutiveGreenLetters(letterBoxes);
        
        // Limiter la longueur
        let input = inputValue;
        if (input.length > this.game.currentWord.length) {
            input = input.substring(0, this.game.currentWord.length);
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
                this.game.ui.showFeedback('Tu ne peux pas supprimer les lettres vertes ! 🚫', 'warning');
                return;
            }
        }
        
        // Analyser la tentative
        let result = null;
        if (input.length > 0) {
            result = this.game.wordManager.analyzeGuess(input, this.game.currentWord);
        }
        
        // Mettre à jour l'affichage
        this.game.ui.updateLetterBoxes(input, result ? result.letterStates : null);
        
        // Jouer les sons en fonction des lettres
        if (result && result.letterStates && input.length > this.previousInputValue.length) {
            const lastLetterState = result.letterStates[input.length - 1];
            
            if (lastLetterState === 'correct') {
                this.game.soundManager.play('letterCorrect');
            } else if (lastLetterState === 'wrong-place') {
                this.game.soundManager.play('letterWrongPlace');
            } else if (lastLetterState === 'wrong') {
                this.game.soundManager.play('letterWrong');
            }
        }
        
        // Vérifier si la lettre révélée par le hint a été trouvée
        if (result && result.letterStates) {
            for (let i = 0; i < result.letterStates.length; i++) {
                if (result.letterStates[i] === 'correct') {
                    // Une lettre est devenue verte, masquer le hint révélé
                    this.game.hintManager.hideRevealedLetter();
                    break;
                }
            }
        }
        
        // Vérifier si le mot est trouvé
        if (input.length > 0 && this.game.wordManager.areAllLettersCorrect(letterBoxes)) {
            if (!this.game.isCurrentWordCorrect) {
                this.game.showCorrectWord();
            }
        }
        
        // Feedback
        this.provideFeedback(input, result);
        
        this.previousInputValue = input;
    }
    
    // Fournir un feedback à l'utilisateur
    provideFeedback(input, result) {
        if (input.length === 0) {
            this.game.ui.showFeedback(`Devine le mot de ${this.game.currentWord.length} lettres ! 💭`, 'info');
        } else if (input.length < this.game.currentWord.length) {
            if (result) {
                this.game.ui.showFeedback(`Continue ! ${result.correctPositions} bonne(s) place(s), ${result.wrongPositions} mauvaise(s) place(s) ✨`, 'info');
            } else {
                this.game.ui.showFeedback(`Continue ! Tu as ${input.length}/${this.game.currentWord.length} lettres ✨`, 'info');
            }
        } else if (input.length === this.game.currentWord.length) {
            if (result && result.correct) {
                this.game.ui.showFeedback(`🎉 BRAVO ! Tu as trouvé le mot ! 🎉`, 'success');
            } else if (result) {
                this.game.ui.showFeedback(`Presque ! ${result.correctPositions} bonne(s) place(s), ${result.wrongPositions} mauvaise(s) place(s). Appuie sur Entrée ! 🎯`, 'warning');
            }
        }
    }
    
    // Réinitialiser l'input
    reset() {
        this.currentInput = '';
        this.previousInputValue = '';
        
        // Réinitialiser et refocus sur mobile
        const mobileInput = document.getElementById('mobileInput');
        if (mobileInput && this.isMobileDevice()) {
            mobileInput.value = '';
            setTimeout(() => {
                mobileInput.focus();
            }, 100);
        }
    }
    
    // Obtenir l'input actuel
    getCurrentInput() {
        return this.currentInput;
    }
}

