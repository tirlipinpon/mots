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
    }
    
    // Gérer les touches du clavier
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
    }
    
    // Obtenir l'input actuel
    getCurrentInput() {
        return this.currentInput;
    }
}

