// Gestionnaire des indices et aides
class HintManager {
    constructor() {
        this.domElements = {};
        this.cacheDOMElements();
        
        // Constantes
        this.EMOJI_REGEX = /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FAFF}])+/gu;
        
        // État
        this.helpUsedCount = 0;
        this.maxHelpAllowed = 1; // Par défaut 1 aide
        this.lastHelpedCursorPosition = -1; // Position du curseur lors de la dernière aide
    }
    
    // Définir le nombre maximum d'aides selon la difficulté
    setMaxHelp(difficulty) {
        if (difficulty === 'hard') {
            this.maxHelpAllowed = 2; // 2 aides en mode difficile
        } else {
            this.maxHelpAllowed = 1; // 1 aide en facile/moyen
        }
        this.updateHelpButton();
    }
    
    // Vérifier si l'aide est encore disponible
    canUseHelp() {
        return this.helpUsedCount < this.maxHelpAllowed;
    }
    
    // Mettre à jour le texte du bouton d'aide
    updateHelpButton() {
        if (!this.domElements.helpBtn) return;
        
        console.log(`🔄 updateHelpButton: ${this.helpUsedCount}/${this.maxHelpAllowed}`);
        
        if (this.helpUsedCount >= this.maxHelpAllowed) {
            this.domElements.helpBtn.classList.add('used');
            this.domElements.helpBtn.title = 'Aide épuisée';
            if (this.maxHelpAllowed > 1) {
                this.domElements.helpBtn.textContent = `💡${this.helpUsedCount}/${this.maxHelpAllowed}`;
            }
        } else {
            this.domElements.helpBtn.classList.remove('used');
            if (this.maxHelpAllowed > 1) {
                this.domElements.helpBtn.textContent = `💡${this.helpUsedCount}/${this.maxHelpAllowed}`;
                this.domElements.helpBtn.title = `Révéler une lettre (${this.maxHelpAllowed - this.helpUsedCount} restant${this.maxHelpAllowed - this.helpUsedCount > 1 ? 's' : ''})`;
            } else {
                this.domElements.helpBtn.textContent = '💡';
                this.domElements.helpBtn.title = 'Révéler une lettre';
            }
        }
    }
    
    // Mettre en cache les éléments DOM
    cacheDOMElements() {
        this.domElements = {
            hintText: document.getElementById('hintText'),
            helpBtn: document.getElementById('helpBtn'),
            revealedLetter: document.getElementById('revealedLetter')
        };
    }
    
    // Afficher l'indice
    showHint(hint) {
        if (hint) {
            const formattedHint = hint.replace(this.EMOJI_REGEX, '<span class="hint-icon">$1</span>');
            this.domElements.hintText.innerHTML = formattedHint;
        } else {
            this.domElements.hintText.innerHTML = 'Devine le mot !';
        }
    }
    
    // Afficher le bouton d'aide
    showHelpButton() {
        this.domElements.helpBtn.classList.remove('used');
        this.domElements.helpBtn.style.display = 'flex';
        this.updateHelpButton();
    }
    
    // Masquer le bouton d'aide
    hideHelpButton() {
        this.domElements.helpBtn.classList.add('used');
    }
    
    // Marquer l'aide comme utilisée
    markHelpUsed() {
        this.helpUsedCount++;
        this.updateHelpButton();
    }
    
    // Afficher l'indice pour la lettre
    showRevealedLetter(letter, position, difficulty) {
        const message = this.generateAlternativeHint(letter, position, difficulty);
        this.domElements.revealedLetter.textContent = message;
        this.domElements.revealedLetter.classList.remove('hidden');
    }
    
    // Masquer la lettre révélée
    hideRevealedLetter() {
        this.domElements.revealedLetter.classList.add('hidden');
        this.domElements.revealedLetter.textContent = '';
    }
    
    // Réinitialiser le bouton d'aide pour un nouveau mot
    resetHelp() {
        this.helpUsedCount = 0;
        this.lastHelpedCursorPosition = -1; // Réinitialiser la position du curseur
        this.domElements.helpBtn.classList.remove('used');
        this.hideRevealedLetter();
        this.updateHelpButton();
    }
    
    // Obtenir la position d'une lettre dans l'alphabet (A=1, B=2, etc.)
    getLetterPosition(letter) {
        return letter.toUpperCase().charCodeAt(0) - 64;
    }
    
    // Obtenir une lettre à partir de sa position dans l'alphabet
    getLetterFromPosition(position) {
        return String.fromCharCode(position + 64);
    }
    
    // Générer un calcul mathématique pour trouver la position
    generateMathHint(targetPosition) {
        const operations = ['addition', 'subtraction', 'multiplication'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let calculation = '';
        
        switch (operation) {
            case 'addition':
                // Générer deux nombres qui additionnés donnent la position
                const num1 = Math.floor(Math.random() * (targetPosition - 1)) + 1;
                const num2 = targetPosition - num1;
                calculation = `${num1} + ${num2}`;
                break;
                
            case 'subtraction':
                // Générer une soustraction
                const minuend = targetPosition + Math.floor(Math.random() * 10) + 1;
                const subtrahend = minuend - targetPosition;
                calculation = `${minuend} − ${subtrahend}`;
                break;
                
            case 'multiplication':
                // Trouver des facteurs de la position ou un calcul proche
                const factors = this.findFactors(targetPosition);
                if (factors.length > 0) {
                    const factorPair = factors[Math.floor(Math.random() * factors.length)];
                    calculation = `${factorPair[0]} × ${factorPair[1]}`;
                } else {
                    // Si pas de facteurs intéressants, utiliser addition
                    const n1 = Math.floor(Math.random() * (targetPosition - 1)) + 1;
                    const n2 = targetPosition - n1;
                    calculation = `${n1} + ${n2}`;
                }
                break;
        }
        
        return calculation;
    }
    
    // Trouver les paires de facteurs d'un nombre
    findFactors(num) {
        const factors = [];
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                factors.push([i, num / i]);
            }
        }
        return factors;
    }
    
    // Générer un indice de voisinage simple (lettre avant/après) - NIVEAU FACILE
    generateSimpleNeighborHint(letter) {
        const position = this.getLetterPosition(letter);
        const hints = [];
        
        // 1. Lettre après simple (si pas Z)
        if (position < 26) {
            const nextLetter = this.getLetterFromPosition(position + 1);
            hints.push(`C'est la lettre avant ${nextLetter}`);
        }
        
        // 2. Lettre avant simple (si pas A)
        if (position > 1) {
            const prevLetter = this.getLetterFromPosition(position - 1);
            hints.push(`C'est la lettre après ${prevLetter}`);
        }
        
        return hints[Math.floor(Math.random() * hints.length)];
    }
    
    // Générer un indice avec calcul +/- (ex: "Lettre après B+2") - NIVEAU DIFFICILE
    generateComplexNeighborHint(letter) {
        const position = this.getLetterPosition(letter);
        const hints = [];
        
        // 1. Lettre + opération (ex: "Lettre après B+2" pour D)
        if (position >= 3) {
            const offset = Math.floor(Math.random() * 3) + 1; // 1, 2, ou 3
            const baseLetter = this.getLetterFromPosition(position - offset);
            hints.push(`Lettre après ${baseLetter}+${offset}`);
        }
        
        // 2. Lettre - opération (ex: "Lettre avant F-2" pour D)
        if (position <= 24) {
            const offset = Math.floor(Math.random() * 3) + 1; // 1, 2, ou 3
            const baseLetter = this.getLetterFromPosition(position + offset);
            hints.push(`Lettre avant ${baseLetter}-${offset}`);
        }
        
        return hints[Math.floor(Math.random() * hints.length)];
    }
    
    // Générer un indice alternatif selon le niveau de difficulté
    generateAlternativeHint(letter, position, difficulty) {
        const letterPosition = this.getLetterPosition(letter);
        let hintMessage = '';
        
        // EASY : Indice simple (lettre avant/après)
        if (difficulty === 'easy') {
            const neighborHint = this.generateSimpleNeighborHint(letter);
            hintMessage = `💡 ${neighborHint}`;
        }
        // MEDIUM : Calcul de position dans l'alphabet
        else if (difficulty === 'medium') {
            const calculation = this.generateMathHint(letterPosition);
            hintMessage = `💡 Position dans l'alphabet = ${calculation}`;
        }
        // HARD : Calcul avec +/- (ex: "Lettre après B+2")
        else if (difficulty === 'hard') {
            const complexHint = this.generateComplexNeighborHint(letter);
            hintMessage = `💡 ${complexHint}`;
        }
        
        return hintMessage;
    }
    
    // Révéler la prochaine lettre manquante
    revealNextLetter(currentWord, letterBoxes, currentCursorPosition, difficulty) {
        if (!this.canUseHelp()) {
            return null;
        }
        
        // BLOQUER si le curseur n'a pas bougé depuis la dernière aide
        if (this.lastHelpedCursorPosition === currentCursorPosition) {
            console.log(`⚠️ Aide bloquée : Curseur toujours à la position ${currentCursorPosition}. Tape une lettre d'abord !`);
            return null;
        }
        
        // Trouver la prochaine lettre manquante (à partir de la position du curseur)
        let nextMissingIndex = -1;
        for (let i = 0; i < currentWord.length; i++) {
            const box = letterBoxes[i];
            const isCorrect = box.classList.contains('letter-correct');
            
            // Chercher une lettre non correcte
            if (!isCorrect) {
                nextMissingIndex = i;
                break;
            }
        }
        
        if (nextMissingIndex !== -1) {
            const revealedLetter = currentWord[nextMissingIndex];
            this.showRevealedLetter(revealedLetter, nextMissingIndex, difficulty);
            this.lastHelpedCursorPosition = currentCursorPosition; // Sauvegarder la position du curseur
            this.markHelpUsed();
            
            console.log(`💡 Aide ${this.helpUsedCount}/${this.maxHelpAllowed} : Lettre à position ${nextMissingIndex + 1} (curseur était à ${currentCursorPosition})`);
            
            return {
                letter: revealedLetter,
                position: nextMissingIndex
            };
        }
        
        return null;
    }
    
    // Vérifier si l'aide a été utilisée
    isUsed() {
        return this.helpUsedCount > 0;
    }
    
    // Réinitialiser l'état d'utilisation de l'aide
    resetUsageState() {
        this.helpUsedCount = 0;
        this.lastHelpedCursorPosition = -1;
        this.updateHelpButton();
    }
    
    // Réinitialiser la position du curseur (quand l'utilisateur tape une lettre)
    resetCursorTracking() {
        this.lastHelpedCursorPosition = -1;
    }
}

