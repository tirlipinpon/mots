// Gestionnaire des indices et aides
class HintManager {
    constructor() {
        this.domElements = {};
        this.cacheDOMElements();
        
        // Constantes
        this.EMOJI_REGEX = /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FAFF}])+/gu;
        
        // État
        this.isHelpUsed = false;
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
    }
    
    // Masquer le bouton d'aide
    hideHelpButton() {
        this.domElements.helpBtn.classList.add('used');
    }
    
    // Afficher l'indice pour la lettre
    showRevealedLetter(letter, position) {
        const message = this.generateAlternativeHint(letter, position);
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
        this.showHelpButton();
        this.hideRevealedLetter();
        this.isHelpUsed = false;
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
    
    // Générer un indice de voisinage (lettre avant/après)
    generateNeighborHint(letter) {
        const position = this.getLetterPosition(letter);
        const hints = [];
        
        // Lettre après (si pas Z)
        if (position < 26) {
            const nextLetter = this.getLetterFromPosition(position + 1);
            hints.push(`C'est la lettre avant ${nextLetter}`);
        }
        
        // Lettre avant (si pas A)
        if (position > 1) {
            const prevLetter = this.getLetterFromPosition(position - 1);
            hints.push(`C'est la lettre après ${prevLetter}`);
        }
        
        return hints[Math.floor(Math.random() * hints.length)];
    }
    
    // Générer un indice alternatif (calcul ou voisinage)
    generateAlternativeHint(letter, position) {
        const letterPosition = this.getLetterPosition(letter);
        const hintTypes = ['math', 'neighbor'];
        const hintType = hintTypes[Math.floor(Math.random() * hintTypes.length)];
        
        let hintMessage = '';
        
        if (hintType === 'math') {
            const calculation = this.generateMathHint(letterPosition);
            hintMessage = `💡 Position dans l'alphabet = ${calculation}`;
        } else {
            const neighborHint = this.generateNeighborHint(letter);
            hintMessage = `💡 ${neighborHint}`;
        }
        
        return hintMessage;
    }
    
    // Révéler la prochaine lettre manquante
    revealNextLetter(currentWord, letterBoxes) {
        if (this.isHelpUsed) {
            return null;
        }
        
        // Trouver la prochaine lettre manquante
        let nextMissingIndex = -1;
        for (let i = 0; i < currentWord.length; i++) {
            const box = letterBoxes[i];
            const isCorrect = box.classList.contains('letter-correct');
            
            if (!isCorrect) {
                nextMissingIndex = i;
                break;
            }
        }
        
        if (nextMissingIndex !== -1) {
            const revealedLetter = currentWord[nextMissingIndex];
            this.showRevealedLetter(revealedLetter, nextMissingIndex);
            this.hideHelpButton();
            this.isHelpUsed = true;
            
            return {
                letter: revealedLetter,
                position: nextMissingIndex
            };
        }
        
        return null;
    }
    
    // Vérifier si l'aide a été utilisée
    isUsed() {
        return this.isHelpUsed;
    }
    
    // Réinitialiser l'état d'utilisation de l'aide
    resetUsageState() {
        this.isHelpUsed = false;
    }
}

