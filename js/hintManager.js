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
    
    // Afficher la lettre révélée
    showRevealedLetter(letter, position) {
        const message = `💡 lettre n°${position + 1} est "${letter.toUpperCase()}"`;
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

