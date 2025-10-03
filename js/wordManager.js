// Gestionnaire de la logique des mots
class WordManager {
    constructor(gameData) {
        this.hints = gameData;
    }
    
    // Fonction pour normaliser les accents
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }
    
    // Sélectionner un mot aléatoire
    selectRandomWord(difficulty, userManager) {
        let allWords = Object.keys(this.hints[difficulty]);
        let availableWords = allWords;
        
        // Filtrer les mots déjà trouvés seulement si l'utilisateur est connecté
        if (userManager.isLoggedIn()) {
            availableWords = userManager.getAvailableWords(allWords, difficulty);
            
            console.log(`🔍 Sélection mot ${difficulty}: ${availableWords.length}/${allWords.length} disponibles`);
            
            // Si tous les mots sont trouvés, signaler la complétion
            if (availableWords.length === 0) {
                console.log(`🏆 Tous les mots ${difficulty} trouvés !`);
                return {
                    word: null,
                    allWordsCompleted: true
                };
            }
        }
        
        return {
            word: availableWords[Math.floor(Math.random() * availableWords.length)],
            allWordsCompleted: false
        };
    }
    
    // Obtenir l'indice d'un mot
    getHint(word, difficulty) {
        return this.hints[difficulty][word] || null;
    }
    
    // Analyser une tentative
    analyzeGuess(guess, targetWord) {
        const normalizedGuess = this.normalizeText(guess);
        const normalizedWord = this.normalizeText(targetWord);
        
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
    
    // Vérifier si toutes les lettres sont correctes
    areAllLettersCorrect(letterBoxes) {
        for (let i = 0; i < letterBoxes.length; i++) {
            if (!letterBoxes[i].classList.contains('letter-correct')) {
                return false;
            }
        }
        return true;
    }
    
    // Compter les lettres vertes consécutives depuis le début
    countConsecutiveGreenLetters(letterBoxes) {
        let count = 0;
        for (let i = 0; i < letterBoxes.length; i++) {
            if (letterBoxes[i] && letterBoxes[i].classList.contains('letter-correct')) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }
    
    // Obtenir tous les mots d'une difficulté
    getWordsByDifficulty(difficulty) {
        return Object.keys(this.hints[difficulty]);
    }
}
