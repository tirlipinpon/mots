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
    
    // Sélectionner un mot aléatoire (avec support filtrage par catégorie)
    selectRandomWord(difficulty, userManager, categoryFilter = 'toutes') {
        // TOUS les mots du niveau (pour vérifier complétion totale)
        const allWordsInLevel = Object.keys(this.hints[difficulty]);
        
        // Mots de la catégorie filtrée
        let filteredWords = allWordsInLevel;
        if (categoryFilter && categoryFilter !== 'toutes' && typeof getWordsByCategory === 'function') {
            filteredWords = getWordsByCategory(categoryFilter, difficulty, this.hints);
            console.log(`🗂️ Filtre catégorie "${categoryFilter}": ${filteredWords.length} mots disponibles`);
        }
        
        let availableWords = filteredWords;
        
        // Filtrer les mots déjà trouvés seulement si l'utilisateur est connecté
        if (userManager.isLoggedIn()) {
            availableWords = userManager.getAvailableWords(filteredWords, difficulty);
            
            console.log(`🔍 Sélection mot ${difficulty}: ${availableWords.length}/${filteredWords.length} disponibles`);
            
            // Si aucun mot disponible dans la catégorie filtrée
            if (availableWords.length === 0) {
                // Vérifier si TOUS les mots du niveau (pas juste la catégorie) sont complétés
                const allAvailableWords = userManager.getAvailableWords(allWordsInLevel, difficulty);
                const isLevelComplete = allAvailableWords.length === 0;
                
                if (isLevelComplete) {
                    console.log(`🏆 Tous les mots ${difficulty} du NIVEAU trouvés !`);
                    return {
                        word: null,
                        allWordsCompleted: true,
                        categoryCompleted: false
                    };
                } else {
                    console.log(`🎉 Catégorie "${categoryFilter}" complétée !`);
                    return {
                        word: null,
                        allWordsCompleted: false,
                        categoryCompleted: true
                    };
                }
            }
        }
        
        return {
            word: availableWords[Math.floor(Math.random() * availableWords.length)],
            allWordsCompleted: false,
            categoryCompleted: false
        };
    }
    
    // Obtenir l'indice d'un mot (supporte ancien et nouveau format)
    getHint(word, difficulty) {
        const data = this.hints[difficulty][word];
        
        if (!data) return null;
        
        // Nouveau format: { hint: "...", category: "..." }
        if (typeof data === 'object' && data.hint) {
            return data.hint;
        }
        
        // Ancien format: "indice direct"
        return data;
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
