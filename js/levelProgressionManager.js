// Gestionnaire de la progression des niveaux
class LevelProgressionManager {
    constructor(game) {
        this.game = game;
        
        this.LEVEL_NAMES = {
            easy: '🟢 Facile',
            medium: '🟠 Moyen',
            hard: '🔴 Difficile'
        };
    }
    
    // Gérer la complétion d'un niveau
    handleLevelCompleted(completedLevel) {
        console.log(`🏆 handleLevelCompleted appelé pour: ${completedLevel}`);
        
        // Bloquer le bouton du niveau complété
        this.game.ui.disableDifficultyButton(completedLevel);
        
        // Félicitations pour le niveau
        this.game.soundManager.play('levelCompleted');
        this.game.ui.showFeedback(`🎉 BRAVO ! Niveau ${this.LEVEL_NAMES[completedLevel]} complété ! 🎉`, 'success');
        this.game.ui.createCelebration();
        
        // Vérifier si tous les niveaux sont complétés
        const allLevelsCompleted = this.checkAllLevelsCompleted();
        
        if (allLevelsCompleted) {
            // Tous les niveaux sont terminés !
            setTimeout(() => {
                this.game.ui.showFeedback(`🏆 FÉLICITATIONS ! Tu as terminé TOUS les niveaux du jeu ! 🏆 Tu es un CHAMPION ! 👑`, 'success');
                this.game.ui.createCelebration();
            }, 2000);
        } else {
            // Passer au niveau suivant
            setTimeout(() => {
                const nextLevel = this.getNextAvailableLevel(completedLevel);
                if (nextLevel) {
                    this.game.setDifficulty(nextLevel);
                    this.game.ui.showFeedback(`⬆️ Passage au niveau ${this.LEVEL_NAMES[nextLevel]} ! 💪`, 'info');
                }
            }, 3000);
        }
    }
    
    // Vérifier si tous les niveaux sont complétés
    checkAllLevelsCompleted() {
        if (!this.game.userManager.isLoggedIn()) return false;
        
        const difficulties = ['easy', 'medium', 'hard'];
        
        for (const difficulty of difficulties) {
            const allWords = this.game.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.game.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length < allWords.length) {
                return false; // Il reste des mots dans ce niveau
            }
        }
        
        console.log('🏆 TOUS LES NIVEAUX COMPLÉTÉS !');
        return true;
    }
    
    // Obtenir le prochain niveau disponible
    getNextAvailableLevel(currentLevel) {
        if (!this.game.userManager.isLoggedIn()) return null;
        
        const levelOrder = ['easy', 'medium', 'hard'];
        const currentIndex = levelOrder.indexOf(currentLevel);
        
        // Chercher le prochain niveau non complété
        for (let i = currentIndex + 1; i < levelOrder.length; i++) {
            const difficulty = levelOrder[i];
            const allWords = this.game.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.game.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length < allWords.length) {
                console.log(`➡️ Prochain niveau disponible: ${difficulty}`);
                return difficulty;
            }
        }
        
        // Si on est au dernier niveau ou tous complétés, retourner null
        return null;
    }
    
    // Passer automatiquement à un niveau disponible
    switchToAvailableLevel() {
        if (!this.game.userManager.isLoggedIn()) return;
        
        const allWords = this.game.wordManager.getWordsByDifficulty(this.game.currentDifficulty);
        const foundWords = this.game.userManager.getWordsFoundByDifficulty(this.game.currentDifficulty);
        
        console.log(`🔍 Vérification niveau actuel: ${this.game.currentDifficulty} (${foundWords.length}/${allWords.length})`);
        
        // Si le niveau actuel est complété
        if (foundWords.length >= allWords.length) {
            console.log(`✅ Niveau ${this.game.currentDifficulty} déjà complété à la connexion`);
            
            // Chercher le prochain niveau disponible
            const nextLevel = this.getNextAvailableLevel(this.game.currentDifficulty);
            
            if (nextLevel) {
                console.log(`➡️ Passage automatique au niveau ${nextLevel}`);
                this.game.currentDifficulty = nextLevel;
                this.game.ui.updateDifficultyButtons(nextLevel);
                this.game.saveUserPreferences();
                
                // Lancer un mot du nouveau niveau
                this.game.selectRandomWord();
                this.game.ui.createLetterBoxes(this.game.currentWord.length);
                this.game.timer.start();
                this.game.hintManager.resetHelp();
                this.game.inputHandler.reset();
                
                this.game.ui.showFeedback(`⬆️ Passage au niveau ${this.game.ui.DIFFICULTY_NAMES[nextLevel]} ! 💪`, 'info');
            } else {
                console.log(`🏆 Tous les niveaux sont complétés !`);
                this.game.ui.showFeedback(`🏆 FÉLICITATIONS ! Tu as terminé TOUS les niveaux ! 👑`, 'success');
                this.game.ui.createCelebration();
            }
        } else {
            // Le niveau actuel a encore des mots disponibles, lancer un mot
            console.log(`✅ Niveau ${this.game.currentDifficulty} en cours (${foundWords.length}/${allWords.length})`);
            this.game.selectRandomWord();
            this.game.ui.createLetterBoxes(this.game.currentWord.length);
            this.game.timer.start();
            this.game.hintManager.resetHelp();
            this.game.inputHandler.reset();
        }
    }
    
    // Nettoyer les mots trouvés invalides (doublons et mots en excès)
    cleanupFoundWords() {
        const difficulties = ['easy', 'medium', 'hard'];
        
        console.log('🧹 Nettoyage des mots trouvés...');
        
        difficulties.forEach(difficulty => {
            const allWords = this.game.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.game.userManager.getWordsFoundByDifficulty(difficulty);
            
            console.log(`  ${difficulty}: ${foundWords.length} trouvés / ${allWords.length} disponibles`);
            
            // Filtrer pour garder seulement les mots valides
            const validWords = foundWords.filter(word => allWords.includes(word));
            
            if (validWords.length !== foundWords.length) {
                console.log(`  ⚠️ ${foundWords.length - validWords.length} mot(s) invalide(s) supprimé(s)`);
                this.game.userManager.wordsFoundByDifficulty[difficulty] = validWords;
                this.game.userManager.saveUserData();
            }
        });
        
        console.log('✅ Nettoyage terminé');
    }
    
    // Mettre à jour l'état des boutons de difficulté
    updateDifficultyButtonsState() {
        if (!this.game.userManager.isLoggedIn()) return;
        
        const difficulties = ['easy', 'medium', 'hard'];
        
        difficulties.forEach(difficulty => {
            const allWords = this.game.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.game.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length >= allWords.length) {
                // Ce niveau est complété, bloquer le bouton
                this.game.ui.disableDifficultyButton(difficulty);
            } else {
                // Ce niveau n'est pas complété, débloquer le bouton
                this.game.ui.enableDifficultyButton(difficulty);
            }
        });
    }
    
    // Mettre à jour les compteurs de difficulté
    updateDifficultyCounts() {
        const difficulties = ['easy', 'medium', 'hard'];
        const counts = {};
        
        console.log('📊 Mise à jour des compteurs de difficulté');
        
        difficulties.forEach(difficulty => {
            const allWords = this.game.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.game.userManager.isLoggedIn() 
                ? this.game.userManager.getWordsFoundByDifficulty(difficulty) 
                : [];
            
            console.log(`  ${difficulty}: ${foundWords.length}/${allWords.length} mots trouvés`);
            
            counts[difficulty] = {
                found: foundWords.length,
                total: allWords.length
            };
        });
        
        this.game.ui.updateDifficultyCounts(counts, this.game.userManager.isLoggedIn());
    }
    
    // Changer la difficulté
    setDifficulty(difficulty) {
        // Vérifier si le niveau est complété (ne pas permettre de le re-sélectionner)
        if (this.game.userManager.isLoggedIn()) {
            const allWords = this.game.wordManager.getWordsByDifficulty(difficulty);
            const foundWords = this.game.userManager.getWordsFoundByDifficulty(difficulty);
            
            if (foundWords.length >= allWords.length) {
                this.game.ui.showFeedback(`✅ Niveau ${this.game.ui.DIFFICULTY_NAMES[difficulty]} déjà complété !`, 'warning');
                return;
            }
        }
        
        this.game.currentDifficulty = difficulty;
        this.game.ui.updateDifficultyButtons(difficulty);
        this.game.ui.showFeedback(`Niveau changé : ${this.game.ui.DIFFICULTY_NAMES[difficulty]}`, 'info');
        this.game.newGame();
        this.game.saveUserPreferences();
    }
}

