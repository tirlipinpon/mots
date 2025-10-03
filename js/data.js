// Fichier principal des données - Combine tous les niveaux
// Les données sont maintenant organisées dans des fichiers séparés :
// - data-easy.js : Niveau facile (3-4 lettres)
// - data-medium.js : Niveau moyen (5-6 lettres)
// - data-hard.js : Niveau difficile (7+ lettres)

const GAME_DATA = {
    easy: DATA_EASY,
    medium: DATA_MEDIUM,
    hard: DATA_HARD
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
}
