// Définition centralisée des catégories
// Format: ID numérique pour chaque catégorie (utilisé dans les fichiers data-*.js)
// Les mots ont un attribut "cat" qui référence l'ID de la catégorie

const CATEGORIES = [
    { id: 0, key: "toutes", name: "📦 Toutes", icon: "📦" },
    { id: 1, key: "animaux", name: "🐶 Animaux", icon: "🐶" },
    { id: 2, key: "nourriture", name: "🍎 Nourriture", icon: "🍎" },
    { id: 3, key: "nature", name: "🌍 Nature", icon: "🌍" },
    { id: 4, key: "vehicules", name: "🚗 Véhicules", icon: "🚗" },
    { id: 5, key: "nombres", name: "🔢 Nombres", icon: "🔢" },
    { id: 6, key: "temps", name: "📅 Temps", icon: "📅" },
    { id: 7, key: "emotions", name: "😊 Émotions", icon: "😊" },
    { id: 8, key: "personnages", name: "🦸 Personnages", icon: "🦸" },
    { id: 9, key: "corps", name: "🧍 Corps", icon: "🧍" },
    { id: 10, key: "maison", name: "🏠 Maison", icon: "🏠" },
    { id: 11, key: "couleurs", name: "🎨 Couleurs", icon: "🎨" },
    { id: 12, key: "objets", name: "⚔️ Objets", icon: "⚔️" },
    { id: 13, key: "sports", name: "⚽ Sports", icon: "⚽" },
    { id: 99, key: "autres", name: "🎲 Divers", icon: "🎲" }
];

// Correspondance ID → Catégorie
const CATEGORIES_BY_ID = {};
const CATEGORIES_BY_KEY = {};

CATEGORIES.forEach(cat => {
    CATEGORIES_BY_ID[cat.id] = cat;
    CATEGORIES_BY_KEY[cat.key] = cat;
});

// Obtenir une catégorie par ID
function getCategoryById(id) {
    return CATEGORIES_BY_ID[id] || CATEGORIES_BY_ID[99]; // 99 = Autres par défaut
}

// Obtenir une catégorie par clé
function getCategoryByKey(key) {
    return CATEGORIES_BY_KEY[key] || CATEGORIES_BY_KEY['autres'];
}

// Fonction pour obtenir les mots d'une catégorie dans un niveau
function getWordsByCategory(categoryKey, difficulty, gameData) {
    const allWordsInLevel = Object.keys(gameData[difficulty]);
    
    if (categoryKey === 'toutes' || categoryKey === 0) {
        return allWordsInLevel; // Tous les mots du niveau
    }
    
    // Trouver l'ID de la catégorie
    const category = getCategoryByKey(categoryKey);
    if (!category) return allWordsInLevel;
    
    const categoryId = category.id;
    
    // Filtrer les mots par ID de catégorie
    return allWordsInLevel.filter(word => {
        const wordData = gameData[difficulty][word];
        
        // Nouveau format: { hint: "...", cat: 1 }
        if (typeof wordData === 'object' && wordData.cat !== undefined) {
            return wordData.cat === categoryId;
        }
        
        // Ancien format: "indice" (pas de catégorie) → Divers
        return categoryId === 99;
    });
}

// Fonction pour obtenir les catégories disponibles dans un niveau
function getAvailableCategoriesForLevel(difficulty, gameData) {
    const allWordsInLevel = Object.keys(gameData[difficulty]);
    const availableCategories = ['toutes']; // Toujours disponible
    
    // Compter combien de mots dans chaque catégorie
    const categoryCounts = {};
    
    allWordsInLevel.forEach(word => {
        const wordData = gameData[difficulty][word];
        let categoryId = 99; // Autres par défaut
        
        // Nouveau format: { hint: "...", cat: 1 }
        if (typeof wordData === 'object' && wordData.cat !== undefined) {
            categoryId = wordData.cat;
        }
        
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    });
    
    // Ajouter les catégories qui ont au moins 1 mot
    CATEGORIES.forEach(cat => {
        if (cat.id !== 0 && categoryCounts[cat.id] > 0) {
            availableCategories.push(cat.key);
        }
    });
    
    return availableCategories;
}

// Obtenir le nom d'une catégorie
function getCategoryName(categoryKey) {
    const cat = getCategoryByKey(categoryKey);
    return cat ? cat.name : "🎲 Divers";
}
