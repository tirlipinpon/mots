# Changelog - Jeu de Devinette de Mots

## Version 1.5.5 (2025-10-03)

### 🐛 Correction : Bug de reset des compteurs à la reconnexion

**Problème** :

- Trouve des mots → Déconnexion → Reconnexion
- Les compteurs se réinitialisaient (catégories montraient tous les mots)
- Bug : `updateCategorySelect()` n'était pas appelé lors du chargement des données

**Solution** :

- ✅ Appel de `updateCategorySelect()` dans `loadUserData()`
- ✅ Les compteurs affichent les mots RESTANTS dès la reconnexion
- ✅ Les catégories complètes restent cachées après reconnexion
- ✅ Déconnexion réinitialise correctement (tous les mots visibles)

**Maintenant** :

- Connexion → Compteurs corrects (mots restants)
- Trouve des mots → Compteurs baissent
- Déconnexion/Reconnexion → Compteurs conservés ✨
- Déconnexion → Compteurs réinitialisés (mode sans compte)

---

## Version 1.5.4 (2025-10-03)

### 🔄 Amélioration : Liste déroulante dynamique

**Mots RESTANTS (pas trouvés) au lieu du total** :

- Avant : `🐶 Animaux (5)` = 5 mots au total
- Maintenant : `🐶 Animaux (5)` → `(4)` → `(3)` → disparaît à 0 ✨

**Catégories complètes retirées automatiquement** :

- Trouve tous les animaux → `🐶 Animaux` disparaît de la liste
- La liste se met à jour en temps réel après chaque mot trouvé
- Si catégorie actuelle complétée → retour automatique à `📦 Toutes`

**Avantages** :

- ✅ Vision claire de ce qui reste à trouver
- ✅ Liste plus courte au fur et à mesure
- ✅ Pas de catégories vides dans la liste
- ✅ Progression visible en direct

---

## Version 1.5.3 (2025-10-03)

### 🐛 Correction : Bug de complétion de catégorie

**Problème** :

- Terminer une catégorie → Le niveau entier était marqué comme complété ❌
- Exemple : Finir "🔢 Nombres (4 mots)" → Niveau Facile (82 mots) bloqué !

**Solution** :

- Distinction claire entre `categoryCompleted` et `allWordsCompleted`
- Vérification sur TOUS les mots du niveau, pas seulement la catégorie
- Message correct : "Catégorie complétée" vs "Niveau complété"
- Retour automatique à "Toutes" après catégorie complétée

**Maintenant** :

- ✅ Terminer une catégorie → Message + retour à "Toutes"
- ✅ Continuer à jouer les autres catégories du même niveau
- ✅ Le niveau se bloque SEULEMENT quand TOUS les mots sont trouvés

---

## Version 1.5.2 (2025-10-03)

### 🔢 Amélioration : Compteur de mots par catégorie

- ✅ Affichage du nombre de mots à côté de chaque catégorie
- Exemple : `🐶 Animaux (5)`, `🍎 Nourriture (29)`, `📦 Toutes (82)`
- Aide à visualiser rapidement la taille de chaque catégorie
- S'adapte automatiquement au niveau sélectionné

---

## Version 1.5.1 (2025-10-03)

### ⚡ Optimisation majeure : Structure des catégories

**AVANT** : Ajout d'un mot = modifier 2 fichiers ❌

```javascript
// data-easy.js
"chat": "🐱 Animal domestique"

// categories.js
animaux: { words: ["chat", "chien"...] }  // ← Oublier = bug !
```

**MAINTENANT** : Un seul endroit ! ✅

```javascript
// data-easy.js SEULEMENT
"chat": { hint: "🐱 Animal domestique", cat: 1 }
//                                       ↑
//                            ID catégorie (voir guide)
```

### 🎯 Avantages

- ✅ **Un seul fichier à modifier** pour ajouter un mot
- ✅ **Moins d'erreurs** : impossible d'oublier de synchroniser
- ✅ **Plus rapide** : `cat: 1` = 7 caractères au lieu de lignes entières
- ✅ **Rétrocompatible** : ancien format `"chat": "indice"` toujours supporté
- ✅ **IDs faciles** : 1=Animaux, 2=Nourriture, 3=Nature, 5=Nombres...

### 📁 Fichiers modifiés

- `categories.js` : Maintenant juste une table de correspondance ID→Nom
- `data-easy.js` : Exemples convertis au nouveau format `{ hint: "...", cat: ID }`
- `CATEGORIES_GUIDE.md` : Documentation complète avec tableau des IDs

### 🔄 Migration

Format ancien toujours supporté ! Migration progressive possible :

```javascript
"chat": "🐱 Animal"  // ← Ancien (marche toujours, cat: 99 auto)
"chien": { hint: "🐕 Ami", cat: 1 }  // ← Nouveau (catégorisé)
```

---

## Version 1.5.0 (2025-10-03)

### 🗂️ Nouvelle fonctionnalité majeure : Catégories de mots

- ✅ Système de filtrage par catégorie (Animaux, Nourriture, Nature, etc.)
- ✅ Liste déroulante à droite des boutons de niveau
- ✅ 11 catégories disponibles : Animaux, Nourriture, Nature, Véhicules, Nombres, Temps, Émotions, Personnages, Corps, Maison, Couleurs, Divers
- ✅ Progression reste par niveau (catégories = simple filtre)
- ✅ Retour automatique à "Toutes" quand une catégorie est complétée
- ✅ Liste centralisée dans `categories.js` pour mise à jour facile

### 📁 Fichier `categories.js`

Liste centralisée de tous les mots par catégorie :

```javascript
CATEGORIES = {
  animaux: { name: "🐶 Animaux", words: ["chat", "chien"...] },
  nourriture: { name: "🍎 Nourriture", words: ["pain", "pizza"...] },
  // ... etc
}
```

### 🎮 Fonctionnement

- Liste déroulante affiche seulement les catégories du niveau actuel
- Sélectionner "🐶 Animaux" → Propose seulement des animaux
- Tous les animaux trouvés → Message + retour auto à "📦 Toutes"
- Changement de niveau → Réinitialise à "Toutes"
- Compatible avec l'ancien format de données (rétrocompatible)

### 🔧 Technique

- `wordManager.js` : Support filtre catégorie + rétrocompatibilité
- `categories.js` : Fonctions utilitaires (`getCategoryForWord`, `getWordsByCategory`, etc.)
- Calcul à la volée (pas de changement de structure de sauvegarde)
- Mise à jour facile : Modifier seulement `categories.js`

---

## Version 1.4.2 (2025-10-03)

### 🔊 Amélioration système de sons

- ✅ Système de fallback automatique : si fichier MP3 absent → beep synthétique
- ✅ Mode hybride : utilise fichiers audio quand disponibles, beeps sinon
- ✅ Plus besoin d'avoir TOUS les fichiers, chaque son a son fallback
- ✅ Messages console clairs si fichier introuvable
- ✅ Expérience utilisateur fluide même sans fichiers audio

### 💡 Exemple

```javascript
// Si letter-correct.mp3 existe → joue le MP3
// Si letter-correct.mp3 n'existe pas → joue le beep 800Hz
// L'utilisateur entend toujours un son !
```

---

## Version 1.4.1 (2025-10-03)

### 📝 Documentation améliorée

- ✅ Commentaires détaillés dans `soundManager.js` pour chaque son
- ✅ Explication des fréquences (Hz), durées (secondes) et formes d'onde
- ✅ Indication précise du moment où chaque son est joué
- ✅ Documentation musicale (notes correspondantes: Do, Mi, Sol, etc.)
- ✅ Émojis visuels pour identifier rapidement chaque son

---

## Version 1.4.0 (2025-10-03)

### 🎵 Nouvelle fonctionnalité majeure : Sons et effets sonores

- ✅ Création de `soundManager.js` - Gestionnaire complet des sons
- ✅ Sons générés avec Web Audio API (beeps synthétiques)
- ✅ Dossier `sounds/` créé pour futurs fichiers audio
- ✅ Bouton mute/unmute avec icône 🔊/🔇

### 🔊 Sons implémentés

- **Lettre correcte** (vert) : Ding aigu 800Hz
- **Lettre mauvaise place** (orange) : Son moyen 400Hz
- **Lettre incorrecte** (rouge) : Buzz grave 200Hz
- **Mot trouvé** : Mélodie montante 3 notes
- **Niveau complété** : Fanfare 4 notes
- **Aide révélée** : Son mystérieux 500Hz
- **Click bouton** : Petit beep 300Hz

### 🎨 Interface

- Bouton rond vert 🔊 (actif) / rouge 🔇 (muet)
- Positionné à côté du bouton d'aide
- Animation rotation au survol
- Sauvegarde préférence dans localStorage

### 🔧 Technique

- Web Audio API pour génération en temps réel
- Pas de latence
- Volume réglable (50% par défaut)
- Préférences persistantes
- Gestion d'erreurs robuste

---

## Version 1.3.0 (2025-10-03)

### 🏗️ Refactorisation majeure de l'architecture

- ✅ Séparation de `game.js` (768 lignes → 400 lignes)
- ✅ Création de `inputHandler.js` - Gestion du clavier et de la saisie
- ✅ Création de `levelProgressionManager.js` - Gestion de la progression des niveaux
- ✅ `game.js` devient un orchestrateur plus léger et maintenable

### 📁 Nouvelle organisation

```
js/
├── inputHandler.js              ← Capture clavier, traitement input
├── levelProgressionManager.js   ← Progression, compteurs, niveaux
└── game.js                      ← Orchestrateur principal (réduit)
```

### 💡 Avantages

- Code plus modulaire et maintenable
- Chaque fichier a une responsabilité claire
- Plus facile à débugger
- Facilite l'ajout de nouvelles fonctionnalités
- Meilleure séparation des préoccupations

### 🔧 Détails techniques

**inputHandler.js** (170 lignes) :

- `handleKeyPress()` - Gestion des touches
- `handleInput()` - Traitement de l'input
- `provideFeedback()` - Messages utilisateur
- Protection des lettres vertes
- Support du trait d'union

**levelProgressionManager.js** (200 lignes) :

- `handleLevelCompleted()` - Complétion niveau
- `checkAllLevelsCompleted()` - Vérification globale
- `getNextAvailableLevel()` - Niveau suivant
- `switchToAvailableLevel()` - Changement auto
- `updateDifficultyCounts()` - Compteurs
- `setDifficulty()` - Changement manuel
- `cleanupFoundWords()` - Nettoyage données
- `updateDifficultyButtonsState()` - État boutons

**game.js** (400 lignes) :

- Orchestration générale
- Gestion du flow du jeu
- Stats et sauvegarde
- Authentification
- Préférences utilisateur

---

## Version 1.2.2 (2025-10-03)

### 📊 Amélioration debug

- ✅ Ajout d'un log stylisé affichant le mot actuel à deviner
- Format : `🎯 MOT ACTUEL: "XXXX"` avec fond jaune et texte orange
- Affiche aussi la longueur et le niveau du mot

### 📝 Documentation

- ✅ Création du fichier `SUGGESTIONS.md` avec toutes les idées d'améliorations futures
- Catégories : Visuels, Gamification, Thèmes, Modes de jeu, Social, Éducatif, Personnalisation
- Roadmap suggérée sur 3 mois
- Top 5 priorités identifiées

---

## Version 1.2.1 (2025-10-03)

### 🐛 Corrections de bugs

- ✅ Support du trait d'union (-) pour les mots composés comme "dix-sept"
- ✅ Modification du regex de capture clavier de `/[a-zA-Z]/` vers `/[a-zA-Z-]/`

---

## Version 1.2.0 (2025-10-03)

### 🏗️ Restructuration de l'architecture

- ✅ Séparation des données en 3 fichiers distincts pour une meilleure maintenabilité
  - `data-easy.js` : ~60 mots faciles (3-4 lettres)
  - `data-medium.js` : ~100 mots moyens (5-6 lettres)
  - `data-hard.js` : ~52 mots difficiles (7+ lettres)
  - `data.js` : Fichier principal qui combine les 3 niveaux

### 📁 Organisation des fichiers

```
js/
├── data-easy.js     ← Mots niveau facile
├── data-medium.js   ← Mots niveau moyen
├── data-hard.js     ← Mots niveau difficile
└── data.js          ← Combine tous les niveaux
```

### 💡 Avantages

- Chaque niveau peut maintenant être édité indépendamment
- Plus facile d'ajouter des mots à un niveau spécifique
- Meilleure organisation du code
- Fichiers plus petits et plus lisibles

---

## Version 1.1.1 (2025-10-03)

### 🎯 Ajout de contenu

- ✅ Ajout de +60 mots dans le niveau Moyen (maintenant ~100 mots de 5-6 lettres)
- Thèmes ajoutés : nature, météo, sports, corps humain, meubles, médias, couleurs, aliments, adjectifs

---

## Version 1.1.0 (2025-10-03)

### 🎯 Nouvelles fonctionnalités

- ✅ Ajout de +50 mots dans le niveau Facile (maintenant ~60 mots de 3-4 lettres)
- ✅ Lancement automatique d'un mot à la connexion
- ✅ Passage fluide au niveau suivant si le niveau actuel est complété

### 🐛 Corrections de bugs

- ✅ Correction du démarrage du jeu à la connexion avec niveau complété
- ✅ Le mot s'affiche correctement après la connexion

### 📊 Logs améliorés

- `✅ Niveau X en cours (Y/Z)` si des mots restent disponibles
- `✅ Niveau X déjà complété à la connexion` si niveau terminé

---

## Version 1.0.3 (2025-10-03)

### 🐛 Corrections de bugs

- ✅ Passage automatique au niveau suivant à la connexion si le niveau actuel est complété
- ✅ Détection automatique des niveaux complétés à la connexion
- ✅ Message de félicitations si tous les niveaux sont terminés

### 📊 Logs améliorés

- `🔍 Vérification niveau actuel: X (Y/Z)` à la connexion
- `✅ Niveau X déjà complété` si détecté
- `➡️ Passage automatique au niveau X` lors du changement
- `🏆 Tous les niveaux sont complétés !` si fin du jeu

### ⚙️ Fonctionnalité ajoutée

- Fonction console `resetUserData()` pour réinitialiser toutes les données utilisateur

---

## Version 1.0.2 (2025-10-03)

### 🐛 Corrections de bugs critiques

- ✅ Nettoyage automatique des doublons au chargement des données
- ✅ Validation des mots trouvés (suppression des mots invalides)
- ✅ Protection contre les mots en excès (ne peut plus dépasser le total)
- ✅ Amélioration de la logique de sauvegarde pour éviter les doublons

### 📊 Logs améliorés

- `🧹 Nettoyage des mots trouvés...` au chargement
- `⚠️ X mot(s) invalide(s) supprimé(s)` si des doublons détectés

---

## Version 1.0.1 (2025-10-03)

### 🐛 Corrections de bugs

- ✅ Correction du bug permettant d'avoir plus de mots trouvés que de mots disponibles
- ✅ Ajout de vérifications strictes pour éviter les doublons dans la sauvegarde
- ✅ Amélioration de la logique de complétion des niveaux
- ✅ Ne plus réinitialiser automatiquement les mots trouvés

### 📊 Logs améliorés

- `🔍 Sélection mot: X/Y disponibles` pour chaque niveau
- `⚠️ Mot déjà trouvé, pas d'ajout` pour éviter les doublons
- `🏆 Tous les mots trouvés !` quand un niveau est complété

---

## Version 1.0.0 (2025-10-03)

### 🎯 Fonctionnalités principales

- ✅ Système de jeu sans input visible (saisie directe au clavier)
- ✅ Curseur visuel clignotant pour indiquer la position
- ✅ Remplacement automatique des lettres incorrectes
- ✅ Protection des lettres vertes (correctes)
- ✅ Système d'indices alternatifs (calculs mathématiques ou lettres voisines)
- ✅ Passage automatique au mot suivant après 2.5 secondes
- ✅ Système de progression des niveaux (Facile → Moyen → Difficile)
- ✅ Blocage automatique des niveaux complétés
- ✅ Félicitations et passage automatique au niveau suivant
- ✅ Message final quand tous les niveaux sont terminés

### 🔧 Architecture

- `game.js` - Orchestrateur principal du jeu
- `uiManager.js` - Gestion de l'interface utilisateur
- `hintManager.js` - Gestion des indices et aides
- `wordManager.js` - Gestion des mots et logique du jeu
- `userManager.js` - Gestion des utilisateurs et sauvegarde (cookies)
- `statsManager.js` - Gestion des statistiques
- `timerManager.js` - Gestion du chronomètre
- `data.js` - Base de données des mots

### 📊 Système de sauvegarde

- Sauvegarde automatique dans les cookies
- Persistance des mots trouvés par difficulté
- Statistiques détaillées par utilisateur

---

## Comment incrémenter la version

### Format: MAJOR.MINOR.PATCH

- **MAJOR** (X.0.0) : Changements majeurs, refonte complète
- **MINOR** (0.X.0) : Nouvelles fonctionnalités
- **PATCH** (0.0.X) : Corrections de bugs, petites améliorations

### Exemple:

```javascript
// Dans js/game.js, ligne 3
const GAME_VERSION = "1.1.0"; // Incrémenter ici
```

### Puis mettre à jour ce fichier avec les changements !
