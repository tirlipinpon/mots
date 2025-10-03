# Changelog - Jeu de Devinette de Mots

## Version 1.2.2 (2025-10-03)

### 📊 Amélioration debug

- ✅ Ajout d'un log stylisé affichant le mot actuel à deviner
- Format : `🎯 MOT ACTUEL: "XXXX"` avec fond jaune et texte orange
- Affiche aussi la longueur et le niveau du mot

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
