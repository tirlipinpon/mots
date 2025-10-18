# Changelog - Jeu de Devinette de Mots

## Version 2.0.0 (2025-10-18) 🎉

### 🚀 NOUVELLE FONCTIONNALITÉ MAJEURE : SessionManager

**Gestion intelligente des sessions utilisateur** :

- ✅ **Session persistante au refresh (F5)** : Plus besoin de se reconnecter après un rafraîchissement !
- ✅ **Déconnexion automatique à la fermeture d'onglet** : Sécurité améliorée
- ✅ **Auto-restauration de session** : Reconnexion automatique au chargement si session active
- ✅ **Partage entre applications** : Le nom d'utilisateur peut être partagé entre plusieurs apps
- ✅ **Fichier réutilisable** : `sessionManager.js` peut être copié dans d'autres projets

**Architecture technique** :

- 📦 Nouveau fichier : `js/sessionManager.js` (autonome et réutilisable)
- 🔧 Intégration dans `userManager.js` pour la gestion de connexion/déconnexion
- 💾 Utilise `sessionStorage` + `localStorage` pour une gestion optimale
- 🎮 Mise à jour de `game.js` pour gérer l'état initial de session

**Comportements** :

| Action                  | Session             | Données         |
| ----------------------- | ------------------- | --------------- |
| 🔄 Refresh (F5)         | ✅ Reste connecté   | ✅ Préservées   |
| ❌ Fermer onglet        | ❌ Déconnexion auto | ✅ Sauvegardées |
| 🚪 Déconnexion manuelle | ❌ Session fermée   | ✅ Sauvegardées |

**Avantages** :

- 🎯 Meilleure expérience utilisateur : plus besoin de se reconnecter constamment
- 🔒 Sécurité : déconnexion automatique à la fermeture
- 🔄 Fiabilité : gestion robuste des sessions avec fallback
- 📚 Documentation : Guide de test complet inclus (`SESSION_TEST_GUIDE.md`)

### 🔧 AMÉLIORATION : Cache Busting

**Gestion automatique du cache navigateur** :

- ✅ **Paramètres de version sur tous les fichiers** : `?v=2.0.0`
- ✅ **Forcer le rechargement des nouveaux fichiers** : Plus besoin de vider le cache manuellement !
- ✅ **Applicable au CSS et à tous les JS** : Couverture complète
- ✅ **Simple à mettre à jour** : Changer seulement le numéro de version

**Fichiers concernés** :

- 🎨 `css/style.css?v=2.0.0`
- 📦 Tous les fichiers JS avec paramètre de version
- 🔄 Automatiquement mis à jour à chaque nouvelle version

**Avantages** :

- 🚀 Déploiement simplifié : les utilisateurs voient les mises à jour immédiatement
- 📱 Fonctionne sur PC et mobile
- 💾 Pas besoin de vider le cache manuellement
- ✨ Expérience utilisateur améliorée

**Comment ça marche** :

À chaque mise à jour, changez simplement le numéro de version dans `game.js`, et tous les fichiers seront rechargés automatiquement par le navigateur !

---

## Version 1.8.2 (2025-10-04)

### 🎨 Amélioration : Design compact avec petits boutons

**Modifications du design** :

- ✅ Suppression des grosses entêtes vertes pour les sections Connexion et Difficulté
- ✅ Petits boutons **−/+** discrets dans le coin supérieur droit
- ✅ Gain de place important sur l'interface
- ✅ Design minimaliste et élégant
- ✅ Sections plus compactes et aérées

**Avantages** :

- 📏 Interface beaucoup plus compacte
- 🎯 Focus sur le contenu essentiel
- 📱 Meilleure utilisation de l'espace
- ✨ Design moderne et épuré

---

## Version 1.8.1 (2025-10-04)

### 🎨 Amélioration : Sections pliables avec boutons toggle

**Améliorations de l'interface** :

- ✅ Sections **Connexion** et **Difficulté** maintenant pliables comme la section Score
- ✅ Ajout de boutons **−/+** dans le coin de chaque section pour les replier/déplier
- ✅ **Sélecteur de catégories** sorti de la section difficulté pour être toujours visible
- ✅ Design cohérent avec des boutons ronds et élégants
- ✅ État des sections sauvegardé dans les préférences utilisateur

**Sections concernées** :

- 👤 Connexion - Section pliable
- 🎯 Difficulté - Section pliable
- 📊 Score et Statistiques - Section pliable (existant)

**Avantages** :

- 🎯 Interface plus propre et organisée
- 📱 Gain de place sur petit écran
- 💾 Préférences d'affichage mémorisées
- 🗂️ Catégories toujours accessibles

---

## Version 1.8.0 (2025-10-04)

### 🎯 Fonctionnalité : Système de révision automatique

**Nouveau système de mémorisation des mots** :

- ✅ Les mots trouvés **sans aucune erreur** (toutes vertes) sont enregistrés dans le cookie
- ✅ Les mots trouvés **avec des erreurs** (au moins 1 lettre rouge ou jaune) ne sont PAS enregistrés
- ✅ Les mots avec erreurs peuvent **revenir plus tard** pour être réessayés
- ✅ Système de révision automatique pour améliorer l'apprentissage

**Critère "sans erreur"** :

- Un mot est considéré **sans erreur** si aucune lettre rouge ou jaune n'a jamais été tapée
- Exemple : `C → vert, H → vert, A → vert, T → vert` ✅ Enregistré
- Exemple : `C → vert, H → vert, U → rouge, [efface], A → vert, T → vert` ❌ PAS enregistré

**Avantages** :

- 🔄 Révision naturelle des mots difficiles
- 🎓 Apprentissage renforcé par la répétition
- 🎯 Motivation pour trouver du premier coup
- 📊 Les mots ne sont définitivement "complétés" que s'ils sont trouvés parfaitement

---

## Version 1.7.5 (2025-10-03)

### 🧮 Amélioration : Indices avec calculs sur lettres voisines

**Nouveaux types d'indices ajoutés** :

1. **Lettre + calcul** : `Lettre après B+2` (pour D)
2. **Lettre - calcul** : `Lettre avant F-2` (pour D)
3. **Indices simples** : `La lettre après C` (pour D)
4. **Calculs position** : `Position = 3+1` (pour D)

**Exemples pour la lettre "D" (position 4)** :

- `💡 Position dans l'alphabet = 3 + 1`
- `💡 La lettre juste après C`
- `💡 La lettre juste avant E`
- `💡 Lettre après B+2` ← **NOUVEAU !**
- `💡 Lettre avant G-3` ← **NOUVEAU !**

**Avantages** :

- ✅ Plus de variété dans les indices
- ✅ Apprentissage des opérations (addition/soustraction)
- ✅ Combine lettres ET mathématiques
- ✅ Plus ludique et éducatif

**Probabilités** :

- 33% calcul de position pure
- 67% calcul sur lettres (simple ou avec opérations)

---

## Version 1.7.4 (2025-10-03)

### 🐛 Correction : Debug du compteur d'aide

- ✅ Ajout de logs pour déboguer l'affichage du compteur
- ✅ Vérification que le bouton existe avant mise à jour

---

## Version 1.7.3 (2025-10-03)

### 🔧 Correction : Une seule aide par position de curseur

**Problème v1.7.2** :

- On pouvait cliquer plusieurs fois sur l'aide sans taper de lettre
- Le curseur ne bougeait pas → Plusieurs indices pour la même position
- Confusion : 2 indices différents pour la même lettre

**Solution v1.7.3** :

- ✅ Tracking de la position du curseur lors de l'aide : `lastHelpedCursorPosition`
- ✅ Blocage si le curseur n'a pas bougé depuis la dernière aide
- ✅ Reset du tracking quand l'utilisateur tape une lettre (ou backspace)
- ✅ Message clair : "Tape d'abord une lettre avant de redemander l'aide !"

**Règle stricte** : **1 aide par position de curseur**

**Exemple** :

```
Curseur position 0 → [💡] Clic → Indice donné ✅
Curseur position 0 → [💡] Clic → BLOQUÉ ❌ "Tape une lettre d'abord !"
Tape "C" → Curseur position 1
Curseur position 1 → [💡] Clic → Indice donné ✅
```

**Garantie** : Pas de double indice sur la même position du curseur !

---

## Version 1.7.2 (2025-10-03)

### 🔧 Correction : Éviter de révéler 2 fois la même lettre

**Problème** :

- En mode difficile avec 2 aides, on pouvait cliquer 2 fois et avoir l'indice pour la même lettre
- Pas optimal : `💡 Position = 3` puis `💡 Position = 3` encore

**Solution** :

- ✅ Tracking des positions déjà révélées : `revealedPositions = []`
- ✅ La 2ème aide révèle une AUTRE lettre
- ✅ Exemple : Position 1 puis Position 2 (jamais 2 fois la position 1)
- ✅ Reset automatique à chaque nouveau mot

**Exemple mode DIFFICILE** :

- Mot : "chocolat" (8 lettres)
- 1ère aide → Indice pour lettre n°1 (C)
- 2ème aide → Indice pour lettre n°2 (H) ← DIFFÉRENT !

---

## Version 1.7.1 (2025-10-03)

### 💡 Nouvelle fonctionnalité : 2 aides en mode DIFFICILE

**Système d'aide adaptatif** :

- 🟢 **Facile** : 1 aide par mot
- 🟠 **Moyen** : 1 aide par mot
- 🔴 **Difficile** : **2 aides par mot** ! 🎉

**Fonctionnement** :

- Bouton affiche `💡 0/2` au début (en difficile)
- Première aide → `💡 1/2` + Message "1 aide restante"
- Deuxième aide → `💡 2/2` + Bouton grisé
- Changement de niveau → Compteur adapté automatiquement

**Avantages** :

- ✅ Mode difficile moins frustrant pour les enfants
- ✅ Progression visible : 0/2 → 1/2 → 2/2
- ✅ Feedback clair du nombre d'aides restantes
- ✅ Logique adaptée au niveau de difficulté

---

## Version 1.7.0 (2025-10-03)

### 📊 Amélioration : Logs de statistiques au démarrage

- ✅ Affichage automatique du nombre de mots par niveau dans la console
- ✅ Total général calculé et affiché
- ✅ Logs colorés et formatés

**Exemple de log** :

```
🎮 Jeu de Devinette de Mots - Version 1.7.0
📅 03/10/2025 14:30:00

📊 Statistiques des mots :
   🟢 Facile : 82 mots
   🟠 Moyen : 145 mots
   🔴 Difficile : 91 mots
   ─────────────────────
   📈 TOTAL : 318 mots disponibles
```

**Utile pour** :

- Vérifier rapidement le contenu du jeu
- Déboguer les ajouts de mots
- Suivre la croissance du vocabulaire

---

## Version 1.6.9 (2025-10-03)

### 🔧 Correction : Validation 7+ lettres pour niveau DIFFICILE

**Regex utilisée** : `/^[a-zàâäéèêëïîôùûüÿœæç-]{7,}$/i`

**Mots corrigés** (< 7 lettres → 7+ lettres) :

- ❌ `crêpes` (6) → ✅ `crêperie` (8)
- ❌ `gateau` (6) → ✅ `gâteaux` (7)
- ❌ `camion` (6) → ✅ `camion-poubelle` (15)
- ❌ `amitié` (6) → ✅ `tendresse` (9)
- ❌ `elsa` (4) → ✅ `la-reine-des-neiges` (19)
- ❌ `rigolo` (6) → ✅ `rigolote` (8)
- ❌ `bisou` (5) → ✅ `affection` (9)
- ❌ `câlin` (5) → ✅ `gentillesse` (11)

**✅ Tous les mots ont maintenant 7+ lettres !**

---

## Version 1.6.8 (2025-10-03)

### 🎉 Ajout de mots rigolos au niveau DIFFICILE

**+47 nouveaux mots de 7+ lettres** (47 → 94 mots au total !)

**🐶 Animaux (+8)** :

- dinosaure, kangourou, crocodile, hippopotame
- perroquet, coccinelle, panthère, pieuvre

**🍎 Nourriture (+7)** :

- spaghetti, sandwich, biscuit, popcorn
- crêpes, gateau, confiture

**🌍 Nature (+5)** :

- palmier, coquillage, cascade, étoiles, planète

**🚗 Véhicules (+3)** :

- hélicoptère, tracteur, camion

**🦸 Personnages (+7)** :

- pinocchio, cendrillon, raiponce, pocahontas
- ironman, captain, elsa

**🧍 Corps (+4)** :

- cheveux, cerveau, squelette, estomac

**🏠 Maison (+4)** :

- cuisine, chambre, fenêtre, escalier

**⚔️ Objets (+6)** :

- parapluie, balançoire, toboggan, trampoline
- télévision, dinosaure (jouet)

**⚽ Sports (+4)** :

- football, basketball, natation, gymnastique

**🎲 Divers (+9)** :

- fantôme, licorne, rigolo, surprise, vacances
- histoire, bisou, câlin, champion

**Total niveau DIFFICILE : 94 mots !** 🎊

---

## Version 1.6.7 (2025-10-03)

### 🎨 Simplification des compteurs

**Compteurs de niveaux** :

- Avant : `🟢 Facile (4/82)`
- Maintenant : `🟢 Facile (4)` ← Juste les mots trouvés

**Liste des catégories** :

- Avant : `📦 Toutes (82)`, `🐶 Animaux (5)`
- Maintenant : `📦 Toutes`, `🐶 Animaux (5)` ← Pas de total pour "Toutes"

**Avantages** :

- ✅ Plus simple et clair
- ✅ Focus sur le nombre de mots trouvés
- ✅ "Toutes" reste neutre (pas de chiffre intimidant)
- ✅ Interface moins chargée

---

## Version 1.6.6 (2025-10-03)

### 🎯 Version stable - Système de catégories complet

**Compilation de toutes les améliorations v1.5.x → v1.6.x** :

✅ **Système de catégories** (v1.5.0-1.5.5)

- 14 catégories avec 274 mots catégorisés
- Liste déroulante dynamique avec compteurs de mots restants
- Structure optimisée avec IDs numériques

✅ **Support mobile optimal** (v1.5.6-1.6.5)

- Input invisible pour clavier virtuel
- Détection intelligente des conflits de focus
- Menu déroulant et connexion fonctionnels

✅ **Interface modernisée** (v1.5.8-1.6.4)

- Badge de version visible
- Boutons repositionnés logiquement
- Messages d'aide simplifiés

**Cette version est stable et prête pour utilisation !** 🚀

---

## Version 1.6.5 (2025-10-03)

### 🐛 Correction : Menu déroulant des catégories sur mobile

**Problème** :

- Sur mobile, clic sur le menu déroulant → S'ouvre puis se ferme immédiatement
- L'input mobile reprenait le focus automatiquement
- Impossible de sélectionner une catégorie

**Solution** :

- ✅ Détection du focus sur `<select>` et `categorySelect`
- ✅ L'input mobile ne reprend PAS le focus si un menu est ouvert
- ✅ Le menu déroulant reste ouvert jusqu'à sélection
- ✅ Fonctionne maintenant correctement sur iOS et Android

**Éléments exclus du re-focus automatique** :

- `usernameInput` (connexion)
- `categorySelect` (menu des catégories)
- Tous les éléments `<select>`

---

## Version 1.6.4 (2025-10-03)

### 🎨 Amélioration : Message d'aide simplifié

- ✅ Retrait du texte redondant "lettre n°X : "
- Messages plus courts et clairs

**Avant** :

- `💡lettre n°3 : Position dans l'alphabet = 5 + 2`
- `💡lettre n°1 : La lettre juste avant D`

**Maintenant** :

- `💡 Position dans l'alphabet = 5 + 2`
- `💡 La lettre juste avant D`

---

## Version 1.6.3 (2025-10-03)

### 🎨 Correction : Layout boutons simplifié

- ✅ Bouton 🔊 : À côté du bouton "Se connecter" (dans login-section)
- ✅ Bouton 💡 : À droite de l'indice (dans hint-section)
- ✅ Chaque bouton reste dans sa section logique
- ✅ Design rond pour les deux boutons (cohérence)
- ✅ Pas de section .control-buttons inutile

**Layout final** :

```
┌─────────────────────────┐
│ [Nom] [Se connecter] [🔊] │  ← Son avec login
└─────────────────────────┘
┌─────────────────────────┐
│  Indice du mot...  [💡] │  ← Aide avec indice
└─────────────────────────┘
```

---

## Version 1.6.2 (2025-10-03)

### 🎨 Amélioration : Boutons de contrôle alignés

- ✅ Boutons Aide (💡) et Son (🔊) alignés sur une même ligne
- ✅ Design uniforme : Même taille, même style rectangulaire arrondi
- ✅ Texte ajouté : "💡 Aide" et "🔊 Son" pour plus de clarté
- ✅ Position centrale sous l'indice
- ✅ Sections login et hint restent séparées (rollback v1.6.1)

**Layout final** :

```
┌────────────────────┐
│ [Nom] [Connecter]  │  Login
└────────────────────┘
┌────────────────────┐
│  Indice du mot...  │  Hint
└────────────────────┘
   [💡 Aide] [🔊 Son]   ← Boutons alignés
```

---

## Version 1.6.1 (2025-10-03)

### 🎨 Amélioration : Layout optimisé en ligne

- ✅ Section login et section indice alignées sur la même ligne horizontale
- ✅ Gain d'espace vertical significatif
- ✅ Interface plus compacte et moderne
- ✅ Responsive : Empile verticalement sur mobile (< 768px)
- ✅ Les deux sections ont la même hauteur (flex: 1)

**Layout Desktop** :

```
┌─────────────────┬──────────────────────┐
│ [🔊] [Nom] [Se] │ Indice...       [💡] │
└─────────────────┴──────────────────────┘
```

**Layout Mobile** :

```
┌────────────────────┐
│ [🔊] [Nom] [Se]    │
├────────────────────┤
│ Indice...     [💡] │
└────────────────────┘
```

---

## Version 1.6.0 (2025-10-03)

### 🎨 Amélioration : Repositionnement du bouton son

- ✅ Bouton son (🔊) déplacé à gauche de l'input de connexion
- ✅ Toujours accessible, que tu sois connecté ou non
- ✅ Plus logique : Contrôle global en haut, pas dans la zone de jeu
- ✅ Interface plus épurée et organisée

**Layout final** :

```
[🔊]  [Ton nom...]  [Se connecter]
         ↑
    Bouton son à gauche
```

---

## Version 1.5.9 (2025-10-03)

### 🎨 Amélioration : Repositionnement du bouton d'aide

- ✅ Bouton d'aide (💡) déplacé à droite du texte d'indice
- ✅ Intégré dans la `hint-section` avec l'indice
- ✅ Nouveau design : Bouton arrondi au lieu de rond
- ✅ Icône changée : ? → 💡 (plus intuitif)
- ✅ Meilleure visibilité et accessibilité
- ✅ Layout flexbox pour alignement parfait

**Avant** : Bouton ? à côté des letter boxes  
**Maintenant** : Bouton 💡 à droite de l'indice dans le cadre

---

## Version 1.5.8 (2025-10-03)

### 🏷️ Amélioration : Badge de version visible

- ✅ Badge de version affiché en haut à droite de l'écran
- Style semi-transparent avec effet de verre (glassmorphism)
- Tooltip au survol : "Version du jeu : 1.5.8"
- Position fixe, ne gêne pas le gameplay
- Design moderne et discret

**Affichage** : `v1.5.8` dans un badge élégant en haut à droite 🏷️

---

## Version 1.5.7 (2025-10-03)

### 🔧 Correction : Input mobile ne bloque plus les boutons

**Problème de la v1.5.6** :

- Input mobile couvrait tout le container
- Bloquait les clics sur les boutons (?, 🔊)
- Empêchait l'accès à l'input de connexion
- Auto-focus gênant au démarrage

**Solution v1.5.7** :

- ✅ Input mobile positionné hors écran (1px × 1px)
- ✅ Ne bloque AUCUN élément cliquable
- ✅ Focus uniquement au **clic sur letter boxes, indice, ou feedback**
- ✅ Pas d'auto-focus au démarrage (n'empêche plus la connexion)
- ✅ Détecte l'input de connexion et n'interfère pas
- ✅ Garde le focus pendant le jeu mais pas pendant la connexion

**Fonctionnement amélioré** :

1. **Connexion** : Clique sur input, tape ton nom → Pas d'interférence ✅
2. **Boutons** : Clique sur ?, 🔊 → Fonctionnent normalement ✅
3. **Jouer** : Clique sur les letter boxes → Clavier s'affiche ✅
4. **Continuer** : Le focus reste automatiquement pendant le jeu ✅

---

## Version 1.5.6 (2025-10-03)

### 📱 Correction : Support mobile amélioré

**Problème** :

- Sur mobile/tablette, impossible de faire focus après connexion
- Le clavier virtuel ne s'affichait pas
- Pas d'input HTML pour déclencher le clavier natif

**Solution** :

- ✅ Ajout d'un input invisible mais fonctionnel (`mobileInput`)
- ✅ Détection automatique des appareils mobiles
- ✅ Auto-focus au clic sur les letter boxes (mobile uniquement)
- ✅ Clavier virtuel s'affiche automatiquement
- ✅ Compatible iOS et Android
- ✅ Garde le focus automatiquement pendant le jeu
- ✅ Font-size 16px pour éviter le zoom sur iOS

**Fonctionnement** :

- Desktop : Clavier physique (inchangé)
- Mobile : Input caché capture la saisie → simule les événements clavier
- Transparent et non-intrusif pour l'utilisateur

---

## Version 1.5.5 (2025-10-03) - Mise à jour finale

### 📝 Documentation : SUGGESTIONS.md mis à jour

- ✅ Ajout section "Fonctionnalités Récemment Implémentées"
- ✅ Marquage des catégories comme complétées (v1.5.0-1.5.5)
- ✅ Marquage des sons comme complétés (v1.4.0-1.4.2)
- ✅ Mise à jour de la roadmap avec statuts
- ✅ 274 mots catégorisés documentés

---

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
