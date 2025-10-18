# 📝 Guide de mise à jour de version

## 🎯 Pourquoi le cache busting ?

Sans cache busting, les navigateurs (PC et mobile) gardent les anciennes versions de vos fichiers en cache. Les utilisateurs doivent vider leur cache manuellement pour voir les mises à jour.

Avec le cache busting (`?v=2.0.0`), chaque nouvelle version force le navigateur à télécharger les nouveaux fichiers automatiquement ! 🚀

---

## 📋 Comment mettre à jour la version

### Étape 1 : Choisir le nouveau numéro de version

Suivez le **versioning sémantique** :

- **X.0.0** (majeure) : Changements importants, nouvelles fonctionnalités majeures
- **X.Y.0** (mineure) : Nouvelles fonctionnalités, améliorations
- **X.Y.Z** (patch) : Corrections de bugs, petits ajustements

**Exemples** :

- `2.0.0` → `2.1.0` : Ajout d'une nouvelle fonctionnalité
- `2.1.0` → `2.1.1` : Correction d'un bug
- `2.1.1` → `3.0.0` : Refonte majeure

---

### Étape 2 : Mettre à jour `js/game.js`

```javascript
// Jeu principal - Orchestrateur
// Version: 2.1.0  ← CHANGER ICI
const GAME_VERSION = '2.1.0';  ← ET ICI
```

---

### Étape 3 : Mettre à jour `index.html`

Remplacez **TOUS** les `?v=2.0.0` par le nouveau numéro :

```html
<!-- CSS -->
<link rel="stylesheet" href="css/style.css?v=2.1.0" />

<!-- Tous les scripts -->
<script src="js/data-easy.js?v=2.1.0"></script>
<script src="js/data-medium.js?v=2.1.0"></script>
<!-- ... etc pour TOUS les fichiers JS ... -->
```

**Astuce** : Utilisez la fonction "Rechercher/Remplacer" de votre éditeur :

- Rechercher : `?v=2.0.0`
- Remplacer par : `?v=2.1.0`

---

### Étape 4 : Mettre à jour `CHANGELOG.md`

Ajoutez une nouvelle section en haut du fichier :

```markdown
## Version 2.1.0 (2025-10-XX)

### 🚀 Nouvelles fonctionnalités

- ✅ Description de la fonctionnalité 1
- ✅ Description de la fonctionnalité 2

### 🐛 Corrections

- ✅ Correction du bug X
- ✅ Correction du bug Y

### 🎨 Améliorations

- ✅ Amélioration de l'UI
- ✅ Optimisation des performances

---

## Version 2.0.0 (2025-10-18) 🎉

...
```

---

## 🚀 Déploiement

### 1. Tester localement

- Ouvrir l'application dans le navigateur
- Vérifier que la version s'affiche correctement (coin supérieur droit)
- Tester les nouvelles fonctionnalités

### 2. Upload sur le serveur

- Uploader **TOUS** les fichiers modifiés
- Vérifier que `index.html`, `js/game.js` et `CHANGELOG.md` sont bien uploadés

### 3. Vérifier le déploiement

- Ouvrir l'application sur le serveur
- **Faire F5** (les utilisateurs verront automatiquement la nouvelle version !)
- Vérifier le numéro de version dans le coin supérieur droit
- Ouvrir la console (F12) et vérifier qu'il n'y a pas d'erreurs

---

## ✅ Checklist de mise à jour

Avant de déployer, vérifiez :

- [ ] Nouveau numéro de version choisi
- [ ] `js/game.js` mis à jour (2 endroits)
- [ ] `index.html` mis à jour (tous les `?v=X.X.X`)
- [ ] `CHANGELOG.md` mis à jour avec les nouveautés
- [ ] Tests en local effectués
- [ ] Tous les fichiers uploadés sur le serveur
- [ ] Vérification post-déploiement effectuée

---

## 🎯 Exemple complet de mise à jour

### Scénario : Ajout d'une nouvelle catégorie de mots

**Version actuelle** : 2.0.0  
**Nouvelle version** : 2.1.0 (mineure, car nouvelle fonctionnalité)

**Fichiers à modifier** :

1. ✅ `js/game.js` → `const GAME_VERSION = '2.1.0';`
2. ✅ `index.html` → Remplacer tous les `?v=2.0.0` par `?v=2.1.0`
3. ✅ `CHANGELOG.md` → Ajouter section "Version 2.1.0"
4. ✅ `js/data-easy.js` (ou autre) → Ajouter les nouveaux mots
5. ✅ `js/categories.js` → Ajouter la nouvelle catégorie

**Upload** :

- Tous les fichiers modifiés sur le serveur

**Résultat** :

- Les utilisateurs voient automatiquement la nouvelle version
- Pas besoin de vider le cache ! 🎉

---

## 🐛 Dépannage

### Problème : L'ancienne version s'affiche encore

**Solutions** :

1. Vérifier que `index.html` a bien été uploadé avec les nouveaux numéros de version
2. Faire un hard refresh : `Ctrl + F5` (PC) ou `Cmd + Shift + R` (Mac)
3. Vider le cache du navigateur manuellement (dernière option)

### Problème : Erreurs JavaScript après la mise à jour

**Solutions** :

1. Ouvrir la console (F12) pour voir les erreurs
2. Vérifier que TOUS les fichiers JS ont été uploadés
3. Vérifier qu'aucun fichier n'a été corrompu pendant l'upload

---

## 💡 Conseils

1. **Gardez une trace** : Documentez chaque version dans `CHANGELOG.md`
2. **Testez localement** : Toujours tester avant de déployer
3. **Backups** : Gardez une copie de la version précédente
4. **Communication** : Informez les utilisateurs des nouveautés majeures
5. **Incréments cohérents** : Ne sautez pas de versions (2.0.0 → 2.1.0, pas 2.0.0 → 2.5.0)

---

## 🎉 Résumé

Le cache busting avec numéros de version :

- ✅ Force le rechargement automatique
- ✅ Fonctionne sur tous les navigateurs (PC, mobile)
- ✅ Simple à mettre en place
- ✅ Pas besoin de configuration serveur complexe
- ✅ Les utilisateurs voient les mises à jour immédiatement

**À chaque nouvelle version** :

1. Changer le numéro dans `game.js`
2. Remplacer tous les `?v=X.X.X` dans `index.html`
3. Mettre à jour `CHANGELOG.md`
4. Uploader et profiter ! 🚀
