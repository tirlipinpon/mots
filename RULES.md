# Règles de développement du projet

## ⚠️ RÈGLE CRITIQUE : Mise à jour de la version

**À CHAQUE modification du code, il est OBLIGATOIRE de mettre à jour le numéro de version dans le fichier `js/game.js`.**

### Localisation

La version se trouve au début du fichier `js/game.js` :

```javascript
// Jeu principal - Orchestrateur
// Version: X.X.X
const GAME_VERSION = "X.X.X";
```

### Procédure

1. **Ligne 2** : Mettre à jour le commentaire `// Version: X.X.X`
2. **Ligne 3** : Mettre à jour la constante `const GAME_VERSION = 'X.X.X';`

### Convention de versionnement

- **Version majeure** (X.0.0) : Changements majeurs, refonte complète
- **Version mineure** (1.X.0) : Nouvelles fonctionnalités
- **Version patch** (1.8.X) : Corrections de bugs, petites améliorations

### Exemples

- Ajout d'une nouvelle fonctionnalité → 1.8.2 → 1.8.3
- Correction d'un bug → 1.8.3 → 1.8.4
- Refonte majeure → 1.8.4 → 2.0.0

---

## 📝 Autres règles

- Suivre les conventions JavaScript du fichier (voir workspace rules)
- Tester après chaque modification
- Vérifier avec `read_lints` avant de valider
- Documenter les changements importants dans CHANGELOG.md (si nécessaire)

---

**Date de création : 2025-10-07**
**Dernière mise à jour : 2025-10-07**
