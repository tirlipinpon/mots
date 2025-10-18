# 🧪 Guide de test - SessionManager

## 📋 Modifications apportées

✅ **Fichier créé** : `js/sessionManager.js`

- Gestionnaire de session autonome et réutilisable
- Utilise `sessionStorage` + `localStorage`

✅ **Fichier modifié** : `index.html`

- Ajout de `<script src="js/sessionManager.js"></script>` avant `userManager.js`

✅ **Fichier modifié** : `js/userManager.js`

- Intégration du SessionManager dans le constructeur
- Auto-restauration de session au chargement
- Méthodes `login()` et `logout()` utilisent SessionManager

✅ **Fichier modifié** : `js/game.js`

- Gestion de l'état initial selon la session
- Mise à jour de l'UI si session restaurée

---

## 🧪 Comment tester

### Test 1 : Connexion et refresh (F5)

1. **Ouvrir l'application** dans le navigateur
2. **Se connecter** avec un nom (ex: "Tony")
3. **Jouer** à quelques mots
4. **Appuyer sur F5** (refresh de la page)
5. ✅ **ATTENDU** : Vous êtes toujours connecté, vos données sont là

### Test 2 : Fermeture de l'onglet

1. **Se connecter** avec un nom
2. **Fermer complètement l'onglet** (clic sur X)
3. **Rouvrir** l'application dans un nouvel onglet
4. ✅ **ATTENDU** : Vous êtes déconnecté, besoin de se reconnecter

### Test 3 : Données persistantes

1. **Se connecter** et jouer à quelques mots
2. **Refresh (F5)**
3. ✅ **ATTENDU** : Les mots trouvés, les stats, le niveau sont préservés

### Test 4 : Déconnexion manuelle

1. **Se connecter**
2. **Cliquer sur "Déconnexion"**
3. **Refresh (F5)**
4. ✅ **ATTENDU** : Vous restez déconnecté

### Test 5 : Partage entre applications (bonus)

1. **Créer une deuxième application** avec le même SessionManager
2. **Se connecter** dans l'application 1
3. **Ouvrir** l'application 2 dans un nouvel onglet
4. ✅ **ATTENDU** : Le même nom d'utilisateur est disponible

---

## 🔍 Debug dans la console

Ouvrez la console (F12) pour voir les logs :

```javascript
// Voir l'état de la session
sessionManager.getDebugInfo()

// Résultat attendu si connecté :
{
  currentUser: "Tony",
  sessionActive: "true",
  sharedUser: "Tony",
  sharedPrefix: "shared_apps_"
}
```

---

## 🎯 Comportements attendus

| Action              | Session active ? | Données sauvegardées ? |
| ------------------- | ---------------- | ---------------------- |
| 🔄 Refresh (F5)     | ✅ OUI           | ✅ OUI                 |
| ❌ Fermer onglet    | ❌ NON           | ✅ OUI (en cookies)    |
| 🚪 Déconnexion      | ❌ NON           | ✅ OUI (en cookies)    |
| 🌐 Nouvelle fenêtre | ❌ NON           | ✅ OUI (en cookies)    |

---

## 📦 Données stockées

### SessionStorage (disparaît à la fermeture)

- `session_active` : "true" ou non présent

### LocalStorage (partagé entre apps)

- `shared_apps_current_user` : "Nom de l'utilisateur"

### Cookies (données de jeu, persistantes)

- `mots_game_wordsByDifficulty_[username]` : Mots trouvés par difficulté
- `mots_game_stats_[username]` : Statistiques de l'utilisateur
- `mots_game_userPreferences` : Préférences globales

---

## ✅ Validation finale

Après les tests, vous devriez observer :

1. ✅ **Refresh** : Reste connecté
2. ✅ **Fermeture onglet** : Déconnexion automatique
3. ✅ **Données préservées** : Mots trouvés et stats restent
4. ✅ **Console propre** : Logs clairs sur la restauration de session
5. ✅ **UI à jour** : Section connexion masquée, score visible

---

## 🐛 Problèmes potentiels

### Si vous ne restez pas connecté après F5 :

- Vérifier que `sessionStorage` n'est pas désactivé dans le navigateur
- Vérifier que le script `sessionManager.js` se charge AVANT `userManager.js`

### Si les données ne se chargent pas :

- Vérifier la console pour les erreurs
- Vérifier que les cookies ne sont pas bloqués

### Si vous restez connecté après fermeture d'onglet :

- Le navigateur pourrait garder la session (mode développement)
- Essayer en mode navigation privée

---

## 🎉 Prochaines étapes

Une fois les tests validés, vous pouvez :

1. **Copier** `sessionManager.js` dans d'autres applications
2. **Partager** l'utilisateur entre plusieurs jeux
3. **Personnaliser** le préfixe `SHARED_PREFIX` si besoin

Bon test ! 🚀
