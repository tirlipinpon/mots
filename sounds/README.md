# 🔊 Dossier des Sons

Ce dossier est destiné à contenir les fichiers sonores du jeu.

## 📝 Mode actuel

Pour l'instant, le jeu utilise des **sons générés par Web Audio API** (beeps synthétiques).

---

## 🎵 Comment utiliser TES PROPRES fichiers audio

### **Étape 1 : Télécharger des sons** 📥

Sites gratuits recommandés :

- [Freesound.org](https://freesound.org/) - Sons libres de droits
- [Zapsplat.com](https://www.zapsplat.com/) - Effets sonores gratuits
- [Mixkit.co](https://mixkit.co/free-sound-effects/) - Sons de qualité
- [Pixabay](https://pixabay.com/sound-effects/) - Sons et musiques

### **Étape 2 : Placer tes fichiers ici** 📁

Copie tes fichiers dans ce dossier `sounds/` avec ces noms **EXACTEMENT** :

```
sounds/
├── letter-correct.mp3      🟢 Son pour lettre verte (ding joyeux)
├── letter-wrong.mp3        🔴 Son pour lettre rouge (erreur douce)
├── letter-wrong-place.mp3  🟠 Son pour lettre orange (neutre)
├── word-found.mp3          🎉 Son mot trouvé (applaudissements)
├── level-completed.mp3     🏆 Son niveau complété (fanfare)
├── click.mp3               🖱️ Son pour boutons (petit clic)
└── hint.mp3                💡 Son pour l'aide (mystérieux)
```

**⚠️ IMPORTANT:** Les noms doivent être **exactement** comme indiqué (avec les tirets et minuscules).

### **Étape 3 : Activer le mode fichiers audio** ⚙️

1. Ouvre le fichier `js/soundManager.js`
2. Trouve la ligne 7 :
   ```javascript
   this.useAudioFiles = false;
   ```
3. Change-la en :
   ```javascript
   this.useAudioFiles = true;
   ```
4. Sauvegarde le fichier

### **✨ Système de Fallback Automatique**

**NOUVEAU depuis v1.4.2** : Tu n'as **plus besoin d'avoir tous les fichiers** !

- ✅ Si `letter-correct.mp3` existe → Joue ton fichier MP3
- ✅ Si `letter-correct.mp3` n'existe pas → Joue le beep par défaut (800Hz)
- ✅ Tu peux n'avoir que **quelques fichiers**, le reste utilise les beeps
- ✅ L'utilisateur **entend toujours un son**, jamais de silence

**Exemple :**

```
sounds/
├── word-found.mp3          ✅ Ton super son personnalisé
└── (pas d'autres fichiers)
```

→ Résultat : `word-found` utilise ton MP3, **tous les autres** utilisent les beeps ! 🎯

### **Étape 4 : Tester** 🎮

1. Rafraîchis le navigateur : **Ctrl + Shift + R**
2. Joue au jeu
3. Tes sons personnalisés devraient se jouer !
4. Vérifie la console (F12) pour voir si les fichiers sont bien chargés

---

## 🎵 Recommandations techniques

### **Format de fichier**

- **MP3** ✅ (meilleure compatibilité tous navigateurs)
- **WAV** ✅ (meilleure qualité, fichiers plus gros)
- **OGG** ✅ (bon compromis qualité/taille)

### **Caractéristiques audio**

- **Durée:** 0.1 à 2 secondes max (courts et réactifs)
- **Taille:** < 100 Ko par fichier (chargement rapide)
- **Volume:** Normalisés (pas trop forts ni trop faibles)
- **Bitrate:** 128 kbps suffit
- **Licence:** Creative Commons CC0 ou domaine public

### **Suggestions de recherche**

Sur Freesound.org, cherche ces termes :

- 🟢 **"ding"**, **"correct"**, **"success beep"** → lettre verte
- 🔴 **"wrong"**, **"error soft"**, **"buzz"** → lettre rouge
- 🟠 **"neutral beep"**, **"notification"** → lettre orange
- 🎉 **"success"**, **"win"**, **"cheer"** → mot trouvé
- 🏆 **"fanfare"**, **"victory"**, **"triumph"** → niveau complété
- 🖱️ **"click"**, **"button"**, **"tap"** → boutons
- 💡 **"hint"**, **"mystery"**, **"question"** → aide

---

## 🔧 Dépannage

### **Les sons ne marchent pas ?**

1. ✅ Vérifie que les fichiers sont bien dans `sounds/`
2. ✅ Vérifie que les noms sont **exactement** corrects (avec tirets)
3. ✅ Vérifie que `useAudioFiles = true` dans `soundManager.js`
4. ✅ Ouvre la console (F12) pour voir les erreurs
5. ✅ Essaie avec un seul fichier d'abord pour tester

### **Revenir aux beeps synthétiques**

Si tes fichiers ne fonctionnent pas :

- Remets `useAudioFiles = false` dans `soundManager.js`
- Rafraîchis le navigateur

### **Message d'erreur dans la console**

Si tu vois :

```
⚠️ Impossible de jouer sounds/letter-correct.mp3
```

Cela signifie que le fichier n'existe pas ou n'a pas le bon nom.

---

## 💡 Astuce : Mixer beeps et fichiers

Tu peux aussi utiliser **tes fichiers pour certains sons** et **les beeps pour d'autres** !

Dans `soundManager.js`, modifie `initializeSyntheticSounds()` :

```javascript
this.sounds = {
  // Ton fichier personnalisé
  wordFound: this.createAudioFileSound("sounds/mon-super-son.mp3"),

  // Beeps synthétiques pour le reste
  letterCorrect: this.createBeep(800, 0.1, "sine"),
  letterWrong: this.createBeep(200, 0.15, "sawtooth"),
  // ... etc
};
```

---

## 🎯 Résumé rapide

1. 📥 Télécharge 7 fichiers son
2. 📁 Place-les dans `sounds/` avec les bons noms
3. ⚙️ Change `useAudioFiles = true` (ligne 7 de soundManager.js)
4. 🔄 Rafraîchis le navigateur
5. 🎮 Joue et profite de tes sons !
