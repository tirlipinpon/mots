# 🗂️ Guide des Catégories - Système Optimisé v1.5.1

## 📋 Liste des IDs de Catégories

| ID     | Clé           | Nom         | Emoji | Exemples                             |
| ------ | ------------- | ----------- | ----- | ------------------------------------ |
| **0**  | `toutes`      | Toutes      | 📦    | (Tous les mots)                      |
| **1**  | `animaux`     | Animaux     | 🐶    | chat, chien, lion, ours              |
| **2**  | `nourriture`  | Nourriture  | 🍎    | pain, pizza, pomme, lait             |
| **3**  | `nature`      | Nature      | 🌍    | eau, arbre, fleur, mer               |
| **4**  | `vehicules`   | Véhicules   | 🚗    | auto, vélo, avion, train             |
| **5**  | `nombres`     | Nombres     | 🔢    | un, deux, trois, dix                 |
| **6**  | `temps`       | Temps       | 📅    | lundi, mai, janvier                  |
| **7**  | `emotions`    | Émotions    | 😊    | joie, peur, amour, rage              |
| **8**  | `personnages` | Personnages | 🦸    | roi, héros, batman, bob              |
| **9**  | `corps`       | Corps       | 🧍    | main, pied, tête, œil                |
| **10** | `maison`      | Maison      | 🏠    | lit, table, porte, mur               |
| **11** | `couleurs`    | Couleurs    | 🎨    | rouge, vert, bleu, jaune             |
| **12** | `objets`      | Objets      | ⚔️    | arc, épée, livre, ballon             |
| **13** | `sports`      | Sports      | ⚽    | foot, tennis, rugby                  |
| **99** | `autres`      | Divers      | 🎲    | (Tout ce qui ne rentre pas ailleurs) |

---

## ✅ Format Optimisé (v1.5.1)

### **Nouveau format** (recommandé) :

```javascript
const DATA_EASY = {
  chat: { hint: "🐱 Animal domestique qui miaule", cat: 1 },
  pain: { hint: "🥖 Aliment de base", cat: 2 },
  eau: { hint: "💧 Liquide transparent", cat: 3 },
};
```

### **Ancien format** (toujours supporté) :

```javascript
const DATA_EASY = {
  chat: "🐱 Animal domestique qui miaule", // cat: 99 par défaut
  pain: "🥖 Aliment de base", // cat: 99 par défaut
};
```

---

## 📝 Comment ajouter un nouveau mot

### **Étape unique** (nouveau système ✨) :

```javascript
// Dans js/data-easy.js (ou data-medium.js, data-hard.js)
const DATA_EASY = {
  // ... mots existants

  souris: { hint: "🐭 Petit rongeur gris", cat: 1 }, // ← SEULEMENT ICI !
  //                                          ↑
  //                                  ID de catégorie
};
```

**C'est tout !** Pas besoin de toucher à `categories.js` ! 🎉

---

## 🔄 Migration de l'ancien format

Pour migrer un mot de l'ancien vers le nouveau format :

**Avant** :

```javascript
"chat": "🐱 Animal domestique qui miaule"
```

**Après** :

```javascript
"chat": { hint: "🐱 Animal domestique qui miaule", cat: 1 }
```

1. Entourer l'indice avec `hint: "..."`
2. Ajouter `, cat: ID` (voir tableau ci-dessus)
3. Entourer le tout avec `{ ... }`

---

## 💡 Exemples complets par catégorie

```javascript
const DATA_EASY = {
  // 1 = Animaux 🐶
  chat: { hint: "🐱 Animal domestique", cat: 1 },
  chien: { hint: "🐕 Meilleur ami de l'homme", cat: 1 },

  // 2 = Nourriture 🍎
  pain: { hint: "🥖 Aliment de base", cat: 2 },
  lait: { hint: "🥛 Boisson blanche", cat: 2 },

  // 3 = Nature 🌍
  eau: { hint: "💧 Liquide vital", cat: 3 },
  arbre: { hint: "🌳 Grande plante en bois", cat: 3 },

  // 5 = Nombres 🔢
  un: { hint: "1️⃣ Premier nombre", cat: 5 },
  deux: { hint: "2️⃣ Nombre après un", cat: 5 },

  // 7 = Émotions 😊
  joie: { hint: "😊 Sentiment de bonheur", cat: 7 },
  peur: { hint: "😰 Sentiment d'angoisse", cat: 7 },

  // 99 = Divers 🎲 (ou format ancien)
  chose: "🤷 Objet quelconque", // Sans cat: → Divers automatiquement
};
```

---

## 🎯 Avantages du nouveau système

✅ **Un seul endroit** : Ajoute le mot + catégorie en une seule ligne  
✅ **Facile à lire** : `cat: 1` = clair et concis  
✅ **Flexible** : Support de l'ancien format pour migration progressive  
✅ **Rapide** : Copier-coller un mot et changer juste le `cat:`  
✅ **Pas d'oubli** : Impossible d'oublier de mettre à jour 2 fichiers

---

## 🚀 Checklist pour ajouter un mot

- [ ] Ouvrir le bon fichier (`data-easy.js`, `data-medium.js`, ou `data-hard.js`)
- [ ] Ajouter : `"mot": { hint: "📝 Indice", cat: ID },`
- [ ] Regarder le tableau ci-dessus pour trouver le bon ID
- [ ] Rafraîchir le navigateur (Ctrl+Shift+R)
- [ ] Tester en sélectionnant la catégorie dans le jeu

**C'est fait !** ✨
