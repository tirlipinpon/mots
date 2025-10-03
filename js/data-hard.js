// NIVEAU DIFFICILE (7+ lettres) - Mots longs et complexes
// Format: { hint: "indice", cat: ID }
// IDs: 1=Animaux, 2=Nourriture, 3=Nature, 4=Véhicules, 5=Nombres, 6=Temps,
//      7=Émotions, 8=Personnages, 9=Corps, 10=Maison, 11=Couleurs, 12=Objets, 13=Sports, 99=Divers

const DATA_HARD = {
    // Animaux (1)
    "baleine": { hint: "🐋 Très gros animal marin", cat: 1 },
    "chameau": { hint: "🐪 Animal du désert avec des bosses", cat: 1 },
    "abeille": { hint: "🐝 Insecte qui fait du miel", cat: 1 },
    "papillon": { hint: "🦋 Insecte coloré qui vole", cat: 1 },
    "éléphant": { hint: "🐘 Très gros animal avec une trompe", cat: 1 },
    "dauphin": { hint: "🐬 Animal marin intelligent et joueur", cat: 1 },
    "pingouin": { hint: "🐧 Oiseau qui ne vole pas, nage bien", cat: 1 },
    "dinosaure": { hint: "🦕 Animal géant préhistorique", cat: 1 },
    "kangourou": { hint: "🦘 Animal qui saute avec une poche", cat: 1 },
    "crocodile": { hint: "🐊 Reptile avec de grandes dents", cat: 1 },
    "hippopotame": { hint: "🦛 Très gros animal qui vit dans l'eau", cat: 1 },
    "perroquet": { hint: "🦜 Oiseau coloré qui peut parler", cat: 1 },
    "coccinelle": { hint: "🐞 Petite bête rouge avec des points noirs", cat: 1 },
    "panthère": { hint: "🐆 Grand chat noir très rapide", cat: 1 },
    "pieuvre": { hint: "🐙 Animal marin avec 8 tentacules", cat: 1 },
    
    // Nourriture (2)
    "carotte": { hint: "🥕 Légume orange que les lapins adorent", cat: 2 },
    "chocolat": { hint: "🍫 Friandise brune et sucrée", cat: 2 },
    "fromage": { hint: "🧀 Produit laitier préféré des souris", cat: 2 },
    "spaghetti": { hint: "🍝 Pâtes longues et fines d'Italie", cat: 2 },
    "sandwich": { hint: "🥪 Pain avec quelque chose dedans", cat: 2 },
    "biscuit": { hint: "🍪 Petit gâteau croquant et sucré", cat: 2 },
    "popcorn": { hint: "🍿 Maïs qui éclate en mangeant", cat: 2 },
    "crêperie": { hint: "🥞 Restaurant qui sert des crêpes", cat: 2 },
    "gâteaux": { hint: "🎂 Plusieurs desserts d'anniversaire", cat: 2 },
    "confiture": { hint: "🍓 Fruits écrasés et sucrés à tartiner", cat: 2 },
    
    // Nature (3)
    "tempête": { hint: "⛈️ Mauvais temps avec vent et pluie", cat: 3 },
    "rivière": { hint: "🌊 Cours d'eau qui coule", cat: 3 },
    "lumière": { hint: "💡 Ce qui éclaire et rend visible", cat: 3 },
    "montagne": { hint: "⛰️ Grande élévation de terre très haute", cat: 3 },
    "tonnerre": { hint: "⚡ Bruit fort pendant l'orage", cat: 3 },
    "arcenciel": { hint: "🌈 Arc avec toutes les couleurs après la pluie", cat: 3 },
    "palmier": { hint: "🌴 Arbre tropical avec noix de coco", cat: 3 },
    "coquillage": { hint: "🐚 Maison des escargots de mer", cat: 3 },
    "cascade": { hint: "💦 Eau qui tombe de très haut", cat: 3 },
    "étoiles": { hint: "✨ Lumières qui brillent la nuit", cat: 3 },
    "planète": { hint: "🪐 Grosse boule dans l'espace", cat: 3 },
    
    // Véhicules (4)
    "téléphone": { hint: "📱 Appareil pour appeler et jouer", cat: 4 },
    "ordinateur": { hint: "💻 Machine pour travailler et jouer", cat: 4 },
    "voiture": { hint: "🚗 Véhicule à 4 roues", cat: 4 },
    "hélicoptère": { hint: "🚁 Avion avec une hélice sur le toit", cat: 4 },
    "tracteur": { hint: "🚜 Gros véhicule de la ferme", cat: 4 },
    
    // Nombres (5)
    "quatorze": { hint: "🔢 (14)", cat: 5 },
    
    // Temps (6)
    "février": { hint: "❄️ Deuxième mois de l'année", cat: 6 },
    "décembre": { hint: "❄️ Douzième mois de l'année", cat: 6 },
    "mercredi": { hint: "📅 Troisième jour de la semaine", cat: 6 },
    "vendredi": { hint: "📅 Cinquième jour de la semaine", cat: 6 },
    "dimanche": { hint: "📅 Jour de repos", cat: 6 },
    "janvier": { hint: "❄️ Premier mois de l'année", cat: 6 },
    "juillet": { hint: "☀️ Septième mois de l'année", cat: 6 },
    "septembre": { hint: "🍂 Neuvième mois de l'année", cat: 6 },
    "octobre": { hint: "🍂 Dixième mois de l'année", cat: 6 },
    "novembre": { hint: "🍂 Onzième mois de l'année", cat: 6 },
    
    // Émotions (7)
    "bonheur": { hint: "😊 Sentiment de grande joie", cat: 7 },
    "courage": { hint: "💪 Force face à la peur", cat: 7 },
    "sourire": { hint: "😊 Expression du visage qui montre la joie", cat: 7 },
    "heureux": { hint: "😄 Sentiment de grande joie et de bonheur", cat: 7 },
    "tendresse": { hint: "💕 Sentiment doux et affectueux", cat: 7 },
    
    // Personnages (8)
    "sorcier": { hint: "🧙 Homme sage qui connaît tous les sorts", cat: 8 },
    "magicien": { hint: "🧙 Personne qui pratique la magie", cat: 8 },
    "princesse": { hint: "👸 Fille du roi et de la reine", cat: 8 },
    "monstre": { hint: "👹 Créature effrayante et dangereuse", cat: 8 },
    "spiderman": { hint: "🕷️ Super-héros qui grimpe aux murs", cat: 8 },
    "superman": { hint: "🦸 Super-héros qui vole", cat: 8 },
    "aladdin": { hint: "🧞 Jeune homme avec une lampe magique", cat: 8 },
    "chevalier": { hint: "⚔️ Guerrier courageux qui protège les gens", cat: 8 },
    "pinocchio": { hint: "🤥 Pantin en bois dont le nez grandit quand il ment", cat: 8 },
    "cendrillon": { hint: "👗 Princesse qui perd sa pantoufle de verre", cat: 8 },
    "raiponce": { hint: "💇‍♀️ Princesse avec des cheveux très très longs", cat: 8 },
    "pocahontas": { hint: "🍃 Princesse indienne qui aime la nature", cat: 8 },
    "ironman": { hint: "🦾 Super-héros avec armure de fer rouge", cat: 8 },
    "captain": { hint: "🛡️ America - super-héros avec bouclier", cat: 8 },
    
    // Corps (9)
    "cheveux": { hint: "💇 Poils qui poussent sur la tête", cat: 9 },
    "cerveau": { hint: "🧠 Organe pour penser et réfléchir", cat: 9 },
    "squelette": { hint: "💀 Tous les os du corps assemblés", cat: 9 },
    "estomac": { hint: "🫃 Organe qui digère la nourriture", cat: 9 },
    
    // Maison (10)
    "hôpital": { hint: "🏥 Lieu où on soigne les malades", cat: 10 },
    "cuisine": { hint: "🍳 Pièce où on prépare les repas", cat: 10 },
    "chambre": { hint: "🛏️ Pièce où on dort", cat: 10 },
    "fenêtre": { hint: "🪟 Ouverture pour voir dehors", cat: 10 },
    "escalier": { hint: "🪜 Pour monter et descendre les étages", cat: 10 },
    
    // Couleurs (11)
    // (pas de mots difficiles pour cette catégorie)
    
    // Objets (12)
    "cristal": { hint: "💎 Pierre précieuse et brillante", cat: 12 },
    "château": { hint: "🏰 Grande maison fortifiée des rois", cat: 12 },
    "couronne": { hint: "👑 Bijou doré que portent les rois et reines", cat: 12 },
    "parapluie": { hint: "☂️ Objet pour se protéger de la pluie", cat: 12 },
    "balançoire": { hint: "🎪 Jeu qui se balance dans les airs", cat: 12 },
    "toboggan": { hint: "🛝 Glissade amusante au parc", cat: 12 },
    "trampoline": { hint: "🤸 Pour sauter très haut et rebondir", cat: 12 },
    "télévision": { hint: "📺 Appareil pour regarder des dessins animés", cat: 12 },
    "dinosaure": { hint: "🦖 Jouet en forme de reptile géant", cat: 12 },
    
    // Sports (13)
    "football": { hint: "⚽ Sport le plus populaire au monde", cat: 13 },
    "basketball": { hint: "🏀 Sport avec panier et ballon orange", cat: 13 },
    "natation": { hint: "🏊 Sport dans l'eau avec maillot", cat: 13 },
    "gymnastique": { hint: "🤸 Sport avec acrobaties et souplesse", cat: 13 },
    
    // Divers (99)
    "famille": { hint: "👨‍👩‍👧‍👦 Papa, maman et les enfants ensemble", cat: 99 },
    "mystère": { hint: "🔍 Énigme mystérieuse à résoudre", cat: 99 },
    "magique": { hint: "🎩 Pouvoir surnaturel qui fait des miracles", cat: 99 },
    "aventure": { hint: "🗺️ Voyage excitant plein de découvertes", cat: 99 },
    "liberté": { hint: "🕊️ Droit de faire ce qu'on veut", cat: 99 },
    "courageux": { hint: "💪 Qualité de quelqu'un qui n'a pas peur", cat: 99 },
    "fantôme": { hint: "👻 Créature blanche qui traverse les murs", cat: 99 },
    "licorne": { hint: "🦄 Cheval magique avec une corne", cat: 99 },
    "rigolote": { hint: "😂 Très drôle, qui fait rire", cat: 99 },
    "surprise": { hint: "🎁 Chose inattendue qui fait plaisir", cat: 99 },
    "vacances": { hint: "🏖️ Période sans école pour s'amuser", cat: 99 },
    "histoire": { hint: "📖 Récit qu'on raconte ou lit", cat: 99 },
    "gentillesse": { hint: "😊 Qualité de quelqu'un qui est gentil", cat: 99 },
    "champion": { hint: "🏆 Gagnant d'une compétition", cat: 99 }
};

