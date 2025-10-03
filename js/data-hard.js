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
    
    // Nourriture (2)
    "carotte": { hint: "🥕 Légume orange", cat: 2 },
    "chocolat": { hint: "🍫 Friandise brune et sucrée", cat: 2 },
    "fromage": { hint: "🧀 Produit laitier", cat: 2 },
    
    // Nature (3)
    "tempête": { hint: "⛈️ Mauvais temps avec vent et pluie", cat: 3 },
    "rivière": { hint: "🌊 Cours d'eau", cat: 3 },
    "lumière": { hint: "💡 Ce qui éclaire et rend visible", cat: 3 },
    "montagne": { hint: "⛰️ Grande élévation de terre", cat: 3 },
    "tonnerre": { hint: "⚡ Bruit fort pendant l'orage", cat: 3 },
    "arcenciel": { hint: "🌈 Arc-en-ciel avec toutes les couleurs", cat: 3 },
    
    // Véhicules (4)
    "téléphone": { hint: "📱 Appareil pour appeler", cat: 4 },
    "ordinateur": { hint: "💻 Machine pour travailler", cat: 4 },
    "voiture": { hint: "🚗 Véhicule à 4 roues", cat: 4 },
    
    // Nombres (5)
    "quatorze": { hint: "🔢 Quatorze (14)", cat: 5 },
    
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
    "amitié": { hint: "🤝 Lien d'affection entre amis", cat: 7 },
    
    // Personnages (8)
    "sorcier": { hint: "🧙 Homme sage qui connaît tous les sorts", cat: 8 },
    "magicien": { hint: "🧙 Personne qui pratique la magie", cat: 8 },
    "princesse": { hint: "👸 Fille du roi et de la reine", cat: 8 },
    "monstre": { hint: "👹 Créature effrayante et dangereuse", cat: 8 },
    "spiderman": { hint: "🕷️ Super-héros qui grimpe aux murs", cat: 8 },
    "superman": { hint: "🦸 Super-héros qui vole", cat: 8 },
    "aladdin": { hint: "🧞 Jeune homme avec une lampe magique", cat: 8 },
    "chevalier": { hint: "⚔️ Guerrier courageux qui protège les gens", cat: 8 },
    
    // Corps (9)
    // (pas de mots difficiles pour cette catégorie)
    
    // Maison (10)
    "hôpital": { hint: "🏥 Lieu où on soigne", cat: 10 },
    
    // Couleurs (11)
    // (pas de mots difficiles pour cette catégorie)
    
    // Objets (12)
    "cristal": { hint: "💎 Pierre précieuse et brillante", cat: 12 },
    "château": { hint: "🏰 Grande maison fortifiée des rois", cat: 12 },
    "couronne": { hint: "👑 Bijou doré que portent les rois et reines", cat: 12 },
    
    // Sports (13)
    // (pas de mots difficiles pour cette catégorie)
    
    // Divers (99)
    "famille": { hint: "👨‍👩‍👧‍👦 Groupe de personnes liées", cat: 99 },
    "mystère": { hint: "🔍 Énigme mystérieuse à résoudre", cat: 99 },
    "magique": { hint: "🎩 Pouvoir surnaturel qui fait des miracles", cat: 99 },
    "aventure": { hint: "🗺️ Voyage excitant plein de découvertes", cat: 99 },
    "liberté": { hint: "🕊️ Droit de faire ce qu'on veut", cat: 99 },
    "courageux": { hint: "💪 Qualité de quelqu'un qui n'a pas peur", cat: 99 }
};
