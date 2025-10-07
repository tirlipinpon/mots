// NIVEAU FACILE (3-4 lettres) - Mots courts et simples
// Format: { hint: "indice", cat: ID }
// IDs: 1=Animaux, 2=Nourriture, 3=Nature, 4=Véhicules, 5=Nombres, 6=Temps,
//      7=Émotions, 8=Personnages, 9=Corps, 10=Maison, 11=Couleurs, 12=Objets, 13=Sports, 99=Divers

const DATA_EASY = {
    // Animaux (1)
    "chat": { hint: "🐱 Animal de compagnie ronronnant", cat: 1 },
    "ours": { hint: "🐻 Gros animal poilu", cat: 1 },
    "lion": { hint: "🦁 Roi de la jungle", cat: 1 },
    "loup": { hint: "🐺 Animal sauvage qui hurle", cat: 1 },
    "élan": { hint: "🦌 Grand cerf du nord", cat: 1 },
    
    // Nourriture (2)
    "pain": { hint: "🥖 Aliment de base fait avec de la farine", cat: 2 },
    "lait": { hint: "🥛 Boisson blanche des vaches", cat: 2 },
    "thé": { hint: "🍵 Boisson chaude", cat: 2 },
    "sel": { hint: "🧂 Pour donner du goût", cat: 2 },
    "noix": { hint: "🌰 Fruit à coque", cat: 2 },
    "miel": { hint: "🍯 Fait par les abeilles", cat: 2 },
    
    // Nature (3)
    "eau": { hint: "💧 Liquide transparent et vital", cat: 3 },
    "air": { hint: "💨 Ce qu'on respire", cat: 3 },
    "mer": { hint: "🌊 Grande étendue d'eau salée", cat: 3 },
    "lac": { hint: "🏞️ Eau douce entourée de terre", cat: 3 },
    "île": { hint: "🏝️ Terre entourée d'eau", cat: 3 },
    "feu": { hint: "🔥 Flammes chaudes", cat: 3 },
    "lune": { hint: "🌙 Astre qui brille la nuit dans le ciel", cat: 3 },
    "parc": { hint: "🌳 Espace vert en ville", cat: 3 },
    "nid": { hint: "🪹 Maison des oiseaux", cat: 3 },
    
    // Véhicules (4)
    "vélo": { hint: "🚲 Véhicule à 2 roues", cat: 4 },
    "bus": { hint: "🚌 Grand véhicule public", cat: 4 },
    "auto": { hint: "🚗 Autre mot pour voiture", cat: 4 },
    "taxi": { hint: "🚕 Voiture qu'on loue", cat: 4 },
    "moto": { hint: "🏍️ Deux roues motorisé", cat: 4 },
    
    // Nombres (5)
    "un": { hint: "1️⃣ Premier nombre", cat: 5 },
    "deux": { hint: "2️⃣ Nombre après un", cat: 5 },
    "cinq": { hint: "5️⃣ Le nombre entre 4 et 6", cat: 5 },
    "six": { hint: "6️⃣ ", cat: 5 },
    "sept": { hint: "7️⃣ ", cat: 5 },
    "huit": { hint: "8️⃣ ", cat: 5 },
    "neuf": { hint: "9️⃣ ", cat: 5 },
    "dix": { hint: "🔟 ", cat: 5 },
    "onze": { hint: "1️⃣1️⃣ ", cat: 5 },
    "zéro": { hint: "0️⃣ Rien, le nombre nul", cat: 5 },
    
    // Temps (6)
    "mai": { hint: "🌸 Mois du printemps", cat: 6 },
    "août": { hint: "☀️ Mois des vacances", cat: 6 },
    "nuit": { hint: "🌙 Quand il fait noir", cat: 6 },
    "jour": { hint: "☀️ Quand il fait clair", cat: 6 },
    
    // Émotions (7)
    "rage": { hint: "😡 Sentiment de colère", cat: 7 },
    "peur": { hint: "😰 Sentiment d'angoisse", cat: 7 },
    "joie": { hint: "😊 Sentiment de bonheur", cat: 7 },
    "paix": { hint: "☮️ Absence de guerre et de conflit", cat: 7 },
    "rire": { hint: "😄 Faire ha ha ha", cat: 7 },
    
    // Personnages (8)
    "bob": { hint: "🏗️ Éponge qui vit dans un ananas", cat: 8 },
    "buzz": { hint: "🚀 Astronaute de Toy Story", cat: 8 },
    "roi": { hint: "👑 Chef d'un royaume", cat: 8 },
    "papa": { hint: "👨 Le père", cat: 8 },
    "fils": { hint: "👦 Garçon de la famille", cat: 8 },
    "bébé": { hint: "👶 Très jeune enfant", cat: 8 },
    "ange": { hint: "😇 Créature céleste", cat: 8 },
    
    // Corps (9)
    "oeil": { hint: "👁️ Pour voir", cat: 9 },
    "main": { hint: "✋ Avec cinq doigts", cat: 9 },
    "pied": { hint: "🦶 Pour marcher", cat: 9 },
    "bras": { hint: "💪 Entre épaule et main", cat: 9 },
    "tête": { hint: "🧠 Contient le cerveau", cat: 9 },
    "nez": { hint: "👃 Pour sentir les odeurs", cat: 9 },
    "dos": { hint: "↩️ Arrière du corps", cat: 9 },
    
    // Maison (10)
    "mur": { hint: "🧱 Paroi d'une maison", cat: 10 },
    "lit": { hint: "🛏️ Meuble pour dormir", cat: 10 },
    "sac": { hint: "🎒 Pour transporter des affaires", cat: 10 },
    "bol": { hint: "🥣 Pour manger la soupe", cat: 10 },
    "clé": { hint: "🔑 Ouvre les portes", cat: 10 },
    "porte": { hint: "🚪 Pour entrer", cat: 10 },
    
    // Couleurs (11)
    "vert": { hint: "🌿 Couleur de l'herbe et des feuilles", cat: 11 },
    
    // Objets (12)
    "arc": { hint: "🏹 Arme qui lance des flèches très loin", cat: 12 },
    "épée": { hint: "⚔️ Arme brillante et pointue des chevaliers", cat: 12 },
    "phare": { hint: "🗼 Tour qui guide les bateaux", cat: 12 },
    "cage": { hint: "🔒 Prison pour animaux", cat: 12 },
    
    // Sports (13)
    "ski": { hint: "⛷️ Sport d'hiver sur la neige", cat: 13 },
    "foot": { hint: "⚽ Sport avec un ballon", cat: 13 },
    "golf": { hint: "⛳ Sport avec balle et trous", cat: 13 },
    "boxe": { hint: "🥊 Sport de combat", cat: 13 },
    
    // Divers (99)
    "rêve": { hint: "💭 Pensée qui vient quand on dort", cat: 99 },
    "fée": { hint: "🧚 Petite créature magique avec des ailes", cat: 99 },
    "ami": { hint: "🤝 Personne qu'on aime bien", cat: 99 },
    "jeu": { hint: "🎮 Activité amusante", cat: 99 },
    "voie": { hint: "🛣️ Chemin ou route", cat: 99 },
    "pont": { hint: "🌉 Pour traverser l'eau", cat: 99 },
    "tour": { hint: "🗼 Très haut bâtiment", cat: 99 },
    "fin": { hint: "🏁 Terminé", cat: 99 }
};
