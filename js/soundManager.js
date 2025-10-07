// Gestionnaire des sons et effets sonores
class SoundManager {
    constructor() {
        this.isMuted = false;
        this.sounds = {};
        this.volume = 0.5; // Volume par défaut (50%)
        this.useAudioFiles = false; // Mettre à true pour utiliser des fichiers audio
        this.currentUser = null; // Utilisateur actuel pour les préférences
        
        this.initializeSounds();
        
        console.log('🔊 SoundManager initialisé');
    }
    
    // Initialiser les sons
    initializeSounds() {
        if (this.useAudioFiles) {
            // Mode fichiers audio - Charge les MP3/WAV depuis le dossier sounds/
            this.initializeAudioFiles();
        } else {
            // Mode beeps synthétiques - Génération avec Web Audio API
            this.initializeSyntheticSounds();
        }
    }
    
    // Initialiser avec des fichiers audio (avec fallback sur beeps)
    initializeAudioFiles() {
        console.log('🎵 Chargement des fichiers audio avec fallback...');
        
        const soundConfig = {
            letterWrong: { 
                file: 'sounds/letter-wrong.mp3',
                fallback: () => this.createBeep(200, 0.15, 'sawtooth')
            },
            letterWrongPlace: { 
                file: 'sounds/letter-wrong-place.mp3',
                fallback: () => this.createBeep(400, 0.1, 'triangle')
            },
            wordFound: { 
                file: 'sounds/word-found.mp3',
                fallback: () => this.createMelody([600, 800, 1000], 0.15)
            },
            levelCompleted: { 
                file: 'sounds/level-completed.mp3',
                fallback: () => this.createMelody([800, 1000, 1200, 1500], 0.2)
            },
            click: { 
                file: 'sounds/click.mp3',
                fallback: () => this.createBeep(300, 0.05, 'sine')
            },
            hint: { 
                file: 'sounds/hint.mp3',
                fallback: () => this.createBeep(500, 0.1, 'triangle')
            }
        };
        
        Object.keys(soundConfig).forEach(key => {
            this.sounds[key] = this.createAudioFileSound(
                soundConfig[key].file, 
                soundConfig[key].fallback()
            );
        });
    }
    
    // Créer un son à partir d'un fichier audio avec fallback
    createAudioFileSound(filePath, fallbackSound) {
        return () => {
            if (this.isMuted) return;
            
            try {
                const audio = new Audio(filePath);
                audio.volume = this.volume;
                
                audio.play().catch(e => {
                    // Si le fichier n'existe pas ou erreur, jouer le fallback
                    console.warn(`⚠️ Fichier ${filePath} introuvable, utilisation du son par défaut`);
                    if (fallbackSound) {
                        fallbackSound();
                    }
                });
            } catch (e) {
                // Erreur de chargement, jouer le fallback
                console.warn(`⚠️ Erreur chargement ${filePath}, utilisation du son par défaut`);
                if (fallbackSound) {
                    fallbackSound();
                }
            }
        };
    }
    
    // Initialiser avec des sons synthétiques
    initializeSyntheticSounds() {
        // Créer les sons avec Web Audio API
        // Format: createBeep(fréquence_Hz, durée_secondes, forme_onde)
        // Forme d'onde: 'sine' = doux, 'sawtooth' = râpeux, 'triangle' = moyen
        
        this.sounds = {
            // 🟢 Lettre correcte (verte) - Son joyeux et satisfaisant
            // Joué quand: L'utilisateur tape une lettre à la bonne place
            // letterCorrect: this.createBeep(800, 0.1, 'sine'),
            
            // 🔴 Lettre incorrecte (rouge) - Son d'erreur doux
            // Joué quand: L'utilisateur tape une lettre qui n'est pas dans le mot
            letterWrong: this.createBeep(200, 0.15, 'sawtooth'),
            
            // 🟠 Lettre mal placée (orange) - Son neutre informatif
            // Joué quand: Lettre existe dans le mot mais pas à cette position
            letterWrongPlace: this.createBeep(400, 0.1, 'triangle'),
            
            // 🎉 Mot trouvé - Mélodie de victoire montante
            // Chaque note dure 0.15s, crée une mélodie joyeuse
            // Joué quand: L'utilisateur trouve le mot complet
            wordFound: this.createMelody([600, 800, 1000], 0.15),
            
            // 🏆 Niveau complété - Grande fanfare de célébration
            // Plus longue (0.2s par note) pour une fanfare triomphale
            // Joué quand: Tous les mots d'un niveau sont trouvés
            levelCompleted: this.createMelody([800, 1000, 1200, 1500], 0.2),
            
            // 🖱️ Click - Son de bouton très court
            // Joué quand: Clic sur le bouton son ou autres boutons
            click: this.createBeep(300, 0.05, 'sine'),
            
            // 💡 Indice/Aide - Son mystérieux
            // Joué quand: L'utilisateur clique sur le bouton d'aide (?)
            hint: this.createBeep(500, 0.1, 'triangle')
        };
    }
    
    // Créer un beep simple
    createBeep(frequency, duration, type = 'sine') {
        return () => {
            if (this.isMuted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                console.warn('⚠️ Impossible de jouer le son:', e);
            }
        };
    }
    
    // Créer une mélodie (plusieurs notes)
    createMelody(frequencies, noteDuration) {
        return () => {
            if (this.isMuted) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                frequencies.forEach((freq, index) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    const startTime = audioContext.currentTime + (index * noteDuration);
                    const stopTime = startTime + noteDuration;
                    
                    gainNode.gain.setValueAtTime(this.volume, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);
                    
                    oscillator.start(startTime);
                    oscillator.stop(stopTime);
                });
            } catch (e) {
                console.warn('⚠️ Impossible de jouer la mélodie:', e);
            }
        };
    }
    
    // Jouer un son spécifique
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
            console.log(`🔊 Son joué: ${soundName}`);
        } else {
            console.warn(`⚠️ Son inconnu: ${soundName}`);
        }
    }
    
    // Activer/désactiver le son
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.saveSoundPreferences();
        console.log(this.isMuted ? '🔇 Sons désactivés' : '🔊 Sons activés');
        return this.isMuted;
    }
    
    // Définir le volume (0.0 à 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.saveSoundPreferences();
        console.log(`🔊 Volume: ${Math.round(this.volume * 100)}%`);
    }
    
    // Vérifier si les sons sont activés
    isSoundEnabled() {
        return !this.isMuted;
    }
    
    // Définir l'utilisateur actuel
    setUser(username) {
        this.currentUser = username;
        if (username) {
            this.loadSoundPreferences();
        }
    }

    // Sauvegarder les préférences sonores (par utilisateur)
    saveSoundPreferences() {
        if (!this.currentUser) return;
        
        const preferences = {
            isMuted: this.isMuted,
            volume: this.volume
        };
        localStorage.setItem(`mots_game_soundPreferences_${this.currentUser}`, JSON.stringify(preferences));
    }
    
    // Charger les préférences sonores (par utilisateur)
    loadSoundPreferences() {
        if (!this.currentUser) return;
        
        const saved = localStorage.getItem(`mots_game_soundPreferences_${this.currentUser}`);
        if (saved) {
            try {
                const preferences = JSON.parse(saved);
                this.isMuted = preferences.isMuted || false;
                this.volume = preferences.volume || 0.5;
                console.log('🔊 Préférences sonores chargées pour', this.currentUser);
            } catch (e) {
                console.warn('⚠️ Erreur chargement préférences sonores:', e);
            }
        } else {
            // Valeurs par défaut
            this.isMuted = false;
            this.volume = 0.5;
        }
    }
}

