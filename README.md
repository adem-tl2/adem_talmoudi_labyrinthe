#  Labyrinthe des Songes - Jeu d'évasion

##  Description
"Labyrinthe des Songes" est un jeu d’évasion interactif développé en HTML, CSS et JavaScript pur.  
Le joueur contrôle un personnage dans un labyrinthe et doit atteindre la sortie le plus rapidement possible tout en maximisant son score.

Le jeu est entièrement dessiné avec l’élément **Canvas HTML5** et propose une expérience immersive avec animations et effets visuels.

---

##  Objectif du jeu
- Se déplacer dans le labyrinthe à l’aide des flèches du clavier
- Trouver la sortie ⭐
- Terminer le plus rapidement possible pour obtenir un meilleur score

---

##  Technologies utilisées
- HTML5 (structure de la page)
- CSS3 (design, animations, interface utilisateur)
- JavaScript Vanilla (logique du jeu, canvas, événements clavier)
- Canvas API (dessin du labyrinthe)

---

##  Fonctionnalités principales
- Système de score dynamique basé sur le temps
-  Timer en temps réel
-  Meilleur temps sauvegardé (localStorage)
-  Déplacement du joueur avec les flèches du clavier
-  Labyrinthe généré sous forme de grille 15x15
-  Animation de la sortie et effet de victoire
-  Bouton "Nouvelle partie"

---

## Concepts appris
- Manipulation du DOM
- Gestion des événements clavier
- Utilisation du Canvas HTML5
- Logique de jeu (game loop, collision detection)
- Stockage local (localStorage)
- Animation en JavaScript et CSS

---

##  Difficultés rencontrées
- Gestion des déplacements dans le labyrinthe
- Synchronisation du timer avec le score
- Dessin dynamique avec Canvas
- Gestion des collisions avec les murs

---

##  Solutions apportées
- Utilisation d’une matrice 2D pour représenter le labyrinthe
- Vérification des cases avant chaque déplacement
- Utilisation de `setInterval` pour le timer
- Débogage progressif avec `console.log`
- Séparation logique (jeu / rendu / UI)

---

##  Lien du projet (GitHub Pages)
https://username.github.io/labyrinthe-des-songes/

---

##  Auteur
- Nom : Adem Talmoudi
- Projet : Labyrinthe des Songes