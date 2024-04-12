"use strict";   // activer le mode strict

const gameEl = document.getElementById('game'); // l’élément du DOM dont l’identifiant est game.
console.log(gameEl) // verification 


function setLetter(rowNumber, tileNumber, letter) {
    /* fonction pour remplacer la lettre X par la lettre spécifiée à position spécifiée */
    const row = gameEl.children[rowNumber]; // trouver la ligne spécifiée (indices de 0 à 4)
    const tile = row.children[tileNumber]; // trouver la colonne spécifiée dans la ligne (indices de 0 à 4)
    tile.textContent = letter;  // modifier le contenu de la tuile pour y mettre la lettre spécifiée
}


function removeLetter(rowNumber, tileNumber, letter) {
    /* fonction pour effacer les lettres */
    const row = gameEl.children[rowNumber]; // trouver la ligne spécifiée (indices de 0 à 4)
    const tile = row.children[tileNumber]; // trouver la colonne spécifiée dans la ligne (indices de 0 à 4)
    tile.textContent = "X"; // modifier le contenu pour effacer la lettre 
}

// setLetter(1, 4, 'U');     


// variables globales
let currentRowIndex = 0;
let currentTileIndex = 0;
const maxRow = 5;
const maxTile = 5;
let targetWord = "matin";



function keyUpHandler(event) {
    /* fonction pour les touches du clavier  */
    const keyCode = event.keyCode;  // récuperer le code de la touche
    const key = event.key;  // récuperer la touche 

    if (keyCode >= 65 && keyCode <= 90) { // si la touche c'est une lettre, on la place dans le tableau
        if (currentRowIndex < maxRow && currentTileIndex < maxTile) {
            setLetter(currentRowIndex, currentTileIndex, key);
            currentTileIndex++;
        } else {
            currentRowIndex++;
            currentTileIndex = 0;
            if (currentRowIndex < maxRow && currentTileIndex < maxTile) {
                setLetter(currentRowIndex, currentTileIndex, key);
                currentTileIndex++;
            }
        }
    } else if (keyCode === 8) { // sinon si la touche est un "Backspace" on efface la lettre
        if (currentTileIndex > 0) {     // verifier si la colonne n'est pas vide
            currentTileIndex--;
            removeLetter(currentRowIndex, currentTileIndex); // Supprime la lettre actuelle
        } else if (currentRowIndex > 0) {   // verifier si la ligne n'est pas vide
            currentRowIndex--;
            currentTileIndex = maxTile - 1;
            removeLetter(currentRowIndex, currentTileIndex); // Supprime la lettre actuelle
        }
    } else if (keyCode === 13) { // si la touche est "Enter"
        let word="";
        for (let i = 0; i < maxTile; i++) {
            const letter = gameEl.children[currentRowIndex].children[i].textContent;
            word += letter;
        }
        console.log("Votre mot: "+word);
        // Comparer chaque lettre du mot avec les lettres du mot cible
        for (let i = 0; i < maxTile; i++) {
            const letter = word[i];
            const targetLetter = targetWord[i];
            const tile = gameEl.children[currentRowIndex].children[i];

            // Supprimer les classes existantes
            tile.classList.remove("absent", "correct", "present");

            // Ajouter la classe appropriée en fonction du résultat de la comparaison
            if (letter === targetLetter) {
                tile.classList.add("correct");
                console.log("La lettre " + letter + " est correctement placée"); //test console
            } else if (targetWord.includes(letter)) {
                tile.classList.add("present");
                console.log("La lettre " + letter + " est présente dans le mot cible"); //test console
            } else {
                tile.classList.add("absent");
                console.log("La lettre " + letter + " n'est pas dans le mot cible"); // test console
            }
        }
    }
}



// Ajout d'un gestionnaire d’événement pour l’événement keyup. 
document.addEventListener('keyup', keyUpHandler);





// expliquations supplementaires prof: 

// quand on clique sur Enter il doit verifier si c'est enter
// quand on clique sur Backspace pour effacer on doit verifier si c'est backspace dans la console (le code qu'il envoies)
