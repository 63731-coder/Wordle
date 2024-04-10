"use strict";   // activer le mode strict

const gameEl = document.getElementById('game'); // l’élément du DOM dont l’identifiant est game.
console.log(gameEl) // verification 


function setLetter(nombre_row, nombre_tile, letter) {
    // modifie la lettre à position spécifiée

    // trouver la ligne spécifiée (indices de 0 à 5)
    const row = gameEl.children[nombre_row - 1]; 

    // trouver la tuile spécifiée dans la ligne (indices de 0 à 5)
    const tile = row.children[nombre_tile - 1]; 

    // modifier le contenu de la tuile pour y mettre la lettre spécifiée
    tile.textContent = letter;
}

// setLetter(1, 4, 'U');      -->  test reussi dans la console




function isAlphabetLetter(key) {
    // verifier si letter c'est une lettre de l'aphabet
    return /^[a-zA-Z]$/.test(key);
}

function keyUpHandler(event) {
    // Récupérer la touche pressée
    const key = event.key;

    // Vérifier si la touche est une lettre de l'alphabet
    if (isAlphabetLetter(key)) {
        // Insérer la touche pressée dans la grille en position (0, 0)
        setLetter(1, 1, key);
    }
}

// Ajouter un écouteur d'événement keyup à la fenêtre --> pas demandé dans l'enoncé
gameEl.addEventListener('keyup', keyUpHandler);