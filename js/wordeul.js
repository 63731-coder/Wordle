"use strict";   // activer le mode strict

const gameEl = document.getElementById('game'); // l’élément du DOM dont l’identifiant est game.

// variables globales
let currentRowIndex = 0;
let currentTileIndex = 0;
const maxRow = 5;
const maxTile = 5;
const targetWord = "rebel";

/**
 * Fonction pour remplacer la lettre X par la lettre spécifiée à position spécifiée.
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la tuile dans la ligne.
 * @param {string} letter - La lettre à placer.
 */
function setLetter(rowNumber, tileNumber, letter) {
    const row = gameEl.children[rowNumber]; // trouver la ligne spécifiée (indices de 0 à 4)
    const tile = row.children[tileNumber]; // trouver la colonne spécifiée dans la ligne (indices de 0 à 4)
    tile.textContent = letter;  // modifier le contenu de la tuile pour y mettre la lettre spécifiée
}

/**
 * Fonction pour effacer les lettres.
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la tuile dans la ligne.
 */
function removeLetter(rowNumber, tileNumber) {
    const row = gameEl.children[rowNumber]; // trouver la ligne spécifiée (indices de 0 à 4)
    const tile = row.children[tileNumber]; // trouver la colonne spécifiée dans la ligne (indices de 0 à 4)
    tile.textContent = "X"; // modifier le contenu pour effacer la lettre 
}

/**
 * Gestionnaire de l'événement keyup.
 */
function keyUpHandler(event) {
    const keyCode = event.keyCode;
    const key = event.key;

    if (keyCode >= 65 && keyCode <= 90) {
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
    } else if (keyCode === 8) {
        if (currentTileIndex > 0) {
            currentTileIndex--;
            removeLetter(currentRowIndex, currentTileIndex);
        } else if (currentRowIndex > 0) {
            currentRowIndex--;
            currentTileIndex = maxTile - 1;
            removeLetter(currentRowIndex, currentTileIndex);
        }
    } else if (keyCode === 13) {
        checkWord(currentRowIndex, currentTileIndex);
    }
}

/**
 * Fonction pour valider le mot entré
 */
function checkWord(currentRowIndex, currentTileIndex) {
    let word = ""; // Le mot entré par l'utilisateur
    let correctLetters = []; // Les lettres correctement placées
    let misplacedLetters = []; // Les lettres mal placées

    // Construction du mot entré par l'utilisateur
    for (let i = 0; i < maxTile; i++) {
        const letter = gameEl.children[currentRowIndex].children[i].textContent;
        word += letter;
    }

    // Parcours du mot entré pour colorier chaque lettre selon les critères
    for (let i = 0; i < maxTile; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];

        tile.classList.remove("absent", "correct", "present");

        // Vérification si la lettre est correctement placée
        if (letter === targetWord[i]) {
            tile.classList.add("correct");
            correctLetters += letter; // Ajout de la lettre aux lettres correctement placées
        }
        // Vérification si la lettre est présente mais mal placée
        else if (targetWord.includes(letter) && targetWord.indexOf(letter) !== i && !misplacedLetters.includes(letter)) {
            tile.classList.add("present");
            misplacedLetters += letter; // Ajout de la lettre aux lettres mal placées
        }
        // Vérification si la lettre est présente et bien placée
        else if (targetWord.includes(letter) && targetWord.indexOf(letter) === i) {
            tile.classList.add("correct");
        }
        // La lettre est absente du mot cible
        else {
            tile.classList.add("absent");
        }
    }
}


// Ajout d'un gestionnaire d’événement pour l’événement keyup. 
document.addEventListener('keyup', keyUpHandler);