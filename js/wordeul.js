"use strict";   // activer le mode strict
const gameEl = document.getElementById('game'); // l’élément du DOM dont l’identifiant est game.


// variables globales
let currentRowIndex = 0;
let currentTileIndex = 0;
const maxRow = 5;
const maxTile = 5;
const targetWord = "REBEL";


/**
 * Fonction pour remplacer la lettre X par la lettre spécifiée à position spécifiée.
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la tuile dans la ligne.
 * @param {string} letter - La lettre à placer.
 */
function setLetter(rowNumber, tileNumber, letter) {
    const row = gameEl.children[rowNumber]; // Trouver la ligne spécifiée 
    const tile = row.children[tileNumber]; // Trouver la colonne spécifiée
    tile.textContent = letter.toUpperCase();  // Ajouter la lettre
}


/**
 * Fonction pour effacer les lettres.
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la tuile dans la ligne.
 */
function removeLetter(rowNumber, tileNumber) {
    const row = gameEl.children[rowNumber]; // trouver la ligne spécifiée 
    const tile = row.children[tileNumber]; // Trouver la colonne spécifiée 
    tile.textContent = "X"; // Effacer la lettre 
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
            // je dois mettre ca pour mettre les lettres une apres l'autre
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
    } else if (keyCode === 13 && currentTileIndex == maxTile) {
        getWord(currentRowIndex);
    }
}


/**
 * Fonction qui recupère le mot entrée sur une ligne 
 * @param {*} currentRowIndex - La ligne courante 
 */
function getWord(currentRowIndex) {
    let cmpt_words = 0; // compter combiens des mots sont entrées (max 5)
    let word = ""; // Le mot entré par l'utilisateur
    // Construction du mot entré par l'utilisateur
    for (let i = 0; i < maxTile; i++) {
        const letter = gameEl.children[currentRowIndex].children[i].textContent;
        word += letter;
    }
    console.log("Votre mot: "+word);
    colorLetter(word, currentRowIndex);
}


/**
 * Fonction qui va colorier la lettre en fonction de sa position dans le mot
 * @param {*} word - Mot entrée par l'utilisateur
 * @param {*} currentRowIndex - La ligne courante
 */
function colorLetter(word, currentRowIndex) {
    let correctLetters = []; // Les lettres correctement placées
    let misplacedLetters = []; // Les lettres mal placées

    // Parcours du mot entré pour colorier chaque lettre selon les critères
    for (let i = 0; i < maxTile; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];

        tile.classList.remove("absent", "correct", "present");

        // Vérification si la lettre est correctement placée
        if (letter === targetWord[i]) {
            tile.classList.add("correct");
            correctLetters += letter; // Ajout de la lettre aux lettres correctement placées
            console.log(`La lettre ${letter} est bien placée !`)
        }
        // Vérification si la lettre est présente mais mal placée
        else if (targetWord.includes(letter) && targetWord.indexOf(letter) !== i && !misplacedLetters.includes(letter)) {
            tile.classList.add("present");
            misplacedLetters += letter; // Ajout de la lettre aux lettres mal placées
            console.log(`La lettre ${letter} est presente dans le mot cible mais mal placée !`)
        }
        // La lettre est absente du mot cible
        else {
            tile.classList.add("absent");
            console.log(`La lettre ${letter} n'est pas dans le mot cible !`)
        }
    }
    checkWin(word, currentRowIndex); // Aprés avoir colorié le mot, on vérifie si on a gagné
}

/**
 * Fonction qui affiche les modales en fonction.
 * @param {*} word - Le mot entré par l'utilisateur
 * @param {*} currentRowIndex - La ligne courante
 */
function checkWin(word, currentRowIndex) {
    if (word === targetWord) {
        document.getElementById("win").style.visibility = 'visible';
    } else if (currentRowIndex == 4) {
        document.getElementById("target").textContent = targetWord; 
        document.getElementById("lose").style.visibility = 'visible';
    }
}


/**
 * Lorsque on clique en dehors de la modale, la modale se ferme.
 */
function handleBackdropClick(event) {
    if (event.target === event.currentTarget) { // Vérifie si l'événement (le click) provient du backdrop 
        document.getElementById("win").style.visibility = 'hidden';
        document.getElementById("lose").style.visibility = 'hidden';
    }
}
document.querySelector("#win").addEventListener('click', handleBackdropClick);
document.querySelector("#lose").addEventListener('click', handleBackdropClick);


// Ajout d'un gestionnaire d’événement pour l’événement keyup. 
document.addEventListener('keyup', keyUpHandler);