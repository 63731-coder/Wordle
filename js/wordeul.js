"use strict";

// variables globales
const gameEl = document.getElementById("game");
let currentRowIndex = 0;
let currentTileIndex = 0;
const maxRow = 5;
const maxTile = 5;
const targetWord = "REBEL";

/**
 * Fonction pour placer les lettres
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la tuile dans la ligne.
 * @param {string} letter - La lettre à placer.
 */
function setLetter(rowNumber, tileNumber, letter) {
    const row = gameEl.children[rowNumber];
    const tile = row.children[tileNumber];
    tile.textContent = letter.toUpperCase();
}

/**
 * Fonction pour effacer les lettres.
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la tuile dans la ligne.
 */
function removeLetter(rowNumber, tileNumber) {
    const row = gameEl.children[rowNumber];
    const tile = row.children[tileNumber];
    tile.textContent = "X";
}

/**
 * Fonction qui vérifie si une touche est une lettre de l'alphabet
 * @param {String} key - touche à vérifier
 * @returns true si la touche est une lettre de l'alphabet
 */
function isAlphabet(key) {
    return /^[A-Za-z]$/.test(key);
}

/**
 * Gestionnaire de l'événement keyup.
 */
function keyUpHandler(event) {
    const key = event.key;
    if (isAlphabet(key)) {
        handleLetterKey(key);
    } else if (key === "Backspace") {
        handleBackspaceKey();
    } else if (key === "Enter" && currentTileIndex === maxTile) {
        getWord();
    }
}

/**
 * Fonction qui gère les touches alphabetiques
 * @param {String} key - touche clavier
 */
function handleLetterKey(key) {
    if (currentRowIndex < maxRow && currentTileIndex < maxTile) {
        setLetter(currentRowIndex, currentTileIndex, key);
        currentTileIndex++;
    } else if (currentRowIndex < maxRow) {
        currentRowIndex++;
        currentTileIndex = 0;
        setLetter(currentRowIndex, currentTileIndex, key);
        currentTileIndex++;
    }
}

/**
 * Fonction pour gérer la touche Backspace
 */
function handleBackspaceKey() {
    if (currentTileIndex > 0) {
        currentTileIndex--;
        removeLetter(currentRowIndex, currentTileIndex);
    } else if (currentRowIndex > 0 && currentTileIndex > 1) {
        currentRowIndex--;
        currentTileIndex = maxTile - 1;
        removeLetter(currentRowIndex, currentTileIndex);
    }
}

/**
 * Fonction qui recupère le mot entrée sur une ligne
 */
function getWord() {
    let word = "";
    for (let i = 0; i < maxTile; i++) {
        const letter = gameEl.children[currentRowIndex].children[i].textContent;
        word += letter;
    }
    console.log(`Votre mot: ${word}`);
    const places = {};
    for (let i = 0; i < targetWord.length; i++) {
        const letter = targetWord[i];
        if (places[letter]) {
            places[letter]++;
        } else {
            places[letter] = 1;
        }
    }
    colorWellPlaced(places, word);
    colorBadlyPlaced(places, word);
}

/**
 * Fonction qui va colorier la lettre en fonction de sa position dans le mot
 * @param {string} word - Mot entrée par l'utilisateur
 * @param {object} places - Contient les lettres du targetWord
 */
function colorBadlyPlaced(places, word) {
    for (let i = 0; i < maxTile; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];

        if (word[i] === targetWord[i]) {
            continue;
        }
        if (targetWord.includes(letter) && places[letter] > 0) {
            tile.classList.add("present");
            console.log(`La lettre ${letter} est presente dans le mot cible mais mal placée !`);
            places[letter]--;
        } else {
            tile.classList.add("absent");
            console.log(`La lettre ${letter} n'est pas dans le mot cible !`);
        }
    }
    checkWin(word);
}

/**
 * Fonction qui colorie les lettres qui sont bien placées.
 * @param {string} word - Mot entrée par l'utilisateur
 * @param {object} places - Contient les lettres du targetWord
 */
function colorWellPlaced(places, word) {
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];
        if (word[i] === targetWord[i]) {
            tile.classList.add("correct");
            console.log(`La lettre ${letter} est bien placée !`);
            if (places[letter] && places[letter] > 0) {
                places[letter]--;
            }
        }
    }
}

/**
 * Fonction qui affiche les modales et termine le jeu
 * @param {string} word - Le mot entré par l'utilisateur
 */
function checkWin(word) {
    if (word === targetWord) {
        document.getElementById("win").style.visibility = "visible";
        document.removeEventListener("keyup", keyUpHandler);
    } else if (currentRowIndex === 4) {
        document.getElementById("target").textContent = targetWord;
        document.getElementById("lose").style.visibility = "visible";
        document.removeEventListener("keyup", keyUpHandler);
    }
}

/**
 * Lorsque on clique en dehors de la modale, la modale se ferme.
 */
function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
        document.getElementById("win").style.visibility = "hidden";
        document.getElementById("lose").style.visibility = "hidden";
    }
}

// Gestionaire d'evenements
document.querySelector("#win").addEventListener("click", handleBackdropClick);
document.querySelector("#lose").addEventListener("click", handleBackdropClick);
document.addEventListener("keyup", keyUpHandler);
