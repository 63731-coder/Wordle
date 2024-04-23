"use strict";

// variables globales
const gameEl = document.getElementById("game");
let currentRowIndex = 0;
let currentTileIndex = 0;
let targetWord; //initialiser targetWord - le mettre a jour avec la valeur reécuperé dans le formulaire
let gameEnded = false; // variable pour suivre si le jeu est terminé
let maxTile = 1;
let maxRow = 1; // nb de tentatives

function initGame() {
    gameEl.style.visibility = "visible";
    document.getElementById("rules").style.display = "none";
    createGrid();
}

/**
 * Fonction pour créer la grille
 */
function createGrid() {
    maxTile = targetWord.length;
    for (let i = 0; i < maxRow; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < maxTile; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        gameEl.appendChild(row);
    }
    adjustBorder();
}

/**
 * Fonction pour ajouster la taille de la bordure en fonction de la grille de jeu
 */
function adjustBorder() {
    const borderWidth = 52;
    const borderHeight = 52;
    const totalWidth = maxTile * borderWidth + 3 * (maxTile - 1);
    const totalHeight = maxRow * borderHeight + 5 * (maxRow - 1);
    gameEl.style.width = `${totalWidth}px`;
    gameEl.style.height = `${totalHeight}px`;
}

document.getElementById("config").addEventListener("submit", (e) => {
    e.preventDefault();
    // @ts-ignore
    const formData = new FormData(e.target);
    targetWord = String(formData.get("mot")).toUpperCase();
    console.log(targetWord);
    maxRow = Number(formData.get("tentatives"));
    console.log(maxRow);
    if (!(e.target instanceof HTMLFormElement)) {
        throw Error("Unexpected");
    } else {
        initGame();
    }
});

/**
 * Fonction pour remplacer la lettre X par la lettre spécifiée à position spécifiée.
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
    tile.textContent = "";
}

/** Gestionnaire de l'événement keyup.
 * @param {{keyCode: number, key: String}} event
 */
function keyUpHandler(event) {
    const keyCode = event.keyCode;
    const key = event.key;

    if (keyCode >= 65 && keyCode <= 90) {
        handleLetterKey(key);
    } else if (keyCode === 8) {
        handleBackspaceKey();
    } else if (keyCode === 13 && currentTileIndex === maxTile) {
        getWord();
    }
}

/**
 * Fonction pour gerer la touches touches alphabethiques (A-Z)
 * @param {String} key
 */
function handleLetterKey(key) {
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
}

/**
 * Fonction pour gérer la touche Backspace
 */
function handleBackspaceKey() {
    if (currentTileIndex === maxTile && currentRowIndex < maxRow) {
        return;
    }
    if (currentTileIndex > 0) {
        currentTileIndex--;
        removeLetter(currentRowIndex, currentTileIndex);
    } else if (currentRowIndex > 0) {
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
    // Construction du mot entré par l'utilisateur
    for (let i = 0; i < maxTile; i++) {
        const letter = gameEl.children[currentRowIndex].children[i].textContent;
        word += letter;
    }
    console.log(`Votre mot: ${word}`);
    colorLetter(word);
}

/**
 * Fonction qui va colorier la lettre en fonction de sa position dans le mot
 * @param {String} word - Mot entrée par l'utilisateur
 */
function colorLetter(word) {
    const correctLetters = [];
    const misplacedLetters = [];

    // Parcours du mot entré pour colorier chaque lettre selon les critères
    for (let i = 0; i < maxTile; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];

        tile.classList.remove("absent", "correct", "present");

        // Vérification si la lettre est correctement placée
        if (letter === targetWord[i]) {
            tile.classList.add("correct");
            correctLetters.push(letter); // Ajout de la lettre aux lettres correctement placées
            console.log(`La lettre ${letter} est bien placée !`);
        } else if (targetWord.includes(letter) && targetWord.indexOf(letter) !== i && !misplacedLetters.includes(letter)) {
            tile.classList.add("present");
            misplacedLetters.push(letter);
            console.log(`La lettre ${letter} est presente dans le mot cible mais mal placée !`);
        } else {
            tile.classList.add("absent");
            console.log(`La lettre ${letter} n'est pas dans le mot cible !`);
        }
    }
    checkWin(word); // Aprés avoir colorié le mot, on vérifie si on a gagné
}

/**
 * Fonction qui affiche les modales
 * @param {String} word - Le mot entré par l'utilisateur
 */
function checkWin(word) {
    if (word === targetWord) {
        document.getElementById("win").style.visibility = "visible";
        endGame();
    } else if (currentRowIndex === maxRow - 1) {
        document.getElementById("target").textContent = targetWord;
        document.getElementById("lose").style.visibility = "visible";
        endGame();
    }
}

/**
 * Lorsqu'on clique en dehors de la modale, la modale se ferme.
 * @param {Event} event
 */
function handleBackdropClick(event) {
    if (event.target === event.currentTarget) { // Vérifie si l'événement (le click) provient du backdrop
        document.getElementById("win").style.visibility = "hidden";
        document.getElementById("lose").style.visibility = "hidden";
    }
}

/**
 * Fonction pour gérer le jeu lorsque le mot cible est deviné.
 */
function endGame() {
    gameEnded = true;
    document.removeEventListener("keyup", keyUpHandler); // desactiver les touches clavier
}

// Ajout d'un gestionnaire d’événement pour l’événement keyup.
document.querySelector("#win").addEventListener("click", handleBackdropClick);
document.querySelector("#lose").addEventListener("click", handleBackdropClick);
document.addEventListener("keyup", keyUpHandler);
