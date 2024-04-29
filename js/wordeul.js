"use strict";

// variables globales
const gameEl = document.getElementById("game");
const keyB = document.getElementById("keyboard");
let currentRowIndex = 0;
let currentTileIndex = 0;
let gameEnded = false;
let wordValidated = false;
let kybEvent = undefined;

const keyboard = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["Enter", "W", "X", "C", "V", "B", "N", "Backspace"],
];

/**
 * Fonction pour cacher la configuration du jeu et afficher la grille
 * @param {string} targetWord - Mot secret
 * @param {number} maxRow - Nombre de tentatives
 */
function initGame(targetWord, maxRow) {
    gameEl.style.visibility = "visible";
    document.getElementById("rules").style.display = "none";
    createGrid(targetWord, maxRow);
    generateVirtualKeyboard();
}

/**
 * Fonction pour créer la grille
 * @param {string} targetWord - Mot secret
 * @param {number} maxRow - Nombre de tentatives
 */
function createGrid(targetWord, maxRow) {
    const maxTile = targetWord.length;
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
    adjustBorder(maxRow, maxTile);
}

/**
 * Fonction pour ajouster la taille de la bordure en fonction de la grille de jeu
 * @param {number} maxRow - Nombre de tentatives
 * @param {number} maxTile - Nombre de colonnes
 */
function adjustBorder(maxRow, maxTile) {
    const borderWidth = 52;
    const borderHeight = 52;
    const totalWidth = maxTile * borderWidth + 3 * (maxTile - 1);
    const totalHeight = maxRow * borderHeight + 5 * (maxRow - 1);
    gameEl.style.width = `${totalWidth}px`;
    gameEl.style.height = `${totalHeight}px`;
}

/**
 * Fonction qui génere le clavier virtuel
 */
function generateVirtualKeyboard() {
    keyB.classList.add("virtual-keyboard");

    for (let i = 0; i < keyboard.length; i++) {
        const keyRow = keyboard[i];
        const rowElement = document.createElement("div");
        rowElement.classList.add("keyboard-row");

        for (let j = 0; j < keyRow.length; j++) {
            const key = keyRow[j];
            const keyElement = document.createElement("button");
            keyElement.textContent = key;
            keyElement.classList.add("keyboard-key");
            if (key === "Enter" || key === "Backspace") {
                keyElement.classList.add("special-key");
            }
            rowElement.appendChild(keyElement);
        }
        keyB.appendChild(rowElement);
    }
}

/**
 * Fonction qui ajoute un gestionnaire d'événements click pour chaque touche du clavier
 * @param {number} maxRow - Nombre de tentatives
 * @param {number} maxTile - Nombre de colonnes
 * @param {string} targetWord - Mot secret
 */
// @ts-ignore
function addKeyboardEventListeners(maxRow, maxTile, targetWord) {
    const keys = document.querySelectorAll(".keyboard-key");
    keys.forEach((key) => {
        key.addEventListener("click", () => {
            document.dispatchEvent(new KeyboardEvent("keyup", {"key": key.textContent}));
        });
    });
}

/**
 * Fonction qui vérifie si une touche est une lettre de l'alphabet
 * @param {string} key - touche à vérifier
 * @returns true si la touche est une lettre de l'alphabet
 */
function isAlphabet(key) {
    return /^[A-Za-z]$/.test(key);
}

/**
 * Fonction pour remplacer la lettre X par la lettre spécifiée à position spécifiée.
 * @param {number} rowNumber - Le numéro de la ligne.
 * @param {number} tileNumber - Le numéro de la colonne de la ligne.
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
 * @param {number} tileNumber - Le numéro de la colonne de la ligne.
 */
function removeLetter(rowNumber, tileNumber) {
    const row = gameEl.children[rowNumber];
    const tile = row.children[tileNumber];
    tile.textContent = "";
}

/**
 * Gestionnaire de l'événement keyup.
 * @param {number} maxRow - Nombre de tentatives
 * @param {number} maxTile - Nombre de colonnes
 * @param {string} targetWord - Nombre de colonnes
*/
function keyUpHandler(maxRow, maxTile, targetWord) {
    return (/** @type {{ key: string; }} */ e) => {
        const key = e.key;
        if (isAlphabet(key)) {
            handleLetterKey(key, maxRow, maxTile);
        } else if (key === "Backspace") {
            handleBackspaceKey(maxTile);
        } else if (key === "Enter" && currentTileIndex === maxTile) {
            getWord(targetWord, maxTile, maxRow);
        }
    };
}

/**
 * Fonction pour gerer la touches touches alphabethiques (A-Z)
 * @param {string} key - Touche clavier
 * @param {number} maxRow - Nombre de tentatives
 * @param {number} maxTile - Nombre de colonnes
 */
function handleLetterKey(key, maxRow, maxTile) {
    if (currentRowIndex < maxRow && currentTileIndex < maxTile) {
        setLetter(currentRowIndex, currentTileIndex, key);
        currentTileIndex++;
    } else if (currentRowIndex < maxRow && wordValidated) {
        currentRowIndex++;
        currentTileIndex = 0;
        setLetter(currentRowIndex, currentTileIndex, key);
        currentTileIndex++;
        wordValidated = false;
    }
}

/**
 * Fonction pour gérer la touche Backspace
 * @param {number} maxTile - Nombre de colonnes
 */
function handleBackspaceKey(maxTile) {
    if (wordValidated) { // Vérifier si on a appuié sur enter et le mot été valide
        return;
    }
    wordValidated = false;
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
 * @param {string} targetWord - Nombre de tentatives
 * @param {number} maxRow - Nombre de lignes
 * @param {number} maxTile - Nombre de colonnes
 */
function getWord(targetWord, maxTile, maxRow) {
    let word = "";
    const places = {}; // dictionnaire pour stocker les lettre du targetWord
    for (let i = 0; i < maxTile; i++) {
        const letter = gameEl.children[currentRowIndex].children[i].textContent;
        word += letter;
    }
    for (let i = 0; i < targetWord.length; i++) {
        const letter = targetWord[i];
        if (places[letter]) {
            places[letter]++;
        } else {
            places[letter] = 1;
        }
    }
    console.log(`Votre mot: ${word}`);
    if (!dict.includes(word)) { // verifier si le mot n'est pas dans le dictionnaire
        wordValidated = false;
        console.log(`Mot non trouvé dans le dictionnaire: ${word}`);
        gameEl.classList.add("shake"); // animer le jeu
        gameEl.addEventListener("animationend", () => {
            gameEl.classList.remove("shake");
        });
    } else {
        wordValidated = true;
        colorWellPlaced(places, word, targetWord);
        colorBadlyPlaced(places, word, maxTile, targetWord);
        checkWin(word, targetWord, maxRow, maxTile);
    }
}

/**
 * Fonction qui colorie les lettres qui sont bien placées.
 * @param {string} word - Mot entrée par l'utilisateur
 * @param {object} places - Dictionnaire qui contient les lettres du targetWord
 * @param {string} targetWord - Mot secret
 */
function colorWellPlaced(places, word, targetWord) {
    const keys = keyB.querySelectorAll(".keyboard-key");
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];
        if (word[i] === targetWord[i]) {
            tile.classList.add("correct");
            console.log(`La lettre ${letter} est bien placée !`);
            if (places[letter] && places[letter] > 0) {
                places[letter]--;
            }
            keys.forEach((key) => {
                if (key.textContent === letter) {
                    key.classList.remove("present", "absent");
                    key.classList.add("correct");
                }
            });
        }
    }
}

/**
 * Fonction qui va colorier la lettre en fonction de sa position dans le mot
 * @param {string} word - Mot entrée par l'utilisateur
 * @param {object} places - Dictionnaire qui contient les lettres du targetWord
 * @param {number} maxTile - Le nombre de colonnes
 * @param {string} targetWord - Mot secret
 */
function colorBadlyPlaced(places, word, maxTile, targetWord) {
    const keys = keyB.querySelectorAll(".keyboard-key");
    for (let i = 0; i < maxTile; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];
        if (word[i] !== targetWord[i]) {
            if (targetWord.includes(letter) && places[letter] > 0) {
                tile.classList.add("present");
                console.log(`La lettre ${letter} est presente dans le mot cible mais mal placée !`);
                places[letter]--;
                keys.forEach((key) => {
                    if (key.textContent === letter && key.classList.length < 2) {
                        key.classList.add("present");
                    }
                });
            } else {
                tile.classList.add("absent");
                console.log(`La lettre ${letter} n'est pas dans le mot cible !`);
                keys.forEach((key) => {
                    if (key.textContent === letter && key.classList.length < 2) {
                        key.classList.add("absent");
                    }
                });
            }
        }
    }
}

/**
 * Fonction qui affiche les modales
 * @param {string} word - Le mot entré par l'utilisateur
 * @param {string} targetWord - Mot secret
 * @param {number} maxRow - Nombre de tentatives
 * @param {number} maxTile - Nombre de colonnes
 */
function checkWin(word, targetWord, maxRow, maxTile) {
    if (word === targetWord) {
        document.getElementById("win").style.visibility = "visible";
        endGame(maxRow, maxTile, targetWord);
    } else if (currentRowIndex === maxRow - 1) {
        document.getElementById("target").textContent = targetWord;
        document.getElementById("lose").style.visibility = "visible";
        endGame(maxRow, maxTile, targetWord);
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
 * @param {string} targetWord - Mot secret
 * @param {number} maxRow - Nombre de tentatives
 * @param {number} maxTile - Nombre de colonnes
 */
// @ts-ignore
function endGame(maxRow, maxTile, targetWord) {
    gameEnded = true;
    document.removeEventListener("keyup", kybEvent); // desactiver les touches clavier
}

// Gestinonaire de l'evenement du button Go et Random
document.getElementById("config").addEventListener("submit", (e) => {
    e.preventDefault();
    // @ts-ignore
    const formData = new FormData(e.target);
    let targetWord = String(formData.get("mot")).toUpperCase();
    const maxRow = Number(formData.get("tentatives"));

    if (!dict) {
        throw Error("Dictionnaire non chargé.");
    }

    if (!dict.includes(targetWord)) { // verifier si le mot est dans le dictionnaire
        console.log(`targetWord non trouvé dans le dictionnaire: ${targetWord}`);
        // @ts-ignore
        document.getElementById("mot").value = "";
        document.querySelector(".mot-container").classList.add("shake"); // animer le jeu
        document.querySelector(".mot-container").addEventListener("animationend", () => {
            document.querySelector(".mot-container").classList.remove("shake");
        });
        return;
    }

    if (targetWord === "") { // si on a appuié sur le button Random
        const randomIndex = Math.floor(Math.random() * dict.length);
        targetWord = dict[randomIndex];
    }

    if (!(e.target instanceof HTMLFormElement)) {
        throw Error("Unexpected");
    } else if (maxRow === null || maxRow === 0) { // si on a oublié de donner le nb de tentatives
        document.querySelector(".tentatives-container").classList.add("shake"); // animer le jeu
        document.querySelector(".tentatives-container").addEventListener("animationend", () => {
            document.querySelector(".tentatives-container").classList.remove("shake");
        });
    } else {
        initGame(targetWord, maxRow);
        document.getElementById("keyboard").style.visibility = "visible";
        document.querySelector(".add").classList.add("add-right");
    }
    const maxTile = targetWord.length;
    // Gestionaires d'evenements
    addKeyboardEventListeners(maxRow, maxTile, targetWord);
    document.querySelector("#win").addEventListener("click", handleBackdropClick);
    document.querySelector("#lose").addEventListener("click", handleBackdropClick);
    kybEvent = keyUpHandler(maxRow, maxTile, targetWord);
    document.addEventListener("keyup", kybEvent);
});
