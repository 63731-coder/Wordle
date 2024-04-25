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

// todo: changer les .style et mettre des classes.

/**
 * Fonction pour cacher la configuration du jeu et afficher la grille
 * @param {String} targetWord
 * @param {number} maxRow - Nombre de tentatives
 */
function initGame(targetWord, maxRow) {
    gameEl.style.visibility = "visible";
    document.getElementById("rules").style.display = "none";
    createGrid(targetWord, maxRow);
}

/**
 * Fonction pour créer la grille
 * @param {String} targetWord
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
generateVirtualKeyboard();

/**
 * Fonction qui ajoute un gestionnaire d'événements click pour chaque touche du clavier
 * @param {number} maxRow - Nombre de lignes
 * @param {number} maxTile - Nombre de colonnes
 * @param {string} targetWord - Mot cible
 */
function addKeyboardEventListeners(maxRow, maxTile, targetWord) {
    const keys = document.querySelectorAll(".keyboard-key");
    keys.forEach((key) => {
        key.addEventListener("click", () => {
            document.dispatchEvent(new KeyboardEvent("keyup", {"key": key.textContent}));
            // const keyTest = key.textContent; // Récupérer le texte de la touche
            // const event = {key: keyTest}; // Créer un objet avec la propriété 'key'
            // keyUpHandler(maxRow, maxTile, targetWord); // Passer l'objet event à keyUpHandlerµ
        });
    });
}

function isAlphabet(key) {
    // Vérifie si la touche est une lettre majuscule (A-Z) ou minuscule (a-z)
    return /^[A-Za-z]$/.test(key);
}

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

/**
 * Gestionnaire de l'événement keyup.
 * @param {number} maxRow - Nombre de colonnes
 * @param {number} maxTile - Nombre de colonnes
 * @param {String} targetWord - Nombre de colonnes
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
 * @param {String} key
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
 * @param {String} targetWord - Nombre de tentatives
 * @param {number} maxRow - Nombre de lignes
 * @param {number} maxTile - Nombre de colonnes
 */
function getWord(targetWord, maxTile, maxRow) {
    let word = "";
    // Construction du mot entré par l'utilisateur
    for (let i = 0; i < maxTile; i++) {
        const letter = gameEl.children[currentRowIndex].children[i].textContent;
        word += letter;
    }
    console.log(`Votre mot: ${word}`);
    if (!dict.includes(word)) { // verifier si le mot est dans le dictionnaire
        wordValidated = false;
        console.log(`Mot non trouvé dans le dictionnaire: ${word}`);
        gameEl.classList.add("shake"); // animer le jeu
        gameEl.addEventListener("animationend", () => {
            gameEl.classList.remove("shake");
        });
    } else {
        wordValidated = true;
        updateKeyboardColors(word);
        colorLetter(word, targetWord, maxRow, maxTile);
    }
}

/**
 * Fonction qui met les couleurs au clavier
 * @param {String} word - Mot entré par l'utilisateur
 */
function updateKeyboardColors(word) {
    // todo : comparer mot avec targetword
    for (let x = 0; x < word.length; x++) {
        const rows = keyB.querySelectorAll(".keyboard-row");
        for (let i = 0; i < rows.length; i++) {
            const keys = rows[i].querySelectorAll(".keyboard-key");
            for (let j = 0; j < keys.length; j++) {
                if (keys[j].textContent === word[x]) {
                    console.log("the letter is present");
                    keys[j].classList.add("correct");
                    console.log(keys[j]);
                }
            }
        }
    }
    /*rows.forEach((r) => {
        console.log(r);
    });*/
}

/**
 * Fonction qui va colorier la lettre en fonction de sa position dans le mot
 * @param {String} word - Mot entrée par l'utilisateur
 * @param {String} targetWord - Mot cible
 * @param {number} maxRow - Nombre de colonnes
 * @param {number} maxTile - Nombre de colonnes
 */
function colorLetter(word, targetWord, maxRow, maxTile) {
    const correctLetters = [];
    const misplacedLetters = [];

    // Parcours du mot entré pour colorier chaque lettre selon les critères
    for (let i = 0; i < maxTile; i++) {
        const letter = word[i];
        const tile = gameEl.children[currentRowIndex].children[i];

        tile.classList.remove("absent", "correct", "present");

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
    checkWin(word, targetWord, maxRow, maxTile); // Aprés avoir colorié le mot, on vérifie si on a gagné
}

/**
 * Fonction qui affiche les modales
 * @param {String} word - Le mot entré par l'utilisateur
 * @param {String} targetWord
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
 * @param {String} targetWord
 * @param {number} maxRow - Nombre de lignes
 * @param {number} maxTile - Nombre de tentatives
 */
function endGame(maxRow, maxTile, targetWord) {
    gameEnded = true;
    document.removeEventListener("keyup", kybEvent); // desactiver les touches clavier
}

// Gestinonaire de l'evenement du button Go et Random
document.getElementById("config").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let targetWord = String(formData.get("mot")).toUpperCase();
    console.log(targetWord);
    let maxRow = Number(formData.get("tentatives"));
    console.log(maxRow);

    if (!dict) {
        throw Error("Dictionnaire non chargé.");
    }

    if (!dict.includes(targetWord)) { // verifier si le mot est dans le dictionnaire
        console.log(`targetWord non trouvé dans le dictionnaire: ${targetWord}`);
        document.getElementById("rules").classList.add("shake"); // animer le jeu
        document.getElementById("rules").addEventListener("animationend", () => {
            document.getElementById("rules").classList.remove("shake");
        });
        return;
    }

    if (targetWord === "") { // si on a appuié sur le button Random
        const randomIndex = Math.floor(Math.random() * dict.length); // Générer un index aléatoire
        targetWord = dict[randomIndex]; // Retourner le mot correspondant à l'index aléatoire
        console.log(targetWord);
        maxRow = 5;
    }

    if (!(e.target instanceof HTMLFormElement)) {
        throw Error("Unexpected");
    } else {
        initGame(targetWord, maxRow);
        document.getElementById("keyboard").style.visibility = "visible";
        document.querySelector(".add").classList.add("add-right");
    }
    const maxTile = targetWord.length;
    // Ajout d'un gestionnaire d’événement
    addKeyboardEventListeners(maxRow, maxTile, targetWord);
    document.querySelector("#win").addEventListener("click", handleBackdropClick);
    document.querySelector("#lose").addEventListener("click", handleBackdropClick);
    kybEvent = keyUpHandler(maxRow, maxTile, targetWord);
    document.addEventListener("keyup", kybEvent);
});
