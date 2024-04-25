"use strict";

/**
 * @type {String[]}
 */
let dict = [];

/**
 * @param {number} length entre 6 et 10
 * @param {string} firstLetter entre A et Z
 */
async function _getDict(length, firstLetter = null) {
    const project = "https://git.esi-bru.be/api/v4/projects/51440";
    const file = firstLetter ? `${length}.${firstLetter}` : `${length}`;
    return fetch(`${project}/repository/files/${file}/raw`)
        .then((r) => {
            if (!r.ok) {
                throw Error(`Code d'erreur du serveur ${r.status}`);
            }
            return r.text();
        })
        .then((r) => r.split("\n"))
        .catch((error) => console.error("Erreur pour récupérer le dictionnaire."));
}

_getDict(6).then((result) => {
    dict = result;
});
