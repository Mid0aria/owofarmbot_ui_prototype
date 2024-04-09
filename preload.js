const { ipcRenderer } = require("electron");
const electronconfig = require("./electron_config.json");
const fs = require("fs");
const path = require("path");

ipcRenderer.on("theme-changed", (event, theme) => {
    const themeLink = document.getElementById("theme");
    if (themeLink !== null) {
        themeLink.href = `./assets/themes/${theme}.css`;
    }
    const themealtLink = document.getElementById("theme-alt");
    if (themealtLink !== null) {
        themealtLink.href = `../assets/themes/${theme}.css`;
    }
    const themealtaltLink = document.getElementById("theme-alt-alt");
    if (themealtaltLink !== null) {
        themealtLink.href = `../../assets/themes/${theme}.css`;
    }
});

ipcRenderer.send("request-theme");

//------------------------------------------------------------------------//
ipcRenderer.on("language-changed", (event, lang) => {
    // Dil dosyasından metinleri al ve elementlere yerleştir
    const languageFile = require(`./languages/${lang}.json`);
    document.getElementById("welcome").innerText = languageFile.welcome;
    // Diğer metinleri de aynı şekilde güncelle
});
//------------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const intervalsPopupButton = document.getElementById("intervals-popup");
    intervalsPopupButton.addEventListener("click", () => {
        ipcRenderer.send("open-intervals");
    });
});
