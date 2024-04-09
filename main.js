const developermode = true;

const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const fs = require("fs");
const path = require("path");
const electronconfig = require("./electron_config.json");

const languageDir = "./languages";
const languageFiles = fs
    .readdirSync(languageDir)
    .filter((file) => file.endsWith(".json"));

const languages = {};
languageFiles.forEach((file) => {
    const langCode = path.basename(file, ".json");
    try {
        languages[langCode] = require(path.join(__dirname, languageDir, file));
    } catch (error) {
        console.error(`Dosya yüklenirken bir hata oluştu: ${error}`);
    }
});

let lang = electronconfig.lang ?? "en";
let theme = electronconfig.theme ?? "light";
let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadFile("./pages/index.html");
    mainWindow.webContents.once("dom-ready", () => {
        mainWindow.webContents.send("language-changed", lang);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("request-theme", (event) => {
    fs.readFile("./electron_config.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading electronconfig.json:", err);
            return;
        }

        const theme = electronconfig.theme || "light";

        event.sender.send("theme-changed", theme);
    });
});

function openintervalsPopup() {
    let intervalWindow = new BrowserWindow({
        width: 500,
        height: 500,
        parent: mainWindow,
        modal: true,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    intervalWindow.loadFile("./pages/test_settings/intervals/intervals.html");

    intervalWindow.once("ready-to-show", () => {
        intervalWindow.show();
    });
}

// İletişim için IPC event'i
ipcMain.on("open-intervals", () => {
    openintervalsPopup();
});

//---------------------------------------------------------//

const menutemplate = [
    {
        label: languages[lang].bot.bot,
        submenu: [
            {
                label: languages[lang].bot.mainpage,
                click: () => mainWindow.loadFile("./pages/index.html"),
            },
            {
                label: languages[lang].bot.settings,
                click: () =>
                    mainWindow.loadFile("./pages/settings/settings.html"),
            },
            { label: languages[lang].bot.quit, click: () => app.quit() },
            {
                label: languages[lang].bot.settings + "/ Test",
                click: () =>
                    mainWindow.loadFile("./pages/test_settings/settings.html"),
            },
        ],
    },
    {
        label: languages[lang].languages,
        submenu: [
            { label: "EN", click: () => changelang("en") },
            { label: "TR", click: () => changelang("tr") },
        ],
    },
    {
        label: languages[lang].theme.themes,
        submenu: [
            {
                label: languages[lang].theme.light,
                click: () => changetheme("light"),
            },
            {
                label: languages[lang].theme.dark,
                click: () => changetheme("dark"),
            },
            {
                label: languages[lang].theme.halloween,
                click: () => changetheme("halloween"),
            },
            {
                label: languages[lang].theme.vintage,
                click: () => changetheme("vintage"),
            },
            {
                label: languages[lang].readme,
                click: () =>
                    mainWindow.webContents.executeJavaScript(
                        `alert("${languages[lang].theme.readme}");`
                    ),
            },
        ],
    },
    {
        label: languages[lang].readme,
        click: () => mainWindow.loadFile("./pages/readme/readme.html"),
    },
];
if (developermode) {
    menutemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Aç/Kapat",
                accelerator:
                    process.platform === "darwin"
                        ? "Cmd+Alt+I"
                        : "Ctrl+Shift+I",
                click: () => {
                    mainWindow.webContents.toggleDevTools();
                },
            },
            {
                label: "Force Reload",
                accelerator:
                    process.platform === "darwin" ? "cmd+alt+r" : "ctrl+r",
                click: () => {
                    mainWindow.reload();
                },
            },
        ],
    });
}

const menu = Menu.buildFromTemplate(menutemplate);
Menu.setApplicationMenu(menu);

//-----------------------------------------------------------------------------------//

function changetheme(newtheme) {
    theme = newtheme;
    const config = JSON.parse(
        fs.readFileSync("./electron_config.json", "utf8")
    );
    config.theme = newtheme;
    fs.writeFileSync(
        "./electron_config.json",
        JSON.stringify(config, null, 4),
        "utf8"
    );

    mainWindow.webContents.send("theme-changed", newtheme);
    mainWindow.webContents.executeJavaScript(
        `alert("${languages[lang].theme.changed}");`
    );
}

function changelang(newlang) {
    lang = newlang;
    const config = JSON.parse(
        fs.readFileSync("./electron_config.json", "utf8")
    );
    config.lang = newlang;
    fs.writeFileSync(
        "./electron_config.json",
        JSON.stringify(config, null, 4),
        "utf8"
    );
    const newMenu = createMenu();
    Menu.setApplicationMenu(newMenu);
    mainWindow.webContents.send("language-changed", newlang);
}

function createMenu() {
    const newMenus = [
        {
            label: languages[lang].bot.bot,
            submenu: [
                {
                    label: languages[lang].bot.mainpage,
                    click: () => mainWindow.loadFile("./pages/index.html"),
                },
                {
                    label: languages[lang].bot.settings,
                    click: () =>
                        mainWindow.loadFile("./pages/settings/settings.html"),
                },
                { label: languages[lang].bot.quit, click: () => app.quit() },
                {
                    label: languages[lang].bot.settings + "/ Test",
                    click: () =>
                        mainWindow.loadFile(
                            "./pages/test_settings/settings.html"
                        ),
                },
            ],
        },
        {
            label: languages[lang].languages,
            submenu: [
                { label: "EN", click: () => changelang("en") },
                { label: "TR", click: () => changelang("tr") },
            ],
        },
        {
            label: languages[lang].theme.themes,
            submenu: [
                {
                    label: languages[lang].theme.light,
                    click: () => changetheme("light"),
                },
                {
                    label: languages[lang].theme.dark,
                    click: () => changetheme("dark"),
                },
                {
                    label: languages[lang].theme.halloween,
                    click: () => changetheme("halloween"),
                },
                {
                    label: languages[lang].theme.vintage,
                    click: () => changetheme("vintage"),
                },
                {
                    label: languages[lang].readme,
                    click: () =>
                        mainWindow.webContents.executeJavaScript(
                            `alert("${languages[lang].theme.readme}");`
                        ),
                },
            ],
        },
        {
            label: languages[lang].readme,
            click: () => mainWindow.loadFile("./pages/readme/readme.html"),
        },
    ];
    if (developermode) {
        newMenus.push({
            label: "Developer Tools",
            submenu: [
                {
                    label: "Aç/Kapat",
                    accelerator:
                        process.platform === "darwin"
                            ? "Cmd+Alt+I"
                            : "Ctrl+Shift+I",
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    },
                },
                {
                    label: "Force Reload",
                    accelerator:
                        process.platform === "darwin" ? "cmd+alt+r" : "ctrl+r",
                    click: () => {
                        mainWindow.reload();
                    },
                },
            ],
        });
    }
    return Menu.buildFromTemplate(newMenus);
}
