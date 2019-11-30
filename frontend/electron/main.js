const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app, BrowserWindow,
} = electron;

let mainWindow;

app.on('ready', () => {
    // New Window
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        resizable: true,
        frame: true,
        fullscreen: true,
    });
    // Load HTML
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../start.html'),
        protocol: 'file:',
        slashes: true,
    }));
});
