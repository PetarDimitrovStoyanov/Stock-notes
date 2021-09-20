const electron = require("electron");
const {app, BrowserWindow, Menu} = electron;

// SET ENVIRONMENT
/*process.env.NODE_ENV = 'production';*/

//SET ENVIRONMENT - for developer
process.env.NODE_ENV = 'development';
//write in terminal "npm run start"

// electron
let win;

async function createWindow() {
    win = new BrowserWindow({
        width: 1300,
        length: 2400,
        title: "Нова стокова разписка",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    await win.loadFile('main.html');
    win.removeMenu();
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
    //win.webContents.openDevTools();
}


const mainMenuTemplate = [];

//Add developer tools not if production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [
            {
                label: 'Toggle Dev tools',
                accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I", // this is shortcut
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

app.whenReady().then(createWindow)
/*
// Set environment:
//process.env.NODE_ENV = 'production'

let mainWindow;
let addWindow;

// listen for app to be ready
app.on("ready", function () {
    // Create new Window
    mainWindow = new BrowserWindow({});

    // load html file into the window
    // this makes - file://dirname/newStockNote.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newStockNote.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when main window is closed
    mainWindow.on('closed', function () {
        app.quit();
    })

    // Build menu from the template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add Window
function showAllStockNotes() {
// Create new Window
    addWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: 'Всички стокови разписки'
    });

    // load html file into the window
    // this makes - file://dirname/newStockNote.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'stockNotes.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage collection
    addWindow.on('closed', function () {
        addWindow = null;
    });
}

// Handle create add Window
function showAllClients() {
// Create new Window
    addWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: 'Всички стокови разписки'
    });

    // load html file into the window
    // this makes - file://dirname/newStockNote.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'stockNotes.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage collection
    addWindow.on('closed', function () {
        addWindow = null;
    });
}






// Create menu template
const mainMenuTemplate = [
    {
        label: "Всички стокови разписки",
        click() {
            showAllStockNotes();
        }
    },
    {
        label: 'Списък с клиенти',
        click() {
            showAllClients();
        }
        /!*    submenu: [
                {
                    label: 'Add Item',
                    click() {
                        createAddWindow();
                    }
                },
                {
                    label: "Clear Item"
                },
                { // click is eventListener from Electron
                    label: "Quit",
                    accelerator: process.platform === "darwin" ? "Command+Q" : "Escape", // this is shortcut
                    click() {
                        app.quit();
                    }
                }]*!/
    },
    {
        label: "Изход",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Escape", // this is shortcut
        click() {
            app.quit();
        }
    }
];

//Add developer tools not if production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [
            {
                label: 'Toggle Dev tools',
                accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I", // this is shortcut
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}*/
