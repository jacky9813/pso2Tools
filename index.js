const electron = require('electron');

const app = electron.app;

if(app==null){
    throw "electron is not initiated.";
    process.exit();
}

const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;

function CreateWindow(){
    mainWindow = new BrowserWindow({
        width: 1024, 
        height: 600, 
        frame: true,
        //icon: path.join(__dirname,"images\\appicon\\win\\appicon.ico"),
        webPreferences: {
            experimentalFeatures: true,
        }
    });
    
    //mainWindow.webContents.openDevTools();

    mainWindow.setMenu(null);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed',function(){
        mainWindow = null;
    });
}

app.on('ready',CreateWindow);

app.on('window-all-closed',function(){
    if(process.platform !== 'darwin'){
        app.quit();
    }
})

app.on('activate',function(){
    if(mainWindow==null){
        CreateWindow();
    }
})