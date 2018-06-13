const electron = require("electron");

const app = electron.app;

if(app == null){
    throw "electron is not initiated.";
    process.exit();
}

const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const fs = require("fs");

var oldFile = "pso2Tools.db";
var newFile = "pso2db.db";

function upgradeDatabase(dbFile){
    var db = require("sqlite-sync");
    var offset = (new Date().getTimezoneOffset())*60;
    var timeahead = offset<0;
    offset = Math.abs(offset);
    db.connect(dbFile)
    var commands = [
        "CREATE TABLE temp_table AS SELECT * FROM characters",
        "DROP TABLE characters",
        "CREATE TABLE IF NOT EXISTS `characters`(\
            `cid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
            `CName` TEXT,\
            `lastTATime` TIMESTAMP,\
            `classLv` TEXT,\
            `memo` TEXT\
        );",
        "INSERT INTO characters(CName, lastTATime, classLv, memo) SELECT CName, strftime('%s',lastTATime)"+ (timeahead?"-":"+") + offset.toString() +", classLv, memo FROM temp_table",
        "DROP TABLE temp_table",
        "CREATE TABLE IF NOT EXISTS `installed_modules`(`module_name` TEXT PRIMARY KEY);",
        "INSERT INTO installed_modules(module_name) VALUES ('ClassLevel')",
        "INSERT INTO installed_modules(module_name) VALUES ('Memo')",
        "INSERT INTO installed_modules(module_name) VALUES ('TaCounter')",
    ]
    for(var cmd in commands){
        console.log(db.run(commands[cmd]));
    }
}

if(!path.isAbsolute(oldFile)){
    oldFile = path.join(process.cwd(),oldFile);
}

if(!path.isAbsolute(newFile)){
    newFile = path.join(process.cwd(),newFile);
}

if(fs.existsSync(oldFile)){
    fs.rename(oldFile, newFile, ()=>{upgradeDatabase(newFile);})
    upgradeDatabase(newFile);
}

let mainWindow;

function CreateWindow(){
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        minHeight: 400,
        minWidth: 500,
        frame: false,
        webPreferences: {
            //experimentalFeatures: true
        }
    });

    // To open DevTools, uncomment the line below
    //mainWindow.webContents.openDevTools();

    mainWindow.setMenu(null);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.on("closed", function(){
        mainWindow = null;
    })
}

app.on("ready",CreateWindow);

app.on("window-all-closed", function(){
    if(process.platform !== 'darwin'){
        app.quit();
    }
})

app.on("activate", function(){
    if(mainWindow == null){
        CreateWindow();
    }
})