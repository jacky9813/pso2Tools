const fs = require("fs");
const path = require("path");

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
    oldFile = path.join(__dirname,oldFile);
}

if(!path.isAbsolute(newFile)){
    newFile = path.join(__dirname,newFile);
}

if(fs.existsSync(oldFile)){
    fs.rename(oldFile, newFile, ()=>{upgradeDatabase(newFile);})
}else{
    upgradeDatabase(newFile);
}