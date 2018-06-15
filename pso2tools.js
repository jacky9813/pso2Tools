class TabPage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (<div className={"tabcontent"} id={"tab"+this.props.tabId.toString()}>{this.props.content}</div>);
    }
}
function TabButton(props){
    return (<button className={"tablinks"} onClick={()=>{openTab(props.openTarget)}} id={"tabBtn"+props.tabBtnId} key={"tabBtn"+props.tabBtnId}>{props.label}</button>);
}
function openTab(tabId){
    var contents  = document.getElementsByClassName("tabcontent");
    var links = document.getElementsByClassName("tablinks");
    for(var i=0;i<contents.length;i++) contents[i].removeAttribute("style");
    for(var i=0;i<links.length;i++) links[i].removeAttribute("active");
    document.getElementById("tab"+tabId.toString()).setAttribute("style","display:block;");
    document.getElementById("tabBtn"+tabId.toString()).setAttribute("active","");
}
class pso2tools{
    /**
     * 
     * @param {string} dbFile file path to database
     */
    constructor(dbFile){
        if(!path.isAbsolute(dbFile)){
            dbFile = path.join(__dirname, dbFile);
        }
        var initDB = false;
        this._dbFile = dbFile;
        if(!fs.existsSync(dbFile)){
            initDB = true;
        }
        this.db = require("sqlite-sync");
        this.db.connect(dbFile);
        if(initDB){
            this.dbInitialize();
        }
        this.loadedModules = {};
        this.settings = {
            "pso2DocumentLocation": path.join(process.env.HOME, "Documents\\SEGA\\PHANTASYSTARONLINE2")
        }
        var settingsFile = path.join(process.cwd(),"settings.json");
        if(fs.existsSync(settingsFile)){
            var settings = JSON.parse(fs.readFileSync(settingsFile,{encoding:"utf8"}));
            this.settings = Object.assign(this.settings, settings);
        }
        
    }

    dbInitialize(){
        this.db.run("CREATE TABLE IF NOT EXISTS `characters`(\
            `cid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
            `CName` TEXT NULL);")
        this.db.run("CREATE TABLE IF NOT EXISTS `installed_modules`(\
            `module_name` TEXT PRIMARY KEY);")
    }

    _dbInstallModule(moduleName, moduleDbInit){
        // Check if module is installed
        var db = this.db;
        var r = db.run("SELECT module_name FROM `installed_modules` WHERE module_name = ? ;",[moduleName]);
        if(r.length == 0){
            // module not installed, install module
            console.log("New module detected: "+ moduleName);
            moduleDbInit();
            db.run("INSERT INTO installed_modules(module_name) VALUES (?)",[moduleName.toString()]);
        }else{
            console.log("Module " + moduleName + " has already installed");
        }
    }

    /**
     * 
     * @param {string} moduleName 
     * @param {pso2tools_module} moduleLoader 
     */
    loadModule(moduleLoader){
        var temp = new moduleLoader(this);
        if(temp){
            this.loadedModules[moduleLoader.name] = temp;
            this._dbInstallModule(moduleLoader.name, ((me)=>{return ()=>me.loadedModules[moduleLoader.name].dbInitialize();})(this));
        }
    }

    addCharacter(CName){
        return this.db.run("INSERT INTO characters(CName) VALUES (?)",[CName]);
    }

    listCharacter(){
        return this.db.run("SELECT cid, CName FROM characters");
    }

    render(){
        // Listing character list
        var characters = this.listCharacter();

        // Rendering the result of character overview table
        var tbl = [];
        for(var i=0; i<characters.length; i++){
            var tblResults = [<td key={"tblCh"+characters[i].cid}>{characters[i].CName}</td>];
            Object.keys(this.loadedModules).forEach((key)=>{
                var result = this.loadedModules[key].renderCharTable(characters[i].cid);
                if(result!=null){
                    tblResults.push(result);
                }
            });
            tbl.push(<tr key={"tblRow"+characters[i].cid.toString()}>{tblResults}</tr>)
        }
        tbl.push(<tr key={"tblRowAddCh"}><td><input type={"text"} id={"addCharName"}/></td><td><button onClick={()=>{this.addCharacter(document.getElementById("addCharName").value);document.getElementById("addCharName").value="";this.render();}}>{"Add Character"}</button></td></tr>);

        var tabPages = [<TabPage content={<table><tbody>{tbl}</tbody></table>} tabId="-1" key={"tab-1"}></TabPage>];
        var tabButtons = [TabButton({"openTarget":-1, "label": "Overview", "tabBtnId":-1})];

        // rendering modules' tab pages
        for(i in this.loadedModules){
            var toolTab = this.loadedModules[i].renderTab();
            if(toolTab!=null){
                tabPages.push(<TabPage content={toolTab.content} tabId={i} key={"tab-tool-"+i}></TabPage>);
                tabButtons.push(TabButton({"openTarget":i, "label":toolTab.label, "tabBtnId": i}));
            }
        }

        tabButtons.push(<br key={"tabBtnBreak"}/>);
        
        // rendering result for module's tab tools
        for(var i=0; i<characters.length; i++){
            var toolResults = [];
            Object.keys(this.loadedModules).forEach((key)=>{
                var result = this.loadedModules[key].renderToolBlock(characters[i].cid);
                if(result!=null){
                    toolResults.push(<div key={key+characters[i].cid}>{result}</div>);
                }
            });
            //Creating new tab
            tabPages.push(<TabPage content={<div className={"gridwrapper"}>{toolResults}</div>} tabId={characters[i].cid} key={"tab"+characters[i].cid.toString()}></TabPage>);
            tabButtons.push(TabButton({"openTarget":characters[i].cid, "label": characters[i].CName, "tabBtnId": characters[i].cid.toString()}));
        }
        
        ReactDOM.render(<div>{tabPages}</div>, document.getElementById("tabContainers"));
        ReactDOM.render(<div>{tabButtons}</div>, document.getElementById("tabButtons"));
    }
}