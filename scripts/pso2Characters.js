

class pso2Character{
    get version(){
        return "0.0.3-alpha";
    }
    
    constructor(dbFile=null){
        if(dbFile=="" || dbFile==null){
            throw "No database file is specified";
            return;
        }
        this._db = undefined;
        // opening database
        if(!path.isAbsolute(dbFile)){
            dbFile = path.join(__dirname,dbFile);
        }
        if(!fs.existsSync(dbFile)){
            var newdb = true;
        }
        this._db = new sqlite3.Database(dbFile);
        var clsInstance = this;
        if(newdb){
            // Create new database
            clsInstance._db.run("CREATE TABLE IF NOT EXISTS `characters` (\
                `cid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                `CName` TEXT NULL,\
                `lastTATime` DATETIME NULL,\
                `classLv` TEXT NULL,\
                `memo` TEXT NULL);");
                clsInstance._db.run("CREATE TABLE IF NOT EXISTS `pso2Tools` (\
                `version` TEXT NULL,\
                `__ignore_this` INTEGER PRIMARY KEY DEFAULT 1 CHECK(__ignore_this=1) \
            )",(e,r)=>{
                clsInstance._db.run("INSERT INTO pso2Tools(version) VALUES (?)",["0.0.2-alpha"],(e,r)=>{
                    location.reload();
                });
            });
        }else{
            //Check database version
            this._db.all("SELECT * FROM pso2Tools",(e,r)=>{
                if(e!=null){
                    //Error occured, no pso2Tools information table found
                    pso2cDBUpgrade(this,"");
                }else{
                    if(semver.lt(r[0].version,this.version)){
                        // User running at lower version
                        pso2cDBUpgrade(this,r[0].version);
                    }
                }
            })
        }

    }

    getChList(cbk=null){
        if(cbk==null){
            throw "Why u calling this without callback function? You'll be able to receive data only from callback function";
            return;
        }
        this._db.serialize(function(){
            var query = this.all("SELECT * FROM characters;",function(err,result){
                cbk(result);
            });
        });
    }

    addCh(name=null,cbk=null){
        if(name==null || name==""){
            throw "empty name";
            return;
        }
        if(typeof(name)!="string"){
            name = name.toString();
        }
        var lv = "01".repeat(this.classList.length);
        this._db.run("INSERT INTO characters(CName, classLv) VALUES (?,?)",[name,lv],(e,r)=>{
            if(e==null){
                if(cbk != null && typeof(cbk)=="function"){
                    cbk();
                }
            }
        });
    }

    deleteCh(cid=null,cbk=null){
        if(cid==null || (!$.isNumeric(cid))){
            throw "Invalid format for cid, it should be an id number of a character";
            return;
        }
        if(typeof(cid)!="number"){
            cid = parseInt(cid,10);
        }
        this._db.run("DELETE FROM characters WHERE cid=?",[cid],(e,r)=>{
            if(e==null){
                if(cbk != null && typeof(cbk)=="function"){
                    cbk();
                }
            }
        });
    }

    TArun(cid=null,time=null,cbk=null){
        if(cid==null || (!jQuery.isNumeric(cid))){
            throw "wrong type of id is inputed";
            return;
        }
        if(time==null){
            this._db.run("UPDATE characters SET lastTATime=datetime('now','localtime') WHERE cid=?",[cid],(e,r)=>{
                if(e==null && typeof(cbk)=="function"){
                    cbk();
                }
            });
        }else{
            switch(typeof(time)){
                case "string":
                    //In this case, the string must have format "YYYY-MM-DD HH:MM:SS" or any thing https://sqlite.org/lang_datefunc.html describes
                    this._db.run("UPDATE characters SET lastTATime=? WHERE cid=?",[time,cid],(e,r)=>{
                        if(e==null && typeof(cbk)=="function"){
                            cbk();
                        }
                    });
                    break;
                default:
                    throw "Invalid format for datetime input";
                    return;
            }
        }
    }

    get classList(){
        return ["Hu","Fi","Ra","Gu","Fo","Te","Br","Bo","Su","Hr"];
    }

    get emptyClassList(){
        var classes = this.classList;
        var out = {};
        classes.forEach(function(c){
            out[c] = 1;
        })
        return out;
    }

    get maxLevel(){
        return 80;
    }

    solveLevel(lv=null){
        if(lv==null || typeof(lv)!="string"){
            throw "Invalid input format, it should be Hexadecimal String";
            return;
        }
        var result = {};
        var classes = this.classList;
        Object.keys(classes).forEach(function(k){
            result[classes[k]] = parseInt(lv.substr(2*k,2),16);
            result[classes[k]] = isNaN(result[classes[k]])?1:result[classes[k]];
        });
        return result;
    }

    setLevel(cid=null,lv=null){
        if(cid==null || (!$.isNumeric(cid))){
            throw "Invalid format for cid, this should be a id number of one character";
            return;
        }
        if(lv==null || typeof(lv)!="object"){
            throw "Invalid format for lv, this should be an object that its property is class => level(decimal)"
            return;
        }
        if(typeof(cid)!="number"){
            cid = parseInt(cid,10);
        }
        var classes = this.classList;
        var out = "";
        classes.forEach(function(c){
            if(typeof(lv[c])=="number"){
                out +=("0" + lv[c].toString(16)).slice(-2);
            }else{
                out += "01";
            }
        });
        this._db.run("UPDATE characters SET classLv=? WHERE cid=?",[out,cid]);
    }

    setMemo(cid=null,memo=null,cbk=null){
        if(cid==null || (!$.isNumeric(cid))){
            throw "Invalid format for cid, this should be a id number of one character";
            return;
        }
        if(typeof(cid)!="number"){
            cid = parseInt(cid,10);
        }
        this._db.run("UPDATE characters SET memo=? WHERE cid=?",[memo, cid],(e,r)=>{if(e!=null&&typeof(cbk)=="function"){cbk();}else{if(e!=null){alert(e);}}});
    }

    getLinks(cbk=null){
        if(typeof(cbk)!="function"){
            throw "Calling this function without callback function is meaningless.";
            return;
        }
        this._db.all("SELECT * FROM links",(e,r)=>{
            if(e==null){
                cbk(r);
            }else{
                throw e;
            }
        });
    }

    newLink(link,title=null,cbk=null){
        if(typeof(link)!="string" || link.trim==""){
            throw "Empty link";
            return;
        }
        if(title==null){
            // Fetching title
            $("body").append("<iframe id=\"ifr-getTitle\" style=\"display:none;\" src=\""+link+"\"></iframe>");
            $("#ifr-getTitle").on("load",()=>{
                title=$("#ifr-getTitle")[0].contentDocument.title;
                this._db.run("INSERT INTO links(link, title) VALUES (?,?)",[link,title],(e,r)=>{
                    if(e==null){
                        if(typeof(cbk)=="function"){
                            cbk();
                        }
                    }else{
                        throw e;
                    }
                });
            });
        }else{
            this._db.run("INSERT INTO links(link, title) VALUES (?,?)",[link,title],(e,r)=>{
                if(e==null){
                    if(typeof(cbk)=="function"){
                        cbk();
                    }
                }else{
                    throw e;
                }
            });
        }
    }

    deleteLink(linkID, cbk=null){
        if(!$.isNumeric(linkID)){
            throw "Expected an integer type for linkID";
            return;
        }
        if(typeof(linkID)!="number"){
            linkID = parseInt(linkID);
        }
        this._db.run("DELETE FROM links WHERE pklink=?",[linkID],(e,r)=>{
            if(e==null){
                if(typeof(cbk)=="function"){
                    cbk();
                }
            }else{
                throw e;
            }
        })
    }
}