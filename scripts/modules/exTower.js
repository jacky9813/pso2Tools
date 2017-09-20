(function(){
    var exTower = {};

    exTower = (function(){
        function exTower(db){
            this._db = db;
            
            this.InstallQuery = exTower.prototype._dbInstallQuery;
            this.towers = exTower.prototype._towers;
            this.displayName = exTower.prototype._displayName;
            this.checkExist = (function(_this){
                return function(cbk = null,autoinstall = false){
                    _this._db.all("PRAGMA table_info(characters)",(e,r)=>{
                        if(e==null){
                            var installed = false;
                            r.forEach(function(el) {
                                if(el.name=="exTower"){
                                    installed = true;
                                }
                            }, this);
                            if(typeof(cbk)=="function"){
                                cbk(installed);
                            }
                            if(autoinstall && !installed){
                                _this.Install();
                            }
                        }else{
                            alert("Error Occured: " + e);
                        }
                    });
                }
            })(this);
            this.Install = (function(_this){
                return function(){
                    _this._db.run(_this.InstallQuery,(e,r)=>{
                        if(e!=null){
                            console.error(e);
                        }else{
                            location.reload();
                        }
                    });
                }
            })(this);
            this.getStatus = (function(_this){
                return function(cid,cbk){
                    if(typeof(cbk)!="function"){console.warn("Current function call without a callback function means nothing since this function cannot return the result");return;}
                    _this._db.all("SELECT exTower FROM characters WHERE cid=?",[cid],(e,r)=>{
                        if(e!=null){
                            console.error(e);
                        }else{
                            var out = {};
                            Object.keys(_this.towers).forEach((el)=>{
                                if(r[0].exTower != null){
                                    out[_this.towers[el]] = parseInt(r[0].exTower.substr(2*el,2),16);
                                    out[_this.towers[el]] = isNaN(out[_this.towers[el]])?0:out[_this.towers[el]];
                                }else{
                                    out[_this.towers[el]] = 0;
                                }
                            });
                            cbk(out);
                        }
                    });
                }
            })(this);
            this.setStatus = (function(_this){
                return function(cid,list){
                    if(cid==null || (!$.isNumeric(cid))){
                        throw "Invalid format for cid";
                        return;
                    }
                    if(list==null || typeof(list)!="object"){
                        throw "Invalid format for list";
                        return;
                    }
                    if(typeof(cid)!="number"){
                        cid = parseInt(cid);
                    }
                    var out = "";
                    _this.towers.forEach((el)=>{
                        if(typeof(list[el])=="number"){
                            out += ("0" + list[el].toString(16)).slice(-2);
                        }else{
                            out += "00";
                        }
                    });
                    _this._db.run("UPDATE characters SET exTower=? WHERE cid=?",[out,cid]);
                }
            })(this);
            this.createEmptyList = (function(_this){
                return function(){
                    var out = {};
                    _this.towers.forEach((el)=>{
                        out[el] = 0;
                    })
                    return out;
                }
            })(this);
        }

        exTower.prototype._dbInstallQuery = "ALTER TABLE characters ADD COLUMN exTower TEXT NULL";
        exTower.prototype._towers = ["BlizAndMach","ForeAndDrag","RelicAndOcean","Solo","SoloBrokenWorld"];
        exTower.prototype._displayName = {
            "BlizAndMach":"極限訓練：凍土と機甲",
            "ForeAndDrag":"極限訓練：森林と龍",
            "RelicAndOcean":"極限訓練：遺跡と海王",
            "Solo":"独極訓練：天極と地極",
            "SoloBrokenWorld":"独極訓練：世壊の境界"
        }

        return exTower;
    })();

    window.exTower = exTower;
})()