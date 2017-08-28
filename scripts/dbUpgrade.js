function pso2cDBUpgrade(pso2c,fromVersion=""){
    console.log("Upgrading from " + fromVersion +" to "+ pso2c.version);
    switch(fromVersion){
        case "":
        case "0.0.1-alpha":
            pso2c._db.run("ALTER TABLE characters ADD COLUMN memo TEXT NULL");
            pso2c._db.run("CREATE TABLE IF NOT EXISTS `pso2Tools` (\
                `version` TEXT NULL,\
                `__ignore_this` INTEGER PRIMARY KEY DEFAULT 1 CHECK(__ignore_this=1) \
            )",(e,r)=>{
                pso2c._db.run("INSERT INTO pso2Tools(version) VALUES (?)",[this.version]);
            });
            
    }
}