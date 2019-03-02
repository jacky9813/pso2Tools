class pso2tools_module{
    /**
     * 
     * @param {sqlite3.Database} db 
     */
    constructor(app){
        this.app = app;
    }

    dbInitialize(){

    }

    createStyle(css){
        var style = document.createElement("style")
        style.type = "text/css"
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    renderToolBlock(cid){
        return null;
    }

    renderCharTable(cid){
        return null;
    }

    renderTab(){
        return null;
    }
}