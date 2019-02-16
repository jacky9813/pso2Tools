class devToolOpen extends pso2tools_module{
    /**
     * 
     * @param {sqlite3.Database} db 
     */
    constructor(app){
        super(app);
    }

    renderTab(){
        var content = <div><button onClick={function(){require("electron").remote.getCurrentWindow().openDevTools()}}>open DevTool</button><br/><br/><button onClick={function(){location.reload();}}>{"location.reload()"}</button></div>;
        return {content:content ,label:"DevTools"};
    }
}