class devToolOpen extends pso2tools_module{
    /**
     * 
     * @param {sqlite3.Database} db 
     */
    constructor(app){
        super(app);
    }

    renderTab(){
        var content = <button onClick={function(){require("electron").remote.getCurrentWindow().openDevTools()}}>open DevTool</button>;
        return {content:content ,label:"DevTools"};
    }
}