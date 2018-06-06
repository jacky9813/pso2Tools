class DeleteCharacter extends pso2tools_module{
    constructor(app){
        super(app);
    }

    delete(cid){
        var CName = this.app.listCharacter().find((elem)=>{return elem.cid == cid}).CName;
        if(confirm("Are you sure to delete character "+CName)){
            this.app.db.run("DELETE FROM characters WHERE cid=?",[cid]);
        }
        this.app.render();
    }

    renderCharTable(cid){
        return <td key={"DeleteCharacter"+cid.toString()}><button onClick={()=>{this.delete(cid);}}>Delete</button></td>
    }
}