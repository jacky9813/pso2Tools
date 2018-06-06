class TaCounterSetTime extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.click(null);
    }
    render(){
        return (<button key={"TaCounterSetTimeNow"+this.props.cid.toString()} onClick={()=>{this.handleClick();}}>{this.props.label}</button>);
    }
}
class TaCounter extends pso2tools_module{
    constructor(app){
        super(app);
        this.db = app.db;
    }

    dbInitialize(){
        this.db.run("ALTER TABLE `characters` ADD COLUMN `lastTATime` TIMESTAMP NULL");
    }

    getTATime(cid){
        return this.db.run("SELECT lastTATime FROM characters WHERE cid = ?", [Math.floor(cid)])[0].lastTATime;
    }
    setTATTime(cid, time = null){
        if(time == null){
            time = Date.now();
        }
        this.db.run("UPDATE characters SET lastTATime=? WHERE cid=?",[time, cid]);
        this.app.render();
    }
    renderToolBlock(cid){
        var lastTaTime = this.getTATime(cid);
        var cdComplete = Date.now() > (lastTaTime+ (1000*3600*166))
        return (<div>{"Previous TA Time: "+(new Date(lastTaTime)).toLocaleString()}<br/>
        <span style={{color: cdComplete?"green":"red"}}>{"Cool Down Complete time: "+(new Date(lastTaTime+ (1000*3600*166))).toLocaleString()}</span><br />
        <TaCounterSetTime cid={cid} time={"now"} label={"Just done TA"} click={(time)=>{this.setTATTime(cid,time)}}/>
        </div>);
    }

    renderCharTable(cid){
        return <td key={"tbltaCounter"+cid.toString()}>{(Date.now() > (this.getTATime(cid)+1000*3600*166))?(<span style={{color:"green"}}>{"TA mission available"}</span>):(<span style={{color:"red"}}>{"TA mission unavailable"}</span>)}</td>;
    }
}