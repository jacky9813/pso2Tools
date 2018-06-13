class TaCounterSetTime extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.click();
    }
    render(){
        return (<button key={"TaCounterSetTime"+(this.props.type?this.props.type:"")+this.props.cid.toString()} onClick={()=>{this.handleClick();}}>{this.props.label}</button>);
    }
}
class TaCounterDateSelector extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "value": (this.props.value)?this.props.value:((new Date()).toISOString())
        }
    }
    render(){
        return (<input type={"datetime-local"} id={"TaCounterDateSel"+this.props.cid.toString()} key={"TaCounterDateSel"+this.props.cid.toString()} defaultValue={this.state.value}/>);
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
    setTATime(cid, time = null){
        if(time == null){
            time = Date.now() / 1000;
        }
        this.db.run("UPDATE characters SET lastTATime=? WHERE cid=?",[time, cid]);
        this.app.render();
    }
    renderToolBlock(cid){
        var lastTaTime = this.getTATime(cid);
        var cdComplete = Date.now() > (lastTaTime+ (3600*166))*1000
        return (<div>{"Previous TA Time: "+(new Date(lastTaTime*1000)).toLocaleString()}<br/>
        <span style={{background: (cdComplete?"none":"red"), color: (cdComplete?"green":"none")}}>{"Cool Down Complete time: "+(new Date(lastTaTime*1000+ (1000*3600*166))).toLocaleString()}</span><br />
        <TaCounterSetTime cid={cid} type={"Now"} label={"Just done TA"} click={()=>{this.setTATime(cid,null)}}/><br/>
        <TaCounterDateSelector cid={cid} /><br/>
        <TaCounterSetTime cid={cid} type={"CDComplete"} label={"CD done at"} click={()=>{this.setTATime(cid,(new Date(document.querySelector("#TaCounterDateSel"+cid.toString()).value)).getTime()/1000-(3600*166))}} />
        </div>);
    }

    renderCharTable(cid){
        return <td key={"tbltaCounter"+cid.toString()}>{(Date.now() > (this.getTATime(cid)*1000+1000*3600*166))?(<span style={{color:"green"}}>{"TA mission available"}</span>):(<span style={{background:"red"}}>{"TA mission unavailable"}</span>)}</td>;
    }
}