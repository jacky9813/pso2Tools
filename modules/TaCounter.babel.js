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
        this.langList = {
            "PrevTATime": "Previous TA mission complete time:",
            "CDCompleteTime": "TA Mission Cooldown to:",
            "JustDone": "Just Done",
            "CDDoneAt": "CD done at",
            "TAMissionAvailable": "TA mission available",
            "CDUntil": "TA mission Cooldown to "
        }
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
        return (<div>{this.langList.PrevTATime+(new Date(lastTaTime*1000)).toLocaleString()}<br/>
        <span style={{background: (cdComplete?"unset":"red"), color: (cdComplete?"green":"white")}}>{this.langList.CDCompleteTime+(new Date(lastTaTime*1000+ (1000*3600*166))).toLocaleString()}</span><br />
        <TaCounterSetTime cid={cid} type={"Now"} label={this.langList.JustDone} click={()=>{this.setTATime(cid,null)}}/><br/>
        <TaCounterDateSelector cid={cid} /><br/>
        <TaCounterSetTime cid={cid} type={"CDComplete"} label={this.langList.CDDoneAt} click={()=>{this.setTATime(cid,(new Date(document.querySelector("#TaCounterDateSel"+cid.toString()).value)).getTime()/1000-(3600*166))}} />
        </div>);
    }

    renderCharTable(cid){
        var TACDtime = this.getTATime(cid)*1000+1000*3600*166;  // Chrome timestamp
        return <td key={"tbltaCounter"+cid.toString()}>{(Date.now() > TACDtime?(<span style={{color:"green"}}>{this.langList.TAMissionAvailable}</span>):(<span style={{background:"red",color:"white"}}>{this.langList.CDUntil+((new Date(TACDtime)).toLocaleString())}</span>))}</td>;
    }
}