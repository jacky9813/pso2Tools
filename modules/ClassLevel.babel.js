class ClassLevelInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "value": this.props.value
        }
    }

    handleChange(event){
        this.setState({"value": event.target.value});
        var temp = {};
        temp[this.props.className] = event.target.value;
        this.props.change(this.props.cid, temp);
    }

    render(){
        return <tr><td>{this.props.className}</td><td><input type={"number"} onChange={(event)=>{this.handleChange(event);}} min={1} max={this.props.lvMax} step={1} value={this.state.value} /></td></tr>;
    }
}
class ClassLevel extends pso2tools_module{
    constructor(app){
        super(app);
    }

    dbInitialize(){
        this.app.db.run("ALTER TABLE characters ADD COLUMN classLv TEXT NULL");
    }

    getEmptyLevelList(){
        return {
            "Hu":90,
            "Fi":90,
            "Ra":90,
            "Gu":90,
            "Fo":90,
            "Te":90,
            "Br":90,
            "Bo":90,
            "Su":90,
            "Hr":90,
            "Ph":90
        };
    }

    setLevel(cid, modifyList){
        var clsList = Object.assign(this.getLevel(cid),modifyList), key, finalOutput = "";
        for (key in this.getEmptyLevelList()){
            finalOutput += ("0" + parseInt(clsList[key]).toString(16)).slice(-2);
        }
        this.app.db.run("UPDATE characters SET classLv=? WHERE cid=?",[finalOutput, cid]);
    }

    getLevel(cid){
        var rawData = this.app.db.run("SELECT classLv FROM characters WHERE cid=?",[cid])[0].classLv;
        if(!rawData) rawData = "";
        var classes = Object.keys(this.getEmptyLevelList());
        var result = {};
        Object.keys(classes).forEach((i)=>{
            result[classes[i]] = parseInt(rawData.substr(2*i,2),16);
            result[classes[i]] = isNaN(result[classes[i]])?1:result[classes[i]];
        })
        return result;
    }

    renderToolBlock(cid){
        var resultDOM = [], clsLv = this.getLevel(cid), cls, clsLvMax = this.getEmptyLevelList();
        for(cls in clsLv){
            resultDOM.push(<ClassLevelInput className={cls} key={"ClassLevenInput"+cid.toString()+cls} change={(cid,list)=>{this.setLevel(cid,list);}} cid={cid} value={clsLv[cls]} lvMax={clsLvMax[cls]} />);
        }
        return <table><tbody>{resultDOM}</tbody></table>;
    }

    renderCharTable(cid){
        return null;
    }
}