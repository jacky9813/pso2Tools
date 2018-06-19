class Settings_Field extends React.Component{
    constructor(props){
        super(props);
        this.state = {'value': props.value};
    }

    onChange(event){
        this.setState({'value': event.target.value});
        this.props.onChange(this.props.name, this.props.type, this.props.defValue);
    }

    render(){
        var fieldInput = "";
        switch(this.props.type){
            case "directory":
                fieldInput =  <input type={"file"} webkitdirectory={""} directory={""} id={"Settings_input_"+this.props.name} onChange={(event)=>{this.onChange(event);}} />
                break;
            case "file":
                fieldInput =  <input type={"file"} id={"Settings_input_"+this.props.name} onChange={(event)=>{this.onChange(event);}} />
                break;
            case "number":
                fieldInput =  <input type={"text"} pattern={"[0-9]*"} id={"Settings_input_"+this.props.name} value={this.state.value} onChange={(event)=>{this.onChange(event);}} />
                break;
            default:
                fieldInput =  <input type={this.props.type} id={"Settings_input_"+this.props.name} value={this.state.value} onChange={(event)=>{this.onChange(event);}} />
        }
        return <tr><td>{this.props.label?this.props.label:this.props.name}</td><td>{fieldInput}</td></tr>
    }
}

class Settings extends pso2tools_module{
    /**
     * 
     * @param {sqlite3.Database} db 
     */
    constructor(app){
        super(app);
        Settings.instanceOfMe = this;
    }

    static instanceOfMe = null;

    dbInitialize(){

    }

    onChange(fieldName, inputType, defValue){
        var prevSettings = {};
        if(fs.existsSync(path.join(process.cwd(),"settings.json"))){
            try{
                prevSettings = JSON.parse(fs.readFileSync(path.join(process.cwd(),"settings.json")));
            } catch (err){
                prevSettings = {};
            }
        }
        var value="";
        switch(inputType){
            case "file":
            case "directory":
                value = document.getElementById("Settings_input_"+fieldName).files[0].path;
                break;
            case "number":
                value = parseInt(document.getElementById("Settings_input_"+fieldName).value);
                break;
            default:
                value = document.getElementById("Settings_input_"+fieldName).value;
        }
        if(typeof(value) === "undefined" || value == ""){
            if(prevSettings.hasOwnProperty(fieldName)){
                delete prevSettings[fieldName];
            }
            Settings.instanceOfMe.app.settings[fieldName] = defValue;
        }else{
            prevSettings[fieldName] = value;
            Settings.instanceOfMe.app.settings[fieldName] = value;
        }
        fs.writeFileSync(path.join(process.cwd(),"settings.json"),JSON.stringify(prevSettings));
    }

    renderTab(){
        var content = <table><tbody>
            <Settings_Field label={"PSO2 User Document directory"} type={"directory"} onChange={this.onChange} name={"pso2DocumentLocation"} value={this.app.settings.pso2DocumentLocation} defValue={path.join(process.env.USERPROFILE, "Documents\\SEGA\\PHANTASYSTARONLINE2")} />
            <Settings_Field label={"PSO2 Player ID"} type={"number"} onChange={this.onChange} name={"myID"} value={this.app.settings.myID} defValue={0} />
            </tbody></table>
        return {'label':'Settings','content':content};
    }
}