class ChatLog_message extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        var textColor = {
            "PUBLIC":"#EEE",
            "PARTY": "#00BFFF",
            "GUILD": "#FFA500",
            "REPLY": "#FF1493"
        }
        var msgLines = this.props.message.split("\n")
        var max = msgLines.length;
        for(var i=1;i<max;i++){
            msgLines.splice(i*2-1,0,<br key={"ChatLog_msgLineBr_"+i.toString()}/>);
        }
        if(this.props.myID != this.props.playerID)
            return <span className={"ChatLog_msg"} style={{color:textColor[this.props.channel]}}>{this.props.playerCharacter}<span className={"CharLog_msgDetail"}>{this.props.time+", "+this.props.playerID}</span><br/>{msgLines}</span>
        return <span className={"ChatLog_msg"} style={{color:textColor[this.props.channel],textAlign:"right"}}><span className={"CharLog_msgDetail"}>{this.props.time+", "+this.props.playerID}</span>{this.props.playerCharacter}<br/>{msgLines}</span>
    }
}

function ChatLog_message_create(props, myID=0){
    var time = typeof(props.time)=="undefined"?"":props.time;
    return <ChatLog_message myID={myID} time={time} msgID={props.msgID} channel={props.channel} playerID={props.playerID} playerCharacter={props.playerCharacter} message={props.message} key={"ChatLog_msg_"+time+"_"+props.msgID}/>
}

class ChatLog extends pso2tools_module{
    constructor(app){
        super(app);
    }

    readChatLog(dirpath){
        var file = path.join(dirpath,document.getElementById("ChatLog_fileSelect").value);
        if(fs.existsSync(file)){
            var rawData = fs.readFileSync(file,{encoding:'utf-16le'});
            var domData = [<hr key={"ChatLog_msgSplitter_-1"}/>];
            rawData.split(/([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2})/guim).forEach((msg,i,ary)=>{
                msg = msg.trim().split("\t")
                if(msg.length < 5){
                    return;
                }
                msg = {
                    "msgID": msg[0],
                    "channel": msg[1],
                    "playerID": msg[2],
                    "playerCharacter": msg[3],
                    "message": msg[4]
                }
                if(ary[i-1].match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/)){
                    msg.time = ary[i-1]
                }
                if(msg.message.match(/\n/g)){
                    msg.message = msg.message.replace(/^\"/,"").replace(/\"$/,"")
                }
                msg.message = msg.message.replace(/\"\"/g,"\"");
                domData.push(ChatLog_message_create(msg,this.app.settings.myID));
                domData.push(<hr key={"ChatLog_msgSplitter_"+(typeof(msg.time)=="undefined"?"":msg.time)+"_"+msg.msgID}/>)
            })
            ReactDOM.unmountComponentAtNode(document.getElementById("ChatLog_Log"));
            ReactDOM.render(<div>{domData}</div>,document.getElementById("ChatLog_Log"));
            document.getElementById("ChatLog_Log").scrollTop = document.getElementById("ChatLog_Log").scrollHeight;
        }
    }

    clearChatLog(){
        ReactDOM.render(<div></div>,document.getElementById("ChatLog_Log"));
    }

    renderTab(){
        var logDir = path.join(app.settings.pso2DocumentLocation,"log");
        if(fs.existsSync(logDir)){
            var files = fs.readdirSync(path.join(app.settings.pso2DocumentLocation,"log")).filter((fn)=>{return fn.match(/^ChatLog[0-9]{8}_[0-9]{2}/g);}).reverse();
            var fileList = files.map((filename)=>{return <option key={"ChatLogFile_"+filename}>{filename}</option>});
            var content = <div style={{"display":"grid","gridTemplateRows":"min-content auto",height:"100%","justifyContent":"center"}}>
            <div><select id={"ChatLog_fileSelect"}>{fileList}</select>{" "}<button onClick={(()=>{return ()=>{this.readChatLog(logDir)}})()}>Read</button>{" "}<button onClick={((me)=>{return ()=>{me.clearChatLog()}})(this)}>Clear</button></div>
            <div id={"ChatLog_Log"} style={{"overflowY":"auto","marginTop":"15px", "maxWidth": "410px"}}></div>
            <style>{".ChatLog_msg{font-weight:bold;text-shadow:1.3px 1.3px black;display:block;}.CharLog_msgDetail{color:#888;font-weight:normal;font-size:70%;margin-left:5px;text-shadow:none;}"}</style>
            </div>
            return {"content":content, "label":"Chat log"};
        }else{
            return null;
        }
    }
}