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
            return <div className={"ChatLog_msg " + this.props.channel} style={{color:textColor[this.props.channel]}}>
            <span>{this.props.playerCharacter}<span className={"CharLog_msgDetail"}>{this.props.time+", "+this.props.playerID}</span><br/>{msgLines}</span>
            <hr />
            </div>
        return <div className={"ChatLog_msg " + this.props.channel} style={{color:textColor[this.props.channel],textAlign:"right"}}>
        <span><span className={"CharLog_msgDetail"}>{this.props.time+", "+this.props.playerID}</span>{this.props.playerCharacter}<br/>{msgLines}</span>
        <hr />
        </div>
    }
}

function ChatLog_message_create(props, myID=0){
    var time = typeof(props.time)=="undefined"?"":props.time;
    return <ChatLog_message myID={myID} time={time} msgID={props.msgID} channel={props.channel} playerID={props.playerID} playerCharacter={props.playerCharacter} message={props.message} key={"ChatLog_msg_"+time+"_"+props.msgID}/>
}

class ChatLog extends pso2tools_module{
    constructor(app){
        super(app);
        document.ChatLogshowCh = "ALL";
        this.createStyle(`
            .ChatLog_msg{font-weight:bold;text-shadow:1.3px 1.3px black;display:none;}
            .CharLog_msgDetail{color:#888;font-weight:normal;font-size:70%;margin-left:5px;text-shadow:none;}
            #ChatLog_Log.ALL .ChatLog_msg{display:block;}
            #ChatLog_Log.PUBLIC .ChatLog_msg.PUBLIC{display:block;}
            #ChatLog_Log.PARTY .ChatLog_msg.PARTY{display:block;}
            #ChatLog_Log.GUILD .ChatLog_msg.GUILD{display:block;}
            #ChatLog_Log.REPLY .ChatLog_msg.REPLY{display:block;}
            #ChatLog_Log{overflow-y:auto; margin-top:15px;min-width: 410px;}
            #ChatLog_Wrapper{display:grid;grid-template-rows:min-content auto;height:100%;justify-content:center;}`);
    }

    readChatLog(dirpath){
        var file = path.join(dirpath,document.getElementById("ChatLog_fileSelect").value);
        if(fs.existsSync(file)){
            var rawData = fs.readFileSync(file,{encoding:'utf-16le'});
            var domData = [];
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
            })
            ReactDOM.unmountComponentAtNode(document.getElementById("ChatLog_Log"));
            ReactDOM.render(<div>{domData}</div>,document.getElementById("ChatLog_Log"));
            document.getElementById("ChatLog_Log").scrollTop = document.getElementById("ChatLog_Log").scrollHeight;
        }
    }

    clearChatLog(){
        ReactDOM.render(<div></div>,document.getElementById("ChatLog_Log"));
    }

    changeCh(ch){
        document.ChatLogshowCh = ch.target.value;
        document.getElementById("ChatLog_Log").className = document.ChatLogshowCh;
    }

    renderTab(){
        var logDir = path.join(app.settings.pso2DocumentLocation,"log");
        if(fs.existsSync(logDir)){
            var files = fs.readdirSync(path.join(app.settings.pso2DocumentLocation,"log")).filter((fn)=>{return fn.match(/^ChatLog[0-9]{8}_[0-9]{2}/g);}).reverse();
            var fileList = files.map((filename)=>{return <option key={"ChatLogFile_"+filename}>{filename}</option>});
            var content = <div id={"ChatLog_Wrapper"}>
            <div><select id={"ChatLog_fileSelect"}>{fileList}</select>{" "}<button onClick={(()=>{return ()=>{this.readChatLog(logDir)}})()}>Read</button>{" "}<button onClick={((me)=>{return ()=>{me.clearChatLog()}})(this)}>Clear</button><br/>
            <select id={"ChatLog_Channel"} onChange={this.changeCh}>{["ALL","PUBLIC","PARTY","GUILD","REPLY"].map((ch)=>{return <option key={ch}>{ch}</option>})}</select></div>
            <div className={document.ChatLogshowCh} id={"ChatLog_Log"}></div>
            </div>
            return {"content":content, "label":"Chat log"};
        }else{
            return null;
        }
    }
}