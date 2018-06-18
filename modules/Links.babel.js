class Links_Link extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <tr><td><a link={this.props.link} onClick={((link)=>{return ()=>{Links_openLink(link);}})(this.props.link)}>{this.props.title}</a></td><td><button onClick={()=>{this.props.onDelete()}}>Delete</button></td></tr>
    }
}

function Links_create_LinkObj(props, Links_obj){
    return <Links_Link link={props.link} pklink={props.pklink} title={props.title} key={"Links_"+props.pklink.toString()} onDelete={((pklink)=>{return ()=>{Links_obj.deleteLink(pklink);}})(props.pklink)}/>
}

function Links_openLink(link){
    opn(link);
}

class Links extends pso2tools_module{
    constructor(app){
        super(app);
    }

    dbInitialize(){
        var dbPrep = [  "CREATE TABLE IF NOT EXISTS `links` (`pklink` INTEGER PRIMARY KEY AUTOINCREMENT,`link` TEXT UNIQUE NOT NULL,`title` TEXT NULL)",
                        "INSERT OR IGNORE INTO links(link, title) VALUES ('https://github.com/jacky9813/pso2Tools/releases','PSO2 Utility')"];
        for(var i=0;i<dbPrep.length;i++)
            this.app.db.run(dbPrep[i]);
    }

    deleteLink(pklink){
        if(!confirm("Delete the link?")){
            return;
        }
        var dbCmd = "DELETE FROM links WHERE pklink=?"
        this.app.db.run(dbCmd,[pklink]);
        this.app.render();
    }

    addLink(){
        var link = document.getElementById("Links_addLinkInput").value;
        var btn = document.getElementById("Links_addButton");
        var btn_prevContent = btn.innerHTML;
        btn.innerHTML = "Fetching title...";
        btn.setAttribute("disabled","");
        var xhr = new XMLHttpRequest();
        var me = this;
        xhr.open("GET",link);
        xhr.addEventListener("readystatechange",(e)=>{
            if(e.target.readyState !== 4){
                return;
            }
            var title = e.target.responseText.match(/<title[^>]*>([^<]*)<\/title[^>]*>/);
            if(Array.isArray(title)){
                title = title[1];
            }else{
                title = "";
            }
            if(typeof(title) == "undefined" || title==""){
                title = link;
            }
            me.app.db.run("INSERT INTO links(link, title) VALUES (?,?)",[link, title]);
            btn.innerHTML = btn_prevContent;
            document.getElementById("Links_addLinkInput").value = "";
            btn.removeAttribute("disabled");
            me.app.render();
        })
        xhr.send();
    }

    renderTab(){
        var links = this.app.db.run("SELECT * FROM links");
        var links_dom = []
        for(var i=0;i<links.length;i++){
            var dom = Links_create_LinkObj(links[i], this);
            if(dom) links_dom.push(dom);
        }
        var addLink = <tr><td><input type={"text"} id={"Links_addLinkInput"}/></td><td><button id={"Links_addButton"} onClick={((me)=>{return ()=>{me.addLink()}})(this)}>Add</button></td></tr>
        var content = <div><table><tbody>{links_dom}{addLink}</tbody></table><style>{"#tabLinks a{text-decoration: underline;}"}</style></div>
        return {content:content, label:"Links"};
    }
}