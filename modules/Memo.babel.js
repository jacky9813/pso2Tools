class MemoBlock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'value': props.value
        }
    }

    handleChange(event){
        this.setState({value: event.target.value});
        this.props.onChange(this.props.cid, event.target.value);
    }

    render(){
        return <span>{"Memo:"}<br/><textarea value={this.state.value} onChange={(event)=>{this.handleChange(event)}} key={"memoBlock"+this.props.cid.toString()} style={{width: "100%" , minHeight: "300px"}}></textarea></span>
    }
}

class Memo extends pso2tools_module{
    /**
     * 
     * @param {sqlite3.Database} db 
     */
    constructor(app){
        super(app);
        this.db = app.db;
    }

    dbInitialize(){
        this.db.run("ALTER TABLE characters ADD COLUMN memo TEXT NULL;");
    }

    getContent(cid){
        return this.db.run("SELECT memo FROM characters WHERE cid=?",[cid])[0].memo;
    }

    setContent(cid, content){
        this.db.run("UPDATE characters SET memo=? WHERE cid=?",[content, cid]);
    }

    renderToolBlock(cid){
        var content = this.getContent(cid);
        return <MemoBlock value={content?content:""} cid={cid} onChange={(cid, content)=>{this.setContent(cid,content)}}></MemoBlock>;
    }

    renderCharTable(cid){
        return null;
    }
}