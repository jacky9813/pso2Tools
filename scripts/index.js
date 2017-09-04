// autorun section, avoid putting any function definition in this file

var dbFile = "../pso2Tools.db";
var pso2c = new pso2Character(dbFile);

function classLvOnChange(e){
    var handle = e.currentTarget;
    var cid = $(handle).attr("x-cid");
    var clsList = pso2c.emptyClassList;
    var classes = $("input.level[x-cid="+cid+"]");
    for(var i=0;i<classes.length;i++){
        clsList[$(classes[i]).attr("x-class")] = parseInt($(classes[i]).val());
    }
    pso2c.setLevel(cid,clsList);
}
function chMemoOnChange(e,cid){
    pso2c.setMemo(cid,e.currentTarget.value);
}

newTab("tab_links","リンク","");
(function(){
    //Generates list of links in links tab
    var content = '<table><tr><td><input type="text" id="link-addLink" placeholder="新しいリンク"></td><td><button id="link-btnLinkAdd" onclick="pso2c.newLink($(\'#link-addLink\').val(),null,()=>{refreshPage();});">追加</button></td></tr>';
    var links = pso2c.getLinks((r)=>{
        r.forEach((e) => {
            content += `<tr><td><a href="#" onclick="electron.shell.openExternal('${e.link}')">${e.title}</a></td><td><button onclick="if(confirm('削除されます？')){pso2c.deleteLink(${e.pklink},()=>{refreshPage();});}">削除</button></td></tr>`;
        });
        content += '</table>';
        $("#tab_links").append(content);
    });
})();


newTab("tab_list","キャラクターリスト","<br><br><table id=\"tab_list_chList\"></table>");
$("#tab_list_chList").append(`<tr><td><input type="text" placeholder="キャラ名前" id="newChName"></td><td><button onclick="pso2c.addCh($('#newChName').val(),()=>{location.reload()})">追加</button></td><td>TAクールダウン状態</td><td>TAクールダウン完成時間</td></tr>`);
pso2c.getChList((res)=>{
    res.forEach((r)=>{
        var chLv = pso2c.solveLevel(r.classLv);
        var cid = r.cid;
        var CName = r.CName;

        var taDate = new Date(r.lastTATime);
        var taCDDate = new Date(taDate);
        var now = new Date();
        taCDDate.setHours(taCDDate.getHours() + 166);   //TA CD time = 166 hours
        var taCDDone = taCDDate.getTime()<now.getTime();

        var nowDate = now.toLocaleDateString().split("-");
        var nowDateStr = "";
        Object.keys(nowDate).forEach((k)=>{
            nowDateStr += (nowDateStr==""?"":"-");
            if(nowDate[k].length<2){
                nowDateStr += ("00" + nowDate[k]).slice(-2);
            }else{
                nowDateStr += nowDate[k];
            }
        });
        var nowTime = now.toLocaleTimeString().split(":");
        var nowTimeStr = "";
        Object.keys(nowTime).forEach((k)=>{
            nowTimeStr += (nowTimeStr==""?"":":");
            nowTimeStr += ("00"+nowTime[k]).slice(-2);
        });
        var nowStr = nowDateStr + "T" + nowTimeStr;

        //Generating row for list page
        var out = `<tr id="chList${cid}"><td>`+CName+`</td><td><button onclick="if(confirm('削除されます？')){pso2c.deleteCh(`+cid+`,()=>{refreshPage();});}">削除</button></td><td>`+(taCDDone?"<span style=\"color:green;font-size: 15pt;\">\u25CF</span>TA進行可能</td><td>":("<span style=\"color:red;font-size: 15pt;\">\u25CF</span>TAクールダウン中</td><td>"+taCDDate.toLocaleString()))+`</td></tr>`;
        $("#tab_list_chList").append(out);

        //Adding new tab for detailed character information
        var content = `<div class="gridwrapper">`;
        //output Levels
        content += `<div>クラスレベル：<br><table>`;
        pso2c.classList.forEach((e)=>{
            content += `<tr><td>`+e+`</td><td><input type="number" class="level" x-cid="`+cid+`" x-class="`+e+`" step="1" max="`+pso2c.maxLevel.toString()+`" min="1" value="`+chLv[e]+`" onchange="classLvOnChange(event);"></td></tr>`;
        });
        content += `</table></div>`;

        //output TA
        content += `<div>`;
        content += `前回のTA：` + taDate.toLocaleString() + `<br>`;
        content += `クールダウン状態：` + (taCDDone?"<span style=\"color:green;font-size: 15pt;\">\u25CF</span>クールダウン完了":("<span style=\"color:red;font-size: 15pt;\">\u25CF</span>クールダウン中 ("+taCDDate.toLocaleString()+"まで)")) + "<br>";
        content += `<br>TA時間設定：<br>`;
        content += `<button onclick="pso2c.TArun(`+cid+`,null,()=>{refreshPage();})">現在</button><br><br>`;
        content += `<input type="datetime-local" id="taTime`+cid+`" value="`+nowStr+`"><button onclick="pso2c.TArun(`+cid+`,$('#taTime`+cid+`').val(),()=>{refreshPage();});">この時間でTAやった</button><br><br>`;
        content += `<input type="datetime-local" id="taTime`+cid+`c" value="`+nowStr+`"><button onclick="var d = new Date($('#taTime`+cid+`c').val());d.setHours(d.getHours()-166);pso2c.TArun(`+cid+`,d.toLocaleString(),()=>{refreshPage();});">この時点でクールダウン完了</button><br><br>`;

        content += `</div>`;

        // memo Area
        content += '<div>メモ：<br><textarea id="chMemo'+cid+'" onchange="chMemoOnChange(event,'+cid+');" style="max-width:100%;max-height:400px;width:100%;height:400px;">'+(r.memo==null?"":r.memo)+'</textarea>'

        content += `</div>`;

        newTab('tabCh'+cid,CName,content);

        
    })
})

$(".footer").append('<span style="color:#CCC;">PSO2 Tools '+pso2c.version+'</span>');

$(document).ready(()=>{
    setTimeout(()=>{
        var urlparam = new URLSearchParams(location.search.slice(1));
        if(urlparam.has("target")){
            var tgtbtn = $(".tablinks[x-target="+urlparam.get("target")+"]");
            if(tgtbtn.length > 0){
                tgtbtn[0].click();
            }else{
                $(".tablinks[default]")[0].click();
            }
        }else{
            $(".tablinks[default]").click();
        }
    },500);
});