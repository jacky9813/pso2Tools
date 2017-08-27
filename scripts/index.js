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

newTab("tab_list","キャラクターリスト","<button onclick=\"location.reload();\">もう一度読む</button><table id=\"tab_list_chList\"></table>");
$("#tab_list_chList").append(`<tr><td><input type="text" placeholder="キャラ名前" id="newChName"></td><td><button onclick="pso2c.addCh($('#newChName').val(),()=>{location.reload()})">追加</button></td></tr>`);
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
        var out = `<tr><td>`+CName+`</td><td><button onclick="if(confirm('削除されます？')){pso2c.deleteCh(`+cid+`,()=>{location.reload();});}">削除</button></td><td>`+(taCDDone?"<span style=\"background:green;color:white;padding:5px;\">TA進行可能</span>":"<span style=\"padding:5px;background:red;color:white;\">TAクールダウン中</span>")+`</td></tr>`;
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
        content += `クールダウン状態：` + (taCDDone?"クールダウン完了":("クールダウン中 ("+taCDDate.toLocaleString()+"まで)")) + "<br>";
        content += `<br>TA時間設定：<br>`;
        content += `<button onclick="pso2c.TArun(`+cid+`,null,()=>{location.reload();})">現在</button><br><br>`;
        content += `<input type="datetime-local" id="taTime`+cid+`" value="`+nowStr+`"><button onclick="pso2c.TArun(`+cid+`,$('#taTime`+cid+`').val(),()=>{location.reload();});">この時間でTAやった</button><br><br>`;
        content += `<input type="datetime-local" id="taTime`+cid+`c" value="`+nowStr+`"><button onclick="var d = new Date($('#taTime`+cid+`c').val());d.setHours(d.getHours()-166);pso2c.TArun(`+cid+`,d.toLocaleString(),()=>{location.reload();});">この時点でクールダウン完了</button><br><br>`;

        content += `</div>`;

        content += `</div>`;

        newTab('tabCh'+cid,CName,content);

        
    })
})

