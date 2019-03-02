class Emergency extends pso2tools_module{
    constructor(app){
        super(app);
        this.createStyle(`
        tr.event-emergency:hover {
            background: #800;
        }
        tr.event-emergency {
            background: #500;
        }
        tr.event-league:hover {
            background: #c80;
        }
        tr.event-league {
            background: #960;
        }
        .blink{
            animation: blinker 1s step-start infinite;
        }
        @keyframes blinker{
            50%{
                background: none;
            }
        }
        `);
    }

    static getEmergencyInfo(){
        var sourceURI = "http://pso2.jp/players/boost/";
        var req = new XMLHttpRequest();
        req.open("GET",sourceURI);
        req.addEventListener("readystatechange",function(e){
            if(e.target.readyState === 4){
                if(e.target.status != 200){
                    return;
                }
                var parser = new DOMParser();
                var content = parser.parseFromString(e.target.responseText,"text/html");
                var emerList = [];
                var timeNow = new Date();
                var timeOffset = -(timeNow.getTimezoneOffset() + 540);    // + n minutes from Tokyo Time to Local Time

                content.querySelectorAll("div.event-emergency, div.event-league").forEach((i)=>{
                    var time, startT, endT, st_Mo, st_D, st_H, st_Mi,en_Mo, en_D, en_H, en_Mi;
                    [time, startT, endT] = i.querySelector("strong.start").parentNode.innerText.match(/(.*)～(.*)/);
                    [st_Mo, st_D, st_H, st_Mi] = startT.match(/(\d{2})/g).map((e)=>{return parseInt(e)});
                    [en_Mo, en_D, en_H, en_Mi] = endT.match(/(\d{2})/g).map((e)=>{return parseInt(e)});

                    var endTime = new Date();
                    if(endTime.getMonth() == 12 && (en_Mo == 1)){
                        endTime.setFullYear(endTime.getFullYear() + 1);
                    }
                    endTime.setMonth(en_Mo-1);
                    endTime.setDate(en_D);
                    endTime.setHours(en_H);
                    endTime.setMinutes(en_Mi + timeOffset);
                    endTime.setSeconds(0);
                    endTime.setMilliseconds(0);

                    if(endTime < timeNow){
                        return;
                    }

                    var startTime = new Date();
                    if(startTime.getMonth() == 12 && (st_Mo == 1)){
                        startTime.setFullYear(startTime.getFullYear() + 1);
                    }
                    startTime.setMonth(st_Mo-1);
                    startTime.setDate(st_D);
                    startTime.setHours(st_H);
                    startTime.setMinutes(st_Mi + timeOffset);
                    startTime.setSeconds(0);
                    startTime.setMilliseconds(0);

                    var eventTypeStr = i.querySelector("dt").innerText;

                    var eventContent = i.querySelectorAll("dd")[1].innerText

                    var newEvent = {start:startTime, end: endTime, class: i.className.match(/event-\w*/)[0], typeStr: eventTypeStr, content:eventContent}

                    if(emerList.find(function(el){return (el.class == newEvent.class) && (el.start.getTime() == newEvent.start.getTime())})==null)
                        emerList.push(newEvent);
                })

                emerList.sort(function(el1, el2){
                    return el1.start - el2.start;
                });

                //Rendering
                var emerElem = []
                emerList.forEach(function(el,i){
                    var happening = "";
                    if(timeNow.getTime() > el.start.getTime() && timeNow.getTime() < el.end.getTime())
                        happening = "blink"
                    emerElem.push(<tr key={"Emergency_emer"+i.toString()} className={el.class + " " + happening}><td>{el.typeStr}</td><td>{el.content}</td><td>{el.start.toLocaleString()}</td><td>{"~"}</td><td>{el.end.toLocaleString()}</td></tr>);
                })
                ReactDOM.unmountComponentAtNode(document.getElementById("Emergency_TimeTable"));
                ReactDOM.render(<table><tbody>{emerElem}</tbody></table>,document.getElementById("Emergency_TimeTable"));
            }
        });
        req.addEventListener("error",function(){
            alert("Connection to Internet required!");
        })
        req.send();
    }

    renderTab(){
        var content = <div>
        <div><button onClick={Emergency.getEmergencyInfo}>{"Get Event Time Table"}</button></div>
        <div id={"Emergency_TimeTable"}></div>
        </div>
        return {content:content,label:"Event"}
    }
}