class Emergency extends pso2tools_module{
    constructor(app){
        super(app);
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
                var timeOffset = -((new Date).getTimezoneOffset() + 540);    // + n minutes from Tokyo Time to Local Time
                const weekday = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
                const day = [
                    "wednesday1",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                    "monday",
                    "tuesday",
                    "wednesday2"
                ]
                var dayTbl = {}
                var crossMonth = false; // Point the 1st day of the month.
                day.forEach(function(el,i){
                    dayTbl[el] = parseInt(content.querySelector("th.day-"+el).innerText.match(/(\d*)/g)[2]);    // Hope they won't change this LOL
                    if(!crossMonth)
                        crossMonth = (dayTbl[el] < (dayTbl[day[i-1]]|0)?el:false);
                });
                
                var today = weekday[(new Date).getDay()]

                if(today == "wednesday"){
                    today = today + (((new Date()).getHours()+(timeOffset/60))>16?"2":"1");
                }

                content.querySelectorAll("div.event-emergency").forEach((i)=>{
                    var name = i.querySelector("span").innerText;
                    var eday = i.parentNode.className.split("-")[1];
                    var time = i.parentNode.parentNode.className;
                    time = Number(time.split(/[\D*]/).filter((el)=>el != "").join(""));

                    var datetime = new Date();
                    datetime.setDate(dayTbl[eday]);
                    if(crossMonth && datetime.getDate()>15 && (day.indexOf(today) < day.indexOf(crossMonth))){
                        datetime.setMonth(datetime.getMonth + 1);
                    }
                    datetime.setHours(parseInt(time/100));
                    datetime.setMinutes((time % 100) + timeOffset);
                    datetime.setSeconds(0);
                    datetime.setMilliseconds(0);

                    if(datetime < (new Date()).setMinutes((new Date()).getMinutes()-30)){
                        return;
                    }
                    
                    emerList.push({name:name,time:datetime});
                })

                emerList.sort(function(el1, el2){
                    return el1.time - el2.time;
                });

                //Rendering
                var emerElem = []
                emerList.forEach(function(el,i){
                    emerElem.push(<tr key={"Emergency_emer"+i.toString()}><td>{el.name}</td><td>{el.time.toLocaleString()}</td></tr>);
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
        <div><button onClick={Emergency.getEmergencyInfo}>{"Get Emergency Time Table"}</button></div>
        <div id={"Emergency_TimeTable"}></div>
        </div>
        return {content:content,label:"Emergency"}
    }
}