class Emergency extends pso2tools_module{
    constructor(app){
        super(app);
    }

    static getEmergencyInfo(handler){
        var sourceURI = "http://pso2.jp/players/boost/";
        var req = new XMLHttpRequest();
        req.open("GET",sourceURI);
        req.addEventListener("readystatechange",function(e){
            if(e.target.readyState === 4){
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
                var today = weekday[(new Date).getDay()]

                if(today == "wednesday"){
                    today = today + (((new Date).getHour()+(timeOffset/60))>16?"2":"1");
                }

                content.querySelectorAll("div.event-emergency").forEach((i)=>{
                    var name = i.querySelector("span").innerText;
                    var eday = i.parentNode.className.split("-")[1];
                    var time = i.parentNode.parentNode.className;
                    if(day.indexOf(eday) < day.indexOf(today)){
                        //Discard emergency quest that happens in the past
                        return;
                    }
                    time = Number(time.split(/[\D*]/).filter((el)=>el != "").join(""));
                    if(day.indexOf(eday) == day.indexOf(today))
                        if(parseInt((time/100)+(timeOffset/60)) < parseInt((new Date()).getHours())){
                            return;
                        }
                    var datetime = new Date();
                    switch(eday){
                        case "wednesday1":
                            // Must be today
                            break;
                        case "wednesday2":
                            // Find Next Wednesday
                            while(datetime.getDay() != 3){
                                datetime.setDate(datetime.getDate() + 1);
                            }
                            break;
                        default:
                            while(weekday[datetime.getDay()] != eday){
                                datetime.setDate(datetime.getDate() + 1);
                            }
                    }
                    datetime.setHours(parseInt(time/100));
                    datetime.setMinutes((time % 100) + timeOffset);
                    datetime.setSeconds(0);
                    datetime.setMilliseconds(0);
                    emerList.push({name:name,time:datetime});
                })

                emerList.sort(function(el1, el2){
                    // Compare day
                    if(day.indexOf(el1.day)==day.indexOf(el2.day)){
                        // Same day, Compare time
                        return el1.time - el2.time;
                    }else{
                        return day.indexOf(el1.day) - day.indexOf(el2.day);
                    }
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