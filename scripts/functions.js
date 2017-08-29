function openTab(e){
    $(".tabcontent").css("display","none");
    $(".tablinks").removeAttr("active");
    var btn = (e===undefined)?null:e.currentTarget;
    if(btn!=null){
        $("#"+$(btn).attr("x-target")).css("display","block");
        $(btn).attr("active","");
    }else{
        $("#"+$(".tablinks[default]").attr("x-target")).css("display","block");
        $(".tablinks[default]").attr("active","");
    }
}
function newTab(id,title,content){
    if(id=="" || title==""){
        throw "no id or title";
        return;
    }
    if($("#"+id).length > 0){
        throw id + " already exists";
        return;
    }
    $(".tab").append('<button class="tablinks" x-target="'+id+'" onclick="openTab(event)"'+($(".tablinks").length==0?" default":"")+'>'+title+'</button>');
    $(".tabcontainers").append('<div id="'+id+'" class="tabcontent">'+content+'</div>');
}
function refreshPage(){
    var target = $(".tablinks[active]").attr("x-target");
    var urlparam = new URLSearchParams(location.search.slice(1));
    urlparam.set("target",target);
    location.href = location.href.split("?")[0] + "?" + urlparam.toString();
}