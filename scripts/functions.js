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
    $("body").append('<div id="'+id+'" class="tabcontent">'+content+'</div>');
}
$(document).ready(function(){
    $(".tablinks[default]").click();
});