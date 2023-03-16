// VERSION [0.14] UNFINISHED BUILD -- Still pretty jank edition
// Latest 'stable' version available at https://gxpatcher.github.io/GX-Patcher/main.js
// version changelog
// - pointed updater to github page
// - added 'hide posts without images' mode and keybind
// - small formatting changes
// [TODO] 
// - fix scrolling page to match gallery with expanded images
// - account for auto-update images
// - auto-check for updates function
// - refactor code to be easier to follow// - added 'hide posts without images' mode and keybind


// [TODO] move and clean this up. these are accessed from the gui now
settings={
    fromLocation:true,
    preloadImages:true,
    checkForUpdates:false,
    keybinds:{
        nextImage:"d",
        prevImage:"a",
        toggleGallery:"g",
        expandAll:"x",
        hideImageless:"f",
        scrollToTop:"t",
        scrollToBottom:"y"
    }
}

version=0.13;
update=-1;
thumbGen=0;
scriptURL="https://gxpatcher.github.io/GX-Patcher/main.js";
imgC=0;
preload=[];
galleryOpen=0;
saveLock=0;
expanded=0;
expandedImg=[];
firstOpen=1;
start=0;
isScroll=0;

// CSS
$("<style type='text/css'>"+
    "#gallery{ width:100vw; height:100vh; position:fixed; left:0; top:0; z-index:999; }"+
    "#bigimg{ display:inline-block; background:#a8a8a826; height:100vh; width:400px; }"+
    "#bigimg>img{ width:100%; height:100%; object-fit:contain; }"+
    "#thumbs{ display:inline-block; background:#0b0b0b57; width:200px; height:100vh; float:right; overflow:scroll; }"+
    ".galleryThumb{ display:inline-block; width:100%; height:200px; background:grey; margin-bottom:0px; }"+
    ".galleryThumb>img{ width:100%; height:100%; object-fit:contain; }"+
    ".activeThumb{ background: #444242; }"+
    "#galleryStats { position: absolute; right: 210px; bottom: 10px; text-align:right; font-size:15px; }"+
    '.options_tab:nth-of-type(3) textarea {background-image: url(\"data: image/svg+xml,'+getLogo(120,"rgb(195, 210, 161)")+'"); background-repeat: no-repeat; background-position: 10px 10px; }'+
    "</style>").appendTo("head");

//$($(".options_tab")[1]).find("textarea").css({"background-image": 'url(\"data: image/svg+xml,<svg xmlns=\\\"http://www.w3.org/2000/svg\\\" width=\\\"120\\\" height=\\\"120\\\" fill=\\\"rgb(195, 210, 161)\\\" class=\\\"bi bi-bandaid\\\" viewBox=\\\"0 0 16 16\\\"> <path d=\\\"M14.121 1.879a3 3 0 0 0-4.242 0L8.733 3.026l4.261 4.26 1.127-1.165a3 3 0 0 0 0-4.242ZM12.293 8 8.027 3.734 3.738 8.031 8 12.293 12.293 8Zm-5.006 4.994L3.03 8.737 1.879 9.88a3 3 0 0 0 4.241 4.24l.006-.006 1.16-1.121ZM2.679 7.676l6.492-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492.001-.002Z\\\"/> <path d=\\\"M5.56 7.646a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708Zm1.415-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707ZM8.39 4.818a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707Zm0 5.657a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707ZM9.803 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707Zm1.414-1.414a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708ZM6.975 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707ZM8.39 7.646a.5.5 0 1 1-.708.708.5.5 0 0 1 .707-.708Zm1.413-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707Z\\\"/> </svg>\")', "background-repeat": 'no-repeat', "background-position": '10px 10px'})

// HTML
$("body").append('<div id="gallery">'+
    '<div id="galleryStats"></div>'+
    '<div id="bigimg"> <img src=""/> </div>'+
    '<div id="thumbs"> </div>'+
    '</div>');

$("#gallery").hide();
$("#bigimg").width($(window).width()-201);

function getLogo(size,color){
    size=(typeof(size)==="undefined"?12:size);
    color=(typeof(color)==="undefined"?"currentColor":color);
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="' + color + '" class="bi bi-bandaid" viewBox="0 0 16 16" height="' + size + '" width="' + size + '"> <path d="M14.121 1.879a3 3 0 0 0-4.242 0L8.733 3.026l4.261 4.26 1.127-1.165a3 3 0 0 0 0-4.242ZM12.293 8 8.027 3.734 3.738 8.031 8 12.293 12.293 8Zm-5.006 4.994L3.03 8.737 1.879 9.88a3 3 0 0 0 4.241 4.24l.006-.006 1.16-1.121ZM2.679 7.676l6.492-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492.001-.002Z"></path> <path d="M5.56 7.646a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708Zm1.415-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707ZM8.39 4.818a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707Zm0 5.657a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707ZM9.803 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707Zm1.414-1.414a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708ZM6.975 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707ZM8.39 7.646a.5.5 0 1 1-.708.708.5.5 0 0 1 .707-.708Zm1.413-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707Z"></path> </svg></i>';
}
// SETTINGS MENU
Options.add_tab(2,"foo","GX Patcher V "+version,"<span id='patcher_settings_box'></span>");
$($(".options_tab_icon")[2]).find("i").remove();
$($(".options_tab_icon")[2]).prepend('<i><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-bandaid" viewBox="0 0 16 16" height="26" width="26"> <path d="M14.121 1.879a3 3 0 0 0-4.242 0L8.733 3.026l4.261 4.26 1.127-1.165a3 3 0 0 0 0-4.242ZM12.293 8 8.027 3.734 3.738 8.031 8 12.293 12.293 8Zm-5.006 4.994L3.03 8.737 1.879 9.88a3 3 0 0 0 4.241 4.24l.006-.006 1.16-1.121ZM2.679 7.676l6.492-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492.001-.002Z"></path> <path d="M5.56 7.646a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708Zm1.415-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707ZM8.39 4.818a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707Zm0 5.657a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707ZM9.803 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707Zm1.414-1.414a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708ZM6.975 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707ZM8.39 7.646a.5.5 0 1 1-.708.708.5.5 0 0 1 .707-.708Zm1.413-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707Z"></path> </svg></i>');
// [TODO] add these progmatically
$("#patcher_settings_box").prepend('<form id="patcher_settings">'+
    '<hr><table id="patcher_table" style="margin: 0px;">'+
    ' <input data-sub="0" type="checkbox" id="checkForUpdates" '+(settings.fromLocation?"checked":"")+'>'+
    ' <label for="checkForUpdates"> Automatically check for updates</label></br>'+
    ' <input data-sub="0" type="checkbox" id="fromLocation" '+(settings.fromLocation?"checked":"")+'>'+
    ' <label for="fromLocation"> Expand from current position</label></br>'+
    ' <input data-sub="0" type="checkbox" id="preloadImages" '+(settings.preloadImages?"checked":"")+'>'+
    ' <label for="preloadImages"> Preload Images</label></br>'+
    ' </form>');

$("#patcher_settings_box").append('<input type="submit" id="patcher_submit" value="Save Settings" onclick="saveSettings(event);">');
$("#patcher_settings_box").append('</br><div><input type="submit" id="patcher_checkUpdates" onclick="checkForUpdate(event);" value="Check for Updates"><p style="display: inline-block;margin-left: 20px;font-weight: lighter;font-style: italic;font-size: 14px;" id="updateText">Not checked...</p></div>');

// add keybinds
    $(Object.keys(settings.keybinds)).each(function(){
        $("#patcher_table").append(
            '<tr>'+
            '<td><label for="'+this+'">'+this+':</label></td>'+
            '<td><input data-sub="keybinds" type="text" id="'+this+'" value="'+settings.keybinds[this]+'"></td>'+
            '</tr>'
        )
    })


// both options textarea
 $(".options_tab>textarea").css("height","270px");
// js options textarea
//$($(".options_tab")[1]).find("textarea").css("height","280px")


// this could be a css flex element instead of an on resize function
$( window ).resize(function() {
    $("#bigimg").width($(window).width()-201);
});

// Image preloading
$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}

// create a database of each post with images
// $(".post-image").each(function(){
    // img.push($(this));
    // preload.push($(this).parent().attr("href"));
    // image=$(this).context.attributes['src'].nodeValue;
    // $("#thumbs").append("<div id='gThumb-"+i+"'class='galleryThumb'><img src='"+image+"' /></div>");
    // i++;
// });
//img=[];
i=0;
img=[];
noImg=[];
$(".post").each(function () {
    pi = $(this).find(".post-image");
    if($(this).hasClass("op"))
        pi=$(".thread .post-image").first();
    if (pi.length == 0) { // no images
        noImg.push($(this));
    } else { // images
        img.push(pi);
        preload.push(pi.parent().attr("href"));
        image = pi.attr("src");
        $("#thumbs").append("<div id='gThumb-" + i + "'class='galleryThumb'><img src='" + image + "' /></div>");
        i++;
    }
})
imgC=i-1;

noImgT=0;
function toggleNoImg(){
    if(noImgT){
        $(noImg).each(function () { $(this).show() });
        noImgT=0;
    }else{
        $(noImg).each(function () { $(this).hide() });
        noImgT=1;
    }
}


thread="T"+$("[name=thread]").val();

// handler for settings that stay updated
storage={
    get data(){
        storage.dataObj=JSON.parse(localStorage.GID);
        // substitute currentImage with threadPos and the threads ID
        if(typeof(storage.dataObj.threadPos)==="undefined"){
            storage.dataObj.threadPos={};
        }
        if(typeof( storage.dataObj.threadPos[thread]) ==="undefined"){
            storage.dataObj.threadPos[thread]=0;
        }
        storage.dataObj.currentImg=storage.dataObj.threadPos[thread];
        return storage.dataObj;
    },
    set data(obj){
    	if(saveLock) return;
        // set the threadPos value as well as the currentImg
        if(typeof(obj) === "object"){
            for (const [key, value] of Object.entries(obj)) {
                if(key=="currentImg"){
                    storage.dataObj.threadPos["T"+$("[name=thread]").val()]=value;
                }
                storage.dataObj[key]=value;
            }
        }
        storage.dataObj.timestamp=Date.now();
        localStorage.GID=JSON.stringify(storage.dataObj);
    },
    dataObj:{
        threadPos:{},
        currentImg:0,
        settings:settings,
        timestamp:Date.now()
    }
};

if(typeof(localStorage.GID) === "undefined"){
        storage.dataObj.timestamp=Date.now();
        localStorage.GID=JSON.stringify(storage.dataObj);
}else{
    if(typeof(img[storage.data.currentImg])!=="undefined"){
        $("html, body").animate({ scrollTop: img[storage.data.currentImg].offset().top-200+"px" }); //[TODO] fix scroll
    }
}
    
var updateBody="";

function doUpdate(e){
    if(typeof(e)!=="undefined") e.preventDefault();
    $($(".options_tab")[1]).find("textarea").val(updateBody);
    Options.select_tab("user-js")
    $($(".options_tab")[1]).find("input[type=button]").val("Update GX Patcher");
    $($(".options_tab")[1]).find("input[type=button]").css({ "background-color": "rgb(132, 28, 31)", "color": "white" })
    $($(".options_tab")[1]).find("textarea").val(updateBody);
    $($(".options_tab")[1]).find("textarea").css({"background-image": 'url(\"data: image/svg+xml,<svg xmlns=\\\"http://www.w3.org/2000/svg\\\" width=\\\"120\\\" height=\\\"120\\\" fill=\\\"rgb(236, 167, 169)\\\" class=\\\"bi bi-bandaid\\\" viewBox=\\\"0 0 16 16\\\"> <path d=\\\"M14.121 1.879a3 3 0 0 0-4.242 0L8.733 3.026l4.261 4.26 1.127-1.165a3 3 0 0 0 0-4.242ZM12.293 8 8.027 3.734 3.738 8.031 8 12.293 12.293 8Zm-5.006 4.994L3.03 8.737 1.879 9.88a3 3 0 0 0 4.241 4.24l.006-.006 1.16-1.121ZM2.679 7.676l6.492-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492.001-.002Z\\\"/> <path d=\\\"M5.56 7.646a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708Zm1.415-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707ZM8.39 4.818a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707Zm0 5.657a.5.5 0 1 1-.708.707.5.5 0 0 1 .707-.707ZM9.803 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707Zm1.414-1.414a.5.5 0 1 1-.706.708.5.5 0 0 1 .707-.708ZM6.975 9.06a.5.5 0 1 1-.707.708.5.5 0 0 1 .707-.707ZM8.39 7.646a.5.5 0 1 1-.708.708.5.5 0 0 1 .707-.708Zm1.413-1.414a.5.5 0 1 1-.707.707.5.5 0 0 1 .707-.707Z\\\"/> </svg>\")', "background-repeat": 'no-repeat', "background-position": '10px 10px'})
}

function checkForUpdate(e){
    if(typeof(e)!=="undefined") e.preventDefault();
    $("#updateText").text("Checking for updates. . .");
    $.get(scriptURL, function(r){
        updateBody=r;
        newVersion=parseFloat(r.split("\n")[0].match(/\[(.*?)\]/)[0].slice(1,-1));
        update=(newVersion>version?1:0);
        $("#updateText").text((update?"New Update Version "+newVersion+" Available!":"No New Updates"));
         if(update){
             $("#patcher_checkUpdates").attr("value","Update");
             $("#patcher_checkUpdates").css({ "background-color": "rgb(132, 28, 31)", "color": "white" })
             $("#patcher_checkUpdates").attr("onClick","doUpdate(event)");
         }
        console.log("done checking for updates")
    }, "text");
}

function nextImg(){
    start=$(window).scrollTop();
    next="";
    ii=0;
    $(".post-image").each(function(){
        ii++
        if(this.y>start) {
            next=this;
            return false;
        }
    })
    if(ii!=0) ii--
    return ii;
}

// cycle through the form and apply the settings
function saveSettings(e){
    e.preventDefault();
    $("#patcher_settings input").each(function(){
        if($(this).attr("type")=="text"){
            settingValue= $(this).val();
        } else if($(this).attr("type")=="checkbox"){
            settingValue = $(this).prop("checked");
        }
        if($(this).attr("data-sub")==0){
            settings[$(this).attr("id")] = settingValue;
        }else{
            settings[$(this).attr("data-sub")][$(this).attr("id")] = settingValue;
        }
    })
    console.log(JSON.stringify(settings));
}


function galleryGo(index,doScroll){
    if(firstOpen){
       if(settings.preloadImages) $(preload.slice(index)).preload();
       firstOpen=0;
    }
    doScroll=(typeof(doScroll) === "undefined"?1:doScroll);
    $("#bigimg>img").attr("src",img[index].parent().attr("href"));
    $(".activeThumb").removeClass("activeThumb");
    $("#gThumb-"+index).addClass("activeThumb");
    storage.data = {currentImg:index};
    if(doScroll) scrollTo(index);
    $("html, body").animate({ scrollTop: img[index].offset().top-200+"px" }); // [TODO] this breaks with expand images because offset() is calculated at page load. 
    $("#galleryStats").text("Image "+(storage.data.currentImg+1)+" of "+(imgC+1));
}

function scrollTo(id){
    $("#thumbs").scrollTop(id*220-200);
}

function expandAll(){
    if(expanded){
        $(expandedImg).each(function(){
            this.click();
        });
    }else{
        start=(settings.fromLocation?$(window).scrollTop():0);
        $(".post-image").each(function(){
            if(this.y>start){
                $(this).click()
                expandedImg.push($(this)); // keep track of expanded images
            }
        })
    }
    expanded=(expanded?0:1);
}

$("#thumbs").on("click", ".galleryThumb", function(){
    id=this.id;
    index=id.substr(id.indexOf("-")+1);
    galleryGo(parseInt(index),0);
    console.log(id,index);
});

// Catalog
if(active_page=="catalog"){
    $(".mix").each(function(){
        // add a data attribute for number of images
        infoStr=$(this).find(".replies strong").text();
        images=parseInt(infoStr.substring(infoStr.lastIndexOf(":")+2));
        $(this).attr("data-images",images)
    });
    // add a sort option for the new data attribute, calls existing sorting function
    $("#sort_by").append('<option value="images:desc">Image Count</option>');
}


$( document ).scroll(function() {
    isScroll=2
});

const scrollHandler = setInterval(function() {
    if(isScroll==2){
        isScroll=1;
    }else if(isScroll==1){
        storage.data = {currentImg:nextImg()};
        console.log("done scrolling");
        isScroll=0;
    }
 }, 500);


$(window).on('beforeunload', function() {
    saveLock=1;
    $(window).scrollTop(0);
});


// Shortcuts
$(document).keydown(function(e){
    if( $("input, textarea").is(":focus")) return; // dont run if input is focussed
    if(active_page=="catalog") return; // dont run in catalog
    switch(e.key.toLowerCase()){
        case settings.keybinds.nextImage:
        case "arrowright":
            //if(!galleryOpen) break;
            storage.data = {currentImg:(storage.data.currentImg==imgC?0:storage.data.currentImg+1)}; //TODO function for delimiting current image
            galleryGo(storage.data.currentImg)
            break;
        case settings.keybinds.prevImage:
        case "arrowleft":
            //if(!galleryOpen) break;
            storage.data = {currentImg:(storage.data.currentImg==imgC?0:storage.data.currentImg-1)};
            galleryGo(storage.data.currentImg)
            break;
        case settings.keybinds.toggleGallery:
            galleryOpen=(galleryOpen?0:1);
            if(galleryOpen){
                galleryGo(nextImg());
            }
            $("#gallery").toggle()
            break;
        case settings.keybinds.hideImageless:
            toggleNoImg();
            break;
        case "escape":
            if(galleryOpen){
                $("#gallery").hide();
                galleryOpen=0;
            }
            break;
        case settings.keybinds.expandAll:
            expandAll();
            break;
        case settings.keybinds.scrollToTop:
            $("html, body").animate({ scrollTop: "0px" });
            break;
        case settings.keybinds.scrollToBottom:
        case "y":
            $("html, body").animate({ scrollTop: $(document).height()+"px" });
            break;
    }
});
