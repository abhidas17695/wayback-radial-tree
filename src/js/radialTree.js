var pluginName = "radialtree";
/**
 * Radial Tree Library
 * 
 * @param {Object} option
 */
function RadialTree(element, option){
    this.element = element;
    this.option = option;

    Init(element, option);

    function Init(container, option){
        var content = document.createElement("div");
        content.setAttribute("class", "radial-tree-content");
        var span = document.createElement("button");
        span.innerHTML = "&times";
        span.setAttribute("class", "RTClose");
        var divBtn = document.createElement("div");
        divBtn.setAttribute("id", "divBtn");
        var message = document.createElement("div");
        message.setAttribute("id", "message");

        var main = document.createElement("div");
        var sequence = document.createElement("p");
        var chart = document.createElement("div");
        sequence.setAttribute("id", "sequence");
        chart.setAttribute("id", "chart");
        main.setAttribute("id", "main");
        
        content.appendChild(divBtn);
        content.appendChild(span);
        content.appendChild(sequence);
        content.appendChild(chart);
        content.appendChild(message);
        content.style.display = "block";

        container.appendChild(content);

        span.onclick = function(){
            container.style.display = "none";
        }
    }

    function GetData(url, cb){
        var RequestURL = "https://web.archive.org/web/timemap/json?" + 
            "url=" + url + "/&" + 
            "fl=timestamp:4,original,urlkey&" + 
            "matchType=prefix&" + 
            "filter=statuscode:200&" + 
            "filter=mimetype:text/html&" + 
            "collapse=urlkey&" + 
            "collapse=timestamp:4";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", RequestURL, true);
		xhr.onerror = function(){
            cb(false, "An error occured. Please refresh the page and try again");
		};
		xhr.ontimeout = function(){
			cb(false, "Timeout, Please refresh the page and try again");
        }
        xhr.onload = function(){
            var response = JSON.parse(xhr.responseText);
            if (response.length == 0) cb(true, []);
            
            var array_Year = new Array();
            var index_Year = 0;

            for (var i=1; i<response.length; i++) {
                if (response[i][1].match(/jpg|pdf|png|form|gif/)) {
                    continue;
                }

                response[i][1] = (function(){
                    var tmpAry = response[i][2].split(",");
                    var domain = "";
                    var url = "";
    
                    for (var k=0; k<tmpAry.length-1; k++) {
                        if (k == 0) {
                            domain = tmpAry[0];
                        } else {
                            domain = tmpAry[k] + "." + domain;
                        } 
                    }

                    return tmpAry[tmpAry.length - 1].slice(-1) == "/" ? 
                        "http://www." + tmpAry[tmpAry.length - 1].replace(")/", "." + domain + "/") :
                        "http://www." + url + "/" + tmpAry[tmpAry.length - 1].replace(")/", "." + domain + "/");
                }());

                if (i == 1) {
                    array_Year[0] = new Array();
                } else if (response[i-1][1] == response[i][1]) {

                } else {
                    index_Year ++;
                }
            }
        }
    }
}

/**
 * Show Radial Tree element
 */
RadialTree.prototype.show = function(){
    this.element.style.display = "block";
}

/**
 * Hide Radial Tree element
 */
RadialTree.prototype.hide = function(){
    this.element.style.display = "none";
}

$.fn[pluginName] = function(options){
    this.each(function(){
        if (!$.data(this, pluginName)){
            $.data(this, pluginName, new RadialTree(this, options));
        }
    });

    return this;
}